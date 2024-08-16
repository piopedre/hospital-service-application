import { addProductLogs } from "../../../../Utility/inventory/addProduct";
import {
  getAllRequistion,
  setRequistion,
  updateProductQuantity,
} from "../../../../Utility/product/product";
import { addNotificationRequest } from "../../../../Utility/users/usersChat";
import { clearAuthentication } from "../auth/loginAction";
import { initProductDatabase } from "../general/generalAction";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "../inventory/addProductAction";

export const initRequistion = (token, setState, location, unit) => {
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  return async (dispatch) => {
    try {
      const requistionResponse = await getAllRequistion(token, {
        issuance: false,
        reception: false,
      });
      dispatch(initProductDatabase(token, location, unit, clinic));
      if (requistionResponse?.ok) {
        const requistions = await requistionResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            requistions,
          };
        });
      } else {
        throw {
          message: requistionResponse.statusText,
          status: requistionResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
    }
  };
};

export const validateIssue = (state, setState) => {
  return async (dispatch) => {
    const requistionProducts = [...state.selectedRequistion.products];
    const isValid = requistionProducts.every((product) => product.storeProduct);
    if (isValid) {
      const isQtyValid = requistionProducts.every(
        (product) => product.approvedQty <= product.storeProduct.quantity
      );
      if (isQtyValid) {
        setState((prevState) => {
          return {
            ...prevState,
            previewComponent: true,
            requistionComponent: false,
          };
        });
      } else {
        dispatch(
          sendProductMessenger(
            "stock required is greater than  store available quantity on an item",
            true
          )
        );
      }
    } else {
      dispatch(
        sendProductMessenger("store product not available on an item", true)
      );
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};
export const issueRequistionMethod = (
  token,
  setState,
  state,
  location,
  unit,
  clinic,
  socket
) => {
  return async (dispatch) => {
    try {
      const requistionProducts = [...state.selectedRequistion.products];

      // const selectedRequistion = structuredClone(state.selectedRequistion);
      const selectedRequistion = JSON.parse(
        JSON.stringify(state.selectedRequistion)
      );
      const requistion = {
        id: selectedRequistion._id,
        siv: selectedRequistion.siv,
        location: selectedRequistion.location,
        unit: selectedRequistion.unit,
        clinic: selectedRequistion.clinic,
      };

      setState((prevState) => {
        return {
          ...prevState,
          issueLoading: true,
        };
      });

      // remove the quantity from store quantity
      requistionProducts.forEach(async (product) => {
        try {
          if (product.approvedQty > 0) {
            if (
              new Date(product.storeProduct.expiryDate).getTime() <
              new Date(product.expiryDate).getTime()
            ) {
              product.expiryDate = product.storeProduct.expiryDate
                .split("T")[0]
                .slice(0, -3);
            }
            const updatedStoreItemResponse = await updateProductQuantity(
              token,
              product.storeProduct._id,
              JSON.stringify({ quantity: +product.approvedQty })
            );
            if (updatedStoreItemResponse?.ok) {
              const newProduct = await updatedStoreItemResponse.json();
              // setProductLogs
              const movementResponse = Object.create(null);

              movementResponse.movement = `${requistion?.location?.name} ${requistion?.clinic?.name} ${requistion?.unit?.name}  SIV ${requistion?.siv}`;
              movementResponse.issued = +product.approvedQty;
              movementResponse.balance = newProduct.quantity;
              movementResponse.product = newProduct._id;
              movementResponse.location = location;
              movementResponse.unit = unit;
              movementResponse.clinic = clinic;
              const productLogResponse = await addProductLogs(
                token,
                JSON.stringify(movementResponse)
              );

              if (productLogResponse?.ok) {
                Object.keys(movementResponse).forEach(
                  (key) => delete movementResponse[key]
                );
              } else {
                throw {
                  message: productLogResponse.statusText,
                  status: productLogResponse.status,
                };
              }
            } else {
              throw {
                status: updatedStoreItemResponse.status,
                message: updatedStoreItemResponse.statusText,
              };
            }
          }
        } catch (error) {
          if (error.status === 401) {
            dispatch(clearAuthentication(error.status));
          }
        }
      });
      const mainRequistionProducts = JSON.parse(
        JSON.stringify(
          [...requistionProducts].map((product) => {
            delete product.storeProduct;
            return product;
          })
        )
      );
      const quantityPrice = mainRequistionProducts.reduce((acc, cur) => {
        acc += +cur.quantityPrice;
        return acc;
      }, 0);
      const requistionResponse = await setRequistion(
        token,
        requistion.id,
        JSON.stringify({
          products: mainRequistionProducts,
          issuance: true,
          costOfRequistion: quantityPrice,
        })
      );
      if (requistionResponse?.ok) {
        const newRequistion = await requistionResponse.json();
        const notificationResponse = await addNotificationRequest(
          token,
          JSON.stringify({
            type: "issueRequistion",
            message: ` SIV ${selectedRequistion.siv} Requistion has been issued`,
            clinic: newRequistion.clinic?._id,
            unit: newRequistion.unit?._id,
            location: newRequistion.location?._id,
          })
        );
        if (notificationResponse?.ok) {
          const notification = await notificationResponse.json();
          dispatch(sendProductMessenger("Requistion has been issued"));
          socket.emit("requistion", {
            type: "issuedRequistion",
            message: ` SIV ${selectedRequistion.siv} Requistion has been issued`,
            clinicName: newRequistion.clinic?.name,
            unitName: newRequistion.unit?.name,
            locationName: newRequistion.location?.name,
          });
          socket.emit("notification", notification);

          Object.keys(requistion).forEach((key) => delete requistion[key]);

          dispatch(initRequistion(token, setState, location, unit));
          setState((prevState) => {
            return {
              ...prevState,
              issueLoading: false,
              previewComponent: false,
              requistions: [],
            };
          });
        }
      } else {
        throw {
          message: requistionResponse.statusText,
          status: requistionResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("unable to issue requistion", true));
      }
      setState((prevState) => {
        return {
          ...prevState,
          issueLoading: false,
        };
      });
    }

    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};

// STORE ISSUE HOLD
export const holdIssue = (state, setState) => {
  return (dispatch) => {
    const valid = state.products.some((product) => +product.approvedQty);
    if (valid) {
      const requistion = {
        ...state,
      };
      if (sessionStorage.getItem("heldRequistions")) {
        const heldRequistions = JSON.parse(
          sessionStorage.getItem("heldRequistions")
        );
        heldRequistions.push(requistion);
        sessionStorage.setItem(
          "heldRequistions",
          JSON.stringify(heldRequistions)
        );
      } else {
        const heldRequistions = [];
        heldRequistions.push(requistion);
        sessionStorage.setItem(
          "heldRequistions",
          JSON.stringify(heldRequistions)
        );
      }
      setState((prevState) => {
        return {
          ...prevState,
          requistionComponent: false,
          selectedRequistion: null,
          selected: false,
        };
      });
    } else {
      dispatch(
        sendProductMessenger(
          "no changes have been made to this requistion",
          true
        )
      );

      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
    }
  };
};
export const retrieveRequistion = (
  setState,
  id,
  token,
  location,
  unit,
  clinic
) => {
  return (dispatch, getState) => {
    const requistions = JSON.parse(sessionStorage.getItem("heldRequistions"));
    dispatch(initProductDatabase(token, location, unit, clinic));

    const database = JSON.parse(
      JSON.stringify([...getState().general.products.database])
    );

    const requistionIndex = requistions.findIndex((req) => req._id === id);

    const [requistion] = requistions.splice(requistionIndex, 1);
    sessionStorage.setItem("heldRequistions", JSON.stringify(requistions));
    requistion.products.forEach((product) => {
      const storeProduct = product.storeProduct;
      const mainStoreProduct = database.find(
        (storeP) => storeP._id === storeProduct._id
      );
      if (mainStoreProduct.quantity !== storeProduct.quantity) {
        storeProduct.quantity = mainStoreProduct.quantity;
      }
    });
    setState((prevState) => {
      return {
        ...prevState,
        selectedRequistion: requistion,
      };
    });
  };
};
