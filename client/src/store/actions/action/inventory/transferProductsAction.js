import { addTransferRequest } from "../../../../Utility/inventory/transferProducts";
import { updateProductQuantity } from "../../../../Utility/product/product";
import { addProductLogs } from "../../../../Utility/inventory/addProduct";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "./addProductAction";
import { initProductDatabase } from "../general/generalAction";
import { clearAuthentication } from "../auth/loginAction";
import { addNotificationRequest } from "../../../../Utility/users/usersChat";

export const validateTransfer = (state, setState) => {
  return (dispatch) => {
    const products = [...state.productList];
    const isQtyValid = products.every(
      (product) => +product.get("quantity") > 0
    );
    const isQtyAvailable = products.every(
      (product) => +product.get("onHandQuantity") >= +product.get("quantity")
    );

    if (!products.length) {
      dispatch(sendProductMessenger("No products in the transfer List", true));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
      return;
    }
    if (isQtyAvailable && isQtyValid) {
      setState((prevState) => {
        return {
          ...prevState,
          preview: true,
        };
      });
    } else {
      if (!isQtyValid) {
        dispatch(sendProductMessenger("A Quantity is not valid", true));
      } else {
        dispatch(
          sendProductMessenger(
            "The Quantity Approved is greater than the present quantity",
            true
          )
        );
      }
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
    }
  };
};

const validateSubmission = (form) => {
  const mainLocation = JSON.parse(sessionStorage.getItem("location"))?.name;
  const mainUnit = JSON.parse(sessionStorage.getItem("unit"))?.name;
  const mainClinic = JSON.parse(sessionStorage.getItem("clinic"))?.name;
  return (dispatch) => {
    if (
      form.location === mainLocation &&
      form.unit === mainUnit &&
      form.clinic === mainClinic
    ) {
      dispatch(sendProductMessenger("Please change location", true));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
      return false;
    } else {
      return true;
    }
  };
};
export const submitTransfer = (
  e,
  state,
  setState,
  token,
  location,
  unit,
  clinic,
  setTransferComponent,
  socket
) => {
  e.preventDefault();
  return async (dispatch) => {
    const form = Object.fromEntries(new FormData(e.target).entries());
    if (dispatch(validateSubmission(form))) {
      const finalClinic = state.clinics.find(
        (clinic) => clinic.name === form.clinic
      )._id;
      const finalLocation = state.locations.find(
        (loc) => loc.name === form.location
      )._id;
      const finalUnit = state.units.find((unit) => unit.name === form.unit)._id;
      const products = [...state.productList].map((product) =>
        Object.fromEntries(product)
      );
      const newForm = {
        products,
        location,
        unit,
        clinic,
        finalUnit,
        finalLocation,
        finalClinic,
      };
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });

      try {
        const addTransferResponse = await addTransferRequest(
          token,
          JSON.stringify(newForm)
        );
        if (addTransferResponse?.ok) {
          products.forEach(async (product) => {
            try {
              const productResponse = await updateProductQuantity(
                token,
                product.id,
                JSON.stringify({ quantity: +product.quantity })
              );
              if (productResponse?.ok) {
                const destClinic = state.clinics.find(
                  (clinic) => clinic.name === form.clinic
                ).name;
                const destLocation = state.locations.find(
                  (loc) => loc.name === form.location
                ).name;
                const destUnit = state.units.find(
                  (unit) => unit.name === form.unit
                ).name;
                const newProduct = await productResponse.json();
                const movement = new Map();
                movement.set(
                  "movement",
                  `TRANSFER TO ${destLocation}, ${destClinic} ${destUnit} `
                );
                movement.set("issued", product.quantity);
                movement.set("balance", newProduct.quantity);
                movement.set("product", product.id);
                movement.set("unit", unit);
                movement.set("location", location);
                movement.set("clinic", clinic);
                // add logs
                const movementResponse = await addProductLogs(
                  token,
                  JSON.stringify(Object.fromEntries(movement))
                );
                if (movementResponse?.ok) {
                  movement.clear();
                  dispatch(initProductDatabase(token, location, unit, clinic));
                } else {
                  throw {
                    message: movementResponse.statusText,
                    status: movementResponse.status,
                  };
                }
              } else {
                throw {
                  message: productResponse.statusText,
                  status: productResponse.status,
                };
              }
            } catch (error) {
              if (error.status === 401) {
                dispatch(clearAuthentication(error.status));
              } else {
                dispatch(
                  sendProductMessenger("problem transferring products", true)
                );
                setState((prevState) => {
                  return {
                    ...prevState,
                    loading: false,
                  };
                });
                setTimeout(() => {
                  dispatch(resetProductMessenger());
                }, 3000);
                return;
              }
            }
          });
          const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
          const clinicName = JSON.parse(sessionStorage.getItem("clinic"))?.name;
          const locationName = JSON.parse(
            sessionStorage.getItem("location")
          )?.name;
          const notificationResponse = await addNotificationRequest(
            token,
            JSON.stringify({
              type: "transfer",
              message: `Transfer was sent from ${locationName}, ${clinicName}, ${unitName}`,
              clinic: finalClinic,
              unit: finalUnit,
              location: finalLocation,
            })
          );
          if (notificationResponse?.ok) {
            setTransferComponent((prevState) => {
              return {
                ...prevState,
                transferComponent: false,
              };
            });
            setState((prevState) => {
              return {
                ...prevState,
                loading: false,
                preview: false,
                productList: [],
              };
            });
            const notification = await notificationResponse.json();

            socket.emit("requistion", {
              type: "transfer",
              locationName: form.location,
              unit: form.unit,
              clinic: form.clinic,
              message: `Transfer was sent from ${locationName}, ${clinicName}, ${unitName}`,
            });
            socket.emit("notification", notification);
            dispatch(sendProductMessenger("products transferred successfully"));
            setTimeout(() => {
              dispatch(resetProductMessenger());
            }, 3000);
          }
        } else {
          throw {
            message: addTransferResponse.statusText,
            status: addTransferResponse.status,
          };
        }
      } catch (error) {
        if (error.status === 401) {
          dispatch(clearAuthentication(error.status));
        } else {
          dispatch(sendProductMessenger("problem transferring products", true));
          setState((prevState) => {
            return {
              ...prevState,
              loading: false,
            };
          });
          setTimeout(() => {
            dispatch(resetProductMessenger());
          }, 3000);
          return;
        }
      }
    }
  };
};
