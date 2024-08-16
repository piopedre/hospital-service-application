import { addProductLogs } from "../../../../Utility/inventory/addProduct";
import {
  addProductQuantity,
  editProductById,
  getAllRequistion,
  setRequistion,
} from "../../../../Utility/product/product";
import { clearAuthentication } from "../auth/loginAction";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "./addProductAction";
export const initReceiveRequistion = (
  token,
  setState,
  location,
  unit,
  clinic
) => {
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    try {
      const response = await getAllRequistion(token, {
        location,
        unit,
        clinic,
        issuance: true,
        reception: false,
      });
      if (response?.ok) {
        const requistions = await response.json();
        setState((prevState) => {
          return {
            ...prevState,
            requistions,
            loading: false,
          };
        });
      } else {
        throw {
          message: response.statusText,
          status: response.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
        };
      });
    }
  };
};

export const receiveRequistionMethod = (
  token,
  setState,
  state,
  location,
  unit,
  clinic
) => {
  return async (dispatch) => {
    try {
      const products = [...state.selectedRequistion.products];
      products.forEach(async (product, i) => {
        try {
          setState((prevState) => {
            return {
              ...prevState,
              modalPreview: false,
              receiveLoading: true,
            };
          });
          const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;

          if (unitName === "STORE") {
            const productResponse = await addProductQuantity(
              token,
              product.id,
              JSON.stringify({ quantity: +product.approvedQty })
            );
            if (+product.approvedQty > 0) {
              if (productResponse?.ok) {
                // check for expiry
                const newProduct = await productResponse.json();
                if (
                  new Date(Date.parse(newProduct.expiryDate)).getTime() >
                    new Date(Date.parse(product.expiryDate)).getTime() ||
                  product.onHandQuantity === 0
                ) {
                  const expiryResponse = await editProductById(
                    token,
                    newProduct._id,
                    JSON.stringify({ expiryDate: product.expiryDate })
                  );

                  if (!expiryResponse?.ok) {
                    throw {
                      message: expiryResponse.statusText,
                      status: expiryResponse.status,
                    };
                  }
                }
                // check for costPrice
                if (newProduct.costPrice !== product.costPrice) {
                  const costPriceResponse = await editProductById(
                    token,
                    newProduct._id,
                    JSON.stringify({ costPrice: product.costPrice })
                  );
                  if (!costPriceResponse?.ok) {
                    throw {
                      message: costPriceResponse.statusText,
                      status: costPriceResponse.status,
                    };
                  }
                }
                // check for packSize
                if (newProduct.packSize !== product.packSize) {
                  const packSizeResponse = await editProductById(
                    token,
                    newProduct._id,
                    JSON.stringify({ packSize: product.packSize })
                  );
                  if (!packSizeResponse?.ok) {
                    throw {
                      message: packSizeResponse.statusText,
                      status: packSizeResponse.status,
                    };
                  }
                }
                // addProductLogs
                const movementResponse = Object.create(null);
                movementResponse.movement = state.selectedRequistion.siv;
                movementResponse.received = +product.approvedQty;
                movementResponse.balance = newProduct.quantity;
                movementResponse.product = newProduct._id;
                movementResponse.location = location;
                movementResponse.unit = unit;
                const productLogsResponse = await addProductLogs(
                  token,
                  movementResponse
                );
                if (productLogsResponse?.ok) {
                  Object.keys(movementResponse).forEach(
                    (key) => delete movementResponse[key]
                  );
                } else {
                  throw {
                    message: productLogsResponse.statusText,
                    status: productLogsResponse.status,
                  };
                }
              } else {
                throw {
                  message: productResponse.statusText,
                  status: productResponse.status,
                };
              }
            }
          } else {
            if (+product.approvedQty > 0) {
              const productResponse = await addProductQuantity(
                token,
                product.id,
                JSON.stringify({
                  quantity: +product.approvedQty * product.packSize,
                })
              );
              if (productResponse?.ok) {
                const newProduct = await productResponse.json();
                if (
                  new Date(Date.parse(newProduct.expiryDate)).getTime() >
                    new Date(Date.parse(product.expiryDate)).getTime() ||
                  newProduct.quantity === 0
                ) {
                  // check for expiry
                  const expiryResponse = await editProductById(
                    token,
                    newProduct._id,
                    JSON.stringify({ expiryDate: product.expiryDate })
                  );
                  if (!expiryResponse?.ok) {
                    throw {
                      message: expiryResponse.statusText,
                      status: expiryResponse.status,
                    };
                  }
                }
                // check for costPrice
                if (newProduct.costPrice !== product.costPrice) {
                  const costPriceResponse = await editProductById(
                    token,
                    newProduct._id,
                    JSON.stringify({ costPrice: product.costPrice })
                  );
                  if (!costPriceResponse?.ok) {
                    throw {
                      message: costPriceResponse.statusText,
                      status: costPriceResponse.status,
                    };
                  }
                }
                // check for packSize
                if (newProduct.packSize !== product.packSize) {
                  const packSizeResponse = await editProductById(
                    token,
                    newProduct._id,
                    JSON.stringify({ packSize: product.packSize })
                  );
                  if (!packSizeResponse?.ok) {
                    throw {
                      message: packSizeResponse.statusText,
                      status: packSizeResponse.status,
                    };
                  }
                }
                // addProductLogs
                const movementResponse = Object.create(null);
                movementResponse.movement = `SIV ${state.selectedRequistion?.siv}`;
                movementResponse.received =
                  +product.approvedQty * +product.packSize;
                movementResponse.balance = newProduct.quantity;
                movementResponse.product = newProduct._id;
                movementResponse.location = location;
                movementResponse.unit = unit;
                movementResponse.clinic = clinic;
                const productLogsResponse = await addProductLogs(
                  token,
                  JSON.stringify(movementResponse)
                );
                if (productLogsResponse?.ok) {
                  Object.keys(movementResponse).forEach(
                    (key) => delete movementResponse[key]
                  );
                } else {
                  throw {
                    message: productLogsResponse.statusText,
                    status: productLogsResponse.status,
                  };
                }
              } else {
                throw {
                  message: productResponse.statusText,
                  status: productResponse.status,
                };
              }
            }
          }
        } catch (error) {
          if (error.status === 401) {
            dispatch(clearAuthentication(error.status));
          } else {
            dispatch(
              sendProductMessenger("unable to receive requistion", true)
            );
          }
        }
      });
      const requistionResponse = await setRequistion(
        token,
        state.selectedRequistion._id,
        JSON.stringify({ reception: true })
      );
      if (requistionResponse?.ok) {
        products.length = 0;
        dispatch(sendProductMessenger("requistion received successfully"));
        setState((prevState) => {
          return {
            ...prevState,
            receiveLoading: false,
            previewComponent: false,
            requistions: [],
          };
        });

        dispatch(
          initReceiveRequistion(token, setState, location, unit, clinic)
        );
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
        dispatch(sendProductMessenger("unable to receive requistion", true));
      }

      setState((prevState) => {
        return {
          ...prevState,
          receiveLoading: false,
          modalPreview: false,
        };
      });
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};
export const completedRequistionAction = (
  token,
  setState,
  location,
  unit,
  clinic,
  startDate,
  endDate
) => {
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    try {
      const response = await getAllRequistion(token, {
        location,
        unit,
        clinic,
        issuance: true,
        reception: true,
        startDate,
        endDate,
      });
      if (response?.ok) {
        const requistions = await response.json();
        setState((prevState) => {
          return {
            ...prevState,
            requistions,
            loading: false,
          };
        });
      } else {
        throw {
          message: response.statusText,
          status: response.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
        };
      });
    }
  };
};
