import {
  editTransferRequest,
  getTransferRequest,
} from "../../../../Utility/inventory/transferProducts";
import { clearAuthentication } from "../auth/loginAction";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "./addProductAction";
import {
  addProductQuantity,
  editProductById,
} from "../../../../Utility/product/product";
import { initProductDatabase } from "../general/generalAction";
import { addProductLogs } from "../../../../Utility/inventory/addProduct";

export const getTransfersMethod = (token, setState, location, unit, clinic) => {
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });

    try {
      const getTransferResponse = await getTransferRequest(token, {
        finalUnit: unit,
        finalClinic: clinic,
        finalLocation: location,
      });
      if (getTransferResponse?.ok) {
        const transfers = await getTransferResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            transfers,
            loading: false,
          };
        });
      } else {
        throw {
          message: getTransferResponse.statusText,
          status: getTransferResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          transfers: [],
          loading: false,
        };
      });
    }
  };
};
export const validateReceiveTransfer = (state, setState) => {
  return (dispatch) => {
    const isValid = [...state.selectedTransfer.products].every(
      (pr) => Object.keys(pr.locationProduct).length
    );
    if (!isValid) {
      dispatch(
        sendProductMessenger(
          "a transfer Product is missing a location Product",
          true
        )
      );
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
    } else {
      setState((prevState) => {
        return {
          ...prevState,
          preview: true,
          issueTransfer: false,
        };
      });
    }
  };
};

export const receiveTransferProducts = (
  token,
  setState,
  state,
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
    [...state.selectedTransfer.products].forEach(async (product) => {
      let productResponse = null;
      try {
        const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
        if (unitName === "STORE") {
          productResponse = await addProductQuantity(
            token,
            product.locationProduct?.id,
            JSON.stringify({
              quantity: +(+product.quantity / +product.packSize).toFixed(2),
            })
          );
        } else {
          productResponse = await addProductQuantity(
            token,
            product.locationProduct?.id,
            JSON.stringify({ quantity: +product.quantity })
          );
        }

        //   CHECK FOR DIFFERENCE IN EXPIRIES
        if (
          Date.parse(product.expiryDate) <
          Date.parse(product.locationProduct?.expiryDate)
        ) {
          const expiryResponse = await editProductById(
            token,
            product.locationProduct?.id,
            JSON.stringify({ expiryDate: product.expiryDate })
          );
          if (!expiryResponse?.ok) {
            throw {
              message: expiryResponse.statusText,
              status: expiryResponse.status,
            };
          }
        }
        //   ADD PRODUCT LOGS
        if (productResponse?.ok) {
          const newProduct = await productResponse.json();
          // addProductLogs
          const movementResponse = Object.create(null);
          movementResponse.movement = `TRANSFER FROM ${state.selectedTransfer.location?.name}, ${state.selectedTransfer.clinic?.name} ${state.selectedTransfer.unit?.name}`;
          movementResponse.received =
            unitName === "STORE"
              ? +(+product.quantity / +product.packSize).toFixed(2)
              : +product.quantity;
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
            message: productResponse?.statusText,
            status: productResponse?.status,
          };
        }
      } catch (error) {
        if (error.status === 401) {
          dispatch(clearAuthentication(error.status));
        } else {
          dispatch(sendProductMessenger("unable to receive transfer", true));
          setTimeout(() => {
            dispatch(resetProductMessenger());
          }, 3000);
          setState((prevState) => {
            return {
              ...prevState,
              loading: false,
              transferModal: false,
            };
          });
          return;
        }
      }
    });
    try {
      //   transfer received true
      const transferResponse = await editTransferRequest(
        token,
        state.selectedTransfer._id
      );
      if (transferResponse?.ok) {
        dispatch(sendProductMessenger("transfer received"));
        setTimeout(() => {
          resetProductMessenger();
        }, 3000);
        dispatch(initProductDatabase(token, location, unit, clinic));
        dispatch(getTransfersMethod(token, setState, location, unit, clinic));
        setState((prevState) => {
          return {
            ...prevState,
            preview: false,
            loading: false,
            // selectedTransfer: null,
            selectedProduct: "",
            transferModal: false,
          };
        });
      } else {
        throw {
          message: transferResponse.statusText,
          status: transferResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("unable to receive transfer", true));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            transferModal: false,
          };
        });
        return;
      }
    }
  };
};
export const getCompletedTransfers = (
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
      const getTransferResponse = await getTransferRequest(token, {
        finalUnit: unit,
        finalClinic: clinic,
        finalLocation: location,
        startDate,
        endDate,
      });
      if (getTransferResponse?.ok) {
        const transfers = await getTransferResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            transfers,
            loading: false,
          };
        });
      } else {
        throw {
          message: getTransferResponse.statusText,
          status: getTransferResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          transfers: [],
          loading: false,
        };
      });
    }
  };
};
export const getUnitsTransfers = (
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
      const getTransferResponse = await getTransferRequest(token, {
        unit,
        clinic,
        location,
        startDate,
        endDate,
      });
      if (getTransferResponse?.ok) {
        const unitTransfers = await getTransferResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            unitTransfers,
            loading: false,
          };
        });
      } else {
        throw {
          message: getTransferResponse.statusText,
          status: getTransferResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          transfers: [],
          loading: false,
        };
      });
    }
  };
};
