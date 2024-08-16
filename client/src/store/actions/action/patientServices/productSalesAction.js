import { addProductQuantity } from "../../../../Utility/product/product";
import {
  deleteSaleRequest,
  editSaleRequest,
} from "../../../../Utility/sales/sales";
import { addProductLogs } from "../../../../Utility/inventory/addProduct";
import {
  initProductSalesDatabase,
  setSalesLoader,
} from "../general/generalAction";
import { clearAuthentication } from "../auth/loginAction";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "../inventory/addProductAction";
import { updateDepositBalance } from "../../../../Utility/patient/patient";
import { addReceipt } from "../../../../Utility/general/general";
export const deleteSale = (
  token,
  id,
  setState,
  location,
  unit,
  clinic,
  products
) => {
  return async (dispatch) => {
    try {
      dispatch(setSalesLoader());
      const deleteResponse = await deleteSaleRequest(token, id);
      if (deleteResponse?.ok) {
        const sale = await deleteResponse.json();
        products.forEach(async (product) => {
          try {
            const updatedProductResponse = await addProductQuantity(
              token,
              product.id,
              JSON.stringify({ quantity: +product.quantity })
            );
            if (updatedProductResponse?.ok) {
              const newProduct = await updatedProductResponse.json();
              const movement = Object.create(null);
              movement.movement = `Deleted Sale`;
              movement.received = +product.quantity;
              movement.balance = newProduct.quantity;
              movement.product = newProduct._id;
              movement.location = location;
              movement.unit = unit;
              movement.clinic = clinic;
              const productLogResponse = await addProductLogs(
                token,
                JSON.stringify(movement)
              );
              if (productLogResponse?.ok) {
                Object.keys(movement).forEach((key) => delete movement[key]);
              } else {
                throw {
                  message: productLogResponse.statusText,
                  status: productLogResponse.status,
                };
              }
            } else {
              throw {
                message: updatedProductResponse.statusText,
                status: updatedProductResponse.status,
              };
            }
          } catch (error) {
            if (error.status === 401) {
              dispatch(clearAuthentication(error.status));
            } else {
              dispatch(
                sendProductMessenger("unable to add product Logs", true)
              );
            }
          }
        });
        if (sale.patientType === "IN-PATIENT") {
          const addDepositResponse = await updateDepositBalance(
            token,
            sale.patient,
            JSON.stringify({ amount: +sale.totalPrice })
          );
          if (addDepositResponse?.ok) {
            setState((prevState) => {
              return {
                ...prevState,
                selectedSale: null,
                preview: false,
              };
            });
            dispatch(sendProductMessenger("sale deleted SuccessFully ✓"));
            dispatch(initProductSalesDatabase(token, location, unit, clinic));
          } else {
            throw {
              message: addDepositResponse.statusText,
              status: addDepositResponse.status,
            };
          }
        } else {
          setState((prevState) => {
            return {
              ...prevState,
              selectedSale: null,
              preview: false,
            };
          });
          dispatch(sendProductMessenger("sale deleted SuccessFully ✓"));
          dispatch(initProductSalesDatabase(token, location, unit, clinic));
        }
      } else {
        throw {
          message: deleteResponse.statusText,
          status: deleteResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("unable to delete sale", true));
        dispatch(setSalesLoader());
      }
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};
export const addReceiptHandler = (
  e,
  token,
  setState,
  id,
  location,
  unit,
  clinic
) => {
  e.preventDefault();
  return async (dispatch) => {
    const form = Object.fromEntries(new FormData(e.target).entries());
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      const response = await addReceipt(token, JSON.stringify(form));
      if (response?.ok) {
        const receipt = await response.json();
        const saleResponse = await editSaleRequest(
          token,
          id,
          JSON.stringify({ receipt: receipt._id })
        );
        if (saleResponse?.ok) {
          dispatch(sendProductMessenger("receipt was added"));
          setTimeout(() => {
            dispatch(resetProductMessenger());
          }, 3000);
          setState((prevState) => {
            return {
              ...prevState,
              loading: false,
              preview: false,
            };
          });
          dispatch(initProductSalesDatabase(token, location, unit, clinic));
        }
      } else {
        throw {
          status: response.status,
          message: response.statusText,
        };
      }
    } catch (error) {
      if (error.status) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("unable to add receipt", true));
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
      }
    }
  };
};
