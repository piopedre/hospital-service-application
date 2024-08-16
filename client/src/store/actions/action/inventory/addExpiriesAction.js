import {
  addExpiriesRequest,
  getExpiriedProduct,
  updateProductQuantity,
} from "../../../../Utility/product/product";
import { clearAuthentication } from "../auth/loginAction";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "./addProductAction";
import { addProductLogs } from "../../../../Utility/inventory/addProduct";
import { initProductDatabase } from "../../action/general/generalAction";
export const validateAddExpiries = (state, setState) => {
  return (dispatch) => {
    const products = [...state.productList];
    const isQtyValid = products.every((product) => +product.get("quantity"));
    const isQtyAvailable = products.every(
      (product) => +product.get("onHandQuantity") >= +product.get("quantity")
    );
    const isDateValid = products.every(
      (product) =>
        Date.parse(product.get("expiryDate")) < Date.parse(new Date())
    );

    if (isQtyAvailable && isQtyValid & isDateValid) {
      setState((prevState) => {
        return {
          ...prevState,
          preview: true,
        };
      });
    } else {
      if (!isQtyValid) {
        dispatch(sendProductMessenger("A Quantity is not valid", true));
      } else if (!isQtyAvailable) {
        dispatch(
          sendProductMessenger(
            "The Quantity Approved is greater than the present quantity",
            true
          )
        );
      } else {
        dispatch(sendProductMessenger("Please change the expiry Date", true));
      }
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
    }
  };
};

export const addExpiriesMethod = (
  token,
  state,
  setState,
  location,
  unit,
  clinic
) => {
  return (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    try {
      [...state.productList]
        .map((product) => Object.fromEntries(product))
        .forEach(async (cur) => {
          try {
            const addExpiryResponse = await addExpiriesRequest(
              token,
              cur.id,
              JSON.stringify({
                name: cur.name,
                quantity: +cur.quantity,
                expiryDate: cur.expiryDate,
                totalPrice: +cur.totalPrice,
                packSize: cur.packSize,
                date: new Date(),
              })
            );
            if (addExpiryResponse?.ok) {
              const productResponse = await updateProductQuantity(
                token,
                cur.id,
                JSON.stringify({ quantity: +cur.quantity })
              );
              if (productResponse?.ok) {
                const newProduct = await productResponse.json();
                const movement = new Map();
                movement.set("movement", `EXPIRED`);
                movement.set("issued", cur.quantity);
                movement.set("balance", newProduct.quantity);
                movement.set("product", cur.id);
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
                } else {
                  throw {
                    message: movementResponse.statusText,
                    status: movementResponse.status,
                  };
                }
              }
            } else {
              throw {
                message: addExpiryResponse.statusText,
                status: addExpiryResponse.status,
              };
            }
          } catch (error) {
            if (error.status === 401) {
              dispatch(clearAuthentication(error.status));
            } else {
              dispatch(
                sendProductMessenger(
                  `Unable to add Expiry Product${
                    state.productList.length > 1 ? "s" : ""
                  }`,
                  true
                )
              );
              setTimeout(() => {
                dispatch(resetProductMessenger());
              }, 3000);
              setState((prevState) => {
                return {
                  ...prevState,
                  loading: false,
                };
              });
              return;
            }
          }
        });
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
          productList: [],
          preview: false,
        };
      });
      dispatch(initProductDatabase(token, location, unit, clinic));
      dispatch(sendProductMessenger("Expired Products added"));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
      }
    }
  };
};
export const getExpiriedProductMethod = (
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
      const expiredResponse = await getExpiriedProduct(token, {
        unit,
        clinic,
        location,
        startDate,
        endDate,
      });
      if (expiredResponse?.ok) {
        const expiries = await expiredResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            expiries,
            loading: false,
          };
        });
      } else {
        throw {
          message: expiredResponse.statusText,
          status: expiredResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          expiries: [],
          loading: false,
        };
      });
    }
  };
};
