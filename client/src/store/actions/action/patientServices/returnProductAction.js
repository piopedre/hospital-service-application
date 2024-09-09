import { clearAuthentication } from "../auth/loginAction";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "../inventory/addProductAction";
import { initProductDatabase } from "../general/generalAction";
import { addProductLogs } from "../../../../Utility/inventory/addProduct";
import { addProductQuantity } from "../../../../Utility/product/product";

export const validateProductReturn = (state, setState) => {
  return (dispatch) => {
    const products = [...state.productList];
    const isQtyValid = products.every(
      (product) => +product.get("quantity") > 0
    );

    if (isQtyValid) {
      setState((prevState) => {
        return {
          ...prevState,
          preview: true,
        };
      });
    } else {
      dispatch(sendProductMessenger("A Quantity is not valid", true));

      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
    }
  };
};

export const returnProductMethod = (
  token,
  state,
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
      [...state.productList]
        .map((pr) => Object.fromEntries(pr))
        .forEach(async (cur) => {
          try {
            const productResponse = await addProductQuantity(
              token,
              cur.id,
              JSON.stringify({
                quantity: +cur.quantity,
              })
            );
            if (productResponse?.ok) {
              const newProduct = await productResponse.json();
              // addProductLogs
              const movementResponse = Object.create(null);
              movementResponse.movement = `Returned Product`;
              movementResponse.received = +cur.quantity;
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
                dispatch(initProductDatabase(token, location, unit, clinic));
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
              dispatch(sendProductMessenger("unable to return products", true));
              setTimeout(() => {
                dispatch(resetProductMessenger());
              }, 3000);
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

      dispatch(sendProductMessenger("products returned successfully ✓"));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
      return;
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("unable to return products", true));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
        return;
      }
    }
  };
};
