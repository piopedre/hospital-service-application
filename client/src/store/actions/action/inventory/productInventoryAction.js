import {
  SET_PRODUCT_LOG_LOADER,
  CLEAR_PRODUCT_LOG_LOADER,
  PRODUCT_LOG_SUCCESS,
  PRODUCT_LOG_FAILED,
  CLEAR_PRODUCTLOG_ERROR,
  clearAuthentication,
  sendProductMessenger,
  resetProductMessenger,
} from "../../../index";
import {
  getProductExpires,
  getProductLogsByProduct,
  otherUnitsInventory,
} from "../../../../Utility/product/product";
import { addNotificationRequest } from "../../../../Utility/users/usersChat";

const setProductLogLoader = () => {
  return {
    type: SET_PRODUCT_LOG_LOADER,
  };
};
const clearProductLogLoader = () => {
  return {
    type: CLEAR_PRODUCT_LOG_LOADER,
  };
};
const productLogSuccess = (productLog) => {
  return {
    type: PRODUCT_LOG_SUCCESS,
    productLog,
  };
};
const productLogFailed = (error) => {
  return {
    type: PRODUCT_LOG_FAILED,
    error,
  };
};

export const clearProductError = () => {
  return {
    type: CLEAR_PRODUCTLOG_ERROR,
  };
};

export const initProductLog = (id, token, object, setFinished) => {
  return async (dispatch) => {
    dispatch(setProductLogLoader());
    try {
      const response = await getProductLogsByProduct(token, object, id);
      if (response?.ok) {
        dispatch(clearProductLogLoader());
        const { productLog: productLogs, isFinished } = await response.json();
        setFinished(isFinished);
        dispatch(productLogSuccess(productLogs));
      } else {
        throw new Object({
          message: response.statusText,
          status: response.status,
        });
      }
    } catch (error) {
      dispatch(clearProductLogLoader());
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(productLogFailed(error));
      }
    }
  };
};
export const getPotentialExpiries = (
  token,
  location,
  unit,
  clinic,
  duration,
  setState
) => {
  return async (dispatch) => {
    let date = new Date();
    switch (duration) {
      case "MONTH":
        date = new Date(date.setMonth(date.getMonth() + 1));
        break;
      case "2 MONTHS":
        date = new Date(date.setMonth(date.getMonth() + 2));
        break;
      case "3 MONTHS":
        date = new Date(date.setMonth(date.getMonth() + 3));
        break;
      case "6 MONTHS":
        date = new Date(date.setMonth(date.getMonth() + 6));
        break;
      case "A YEAR":
        date = new Date(date.setFullYear(date.getFullYear() + 1));
        break;
      case "2 YEARS":
        date = new Date(date.setFullYear(date.getFullYear() + 2));
        break;
      default:
        date = new Date(duration);
    }

    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      const productResponse = await getProductExpires(token, {
        type: "potentialExpiries",
        location,
        unit,
        clinic,
        date,
      });

      if (productResponse?.ok) {
        const products = await productResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            productList: products,
          };
        });
        // dispatch(
        //   sendProductMessenger(
        //     `${
        //       products.length === 1
        //         ? `A product is to expire with ${duration}`
        //         : `${products.length} products are to expire within ${duration}`
        //     }`,
        //     true
        //   )
        // );
        // setTimeout(() => {
        //   dispatch(resetProductMessenger());
        // }, 3000);
      } else {
        throw {
          message: productResponse.statusText,
          status: productResponse.status,
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
          productList: [],
        };
      });
    }
  };
};

export const getPotentialExpiriesNotification = (
  token,
  location,
  unit,
  clinic,
  duration,
  socket
) => {
  return async (dispatch) => {
    let date = new Date();
    switch (duration) {
      case "MONTH":
        date = new Date(date.setMonth(date.getMonth() + 1));
        break;
      case "2 MONTHS":
        date = new Date(date.setMonth(date.getMonth() + 2));
        break;
      case "3 MONTHS":
        date = new Date(date.setMonth(date.getMonth() + 3));
        break;
      case "6 MONTHS":
        date = new Date(date.setMonth(date.getMonth() + 6));
        break;
      case "A YEAR":
        date = new Date(date.setFullYear(date.getFullYear() + 1));
        break;
      case "2 YEARS":
        date = new Date(date.setFullYear(date.getFullYear() + 2));
        break;
      default:
        date = new Date(duration);
    }

    try {
      const productResponse = await getProductExpires(token, {
        type: "potentialExpiries",
        location,
        unit,
        clinic,
        date,
      });

      if (productResponse?.ok) {
        const products = await productResponse.json();
        dispatch(
          sendProductMessenger(
            `${
              products.length === 1
                ? `A product is to expire with ${duration}`
                : `${products.length} products are to expire within ${duration}`
            }`,
            true
          )
        );
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
        const notice = JSON.parse(sessionStorage.getItem("notice"));
        if (!notice) {
          const notificationResponse = await addNotificationRequest(
            token,
            JSON.stringify({
              type: "potentialExpiries",
              message: `${
                products.length === 1
                  ? `A product is to expire with ${duration}`
                  : `${products.length} products are to expire within ${duration}`
              }`,
              location,
              clinic,
              unit,
            })
          );
          if (notificationResponse?.ok) {
            const notification = await notificationResponse.json();
            if (socket) {
              socket.emit("notification", notification);
            }

            sessionStorage.setItem("notice", JSON.stringify(true));
          }
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
      }
    }
  };
};

export const getProductExpiryAction = (
  token,
  location,
  unit,
  clinic,
  socket
) => {
  return async (dispatch) => {
    try {
      const productResponse = await getProductExpires(token, {
        type: "expired",
        location,
        unit,
        clinic,
        date: new Date(),
      });
      if (productResponse?.ok) {
        const products = await productResponse.json();
        dispatch(
          sendProductMessenger(
            `${products.length} product${products.length > 1 ? "s" : ""} ${
              products.length > 1 ? "are" : "is"
            } now expired, kindly add ${
              products.length > 1 ? "them" : "it"
            } to expiries`,
            true
          )
        );
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 4000);
        const notice = JSON.parse(sessionStorage.getItem("expiryNotification"));
        if (socket && !notice) {
          const notificationResponse = await addNotificationRequest(
            token,
            JSON.stringify({
              type: "expiries",
              message: `${products.length} product${
                products.length > 1 ? "s" : ""
              } ${products.length > 1 ? "are" : "is"} now expired, kindly add ${
                products.length > 1 ? "them" : "it"
              } to expiries`,
              location,
              unit,
              clinic,
            })
          );
          if (notificationResponse?.ok) {
            const notification = await notificationResponse.json();
            socket.emit("notification", notification);
            sessionStorage.setItem("expiryNotification", JSON.stringify(true));
          }
        }
      } else {
        dispatch(
          getPotentialExpiriesNotification(
            token,
            location,
            unit,
            clinic,
            "6 MONTHS",
            socket
          )
        );
        throw {
          message: productResponse.statusText,
          status: productResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
    }
  };
};

export const getOtherUnitsInventoryAction = (
  token,
  productId,
  setState,
  productName
) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
          productName,
        };
      });
      const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
      let response = null;
      if (unitName === "STORE") {
        response = await otherUnitsInventory(token, productId, {
          productName,
          store: "STORE",
        });
      } else {
        response = await otherUnitsInventory(token, productId, {
          productName,
        });
      }

      if (response?.ok) {
        const productList = await response.json();
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            productList,
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
