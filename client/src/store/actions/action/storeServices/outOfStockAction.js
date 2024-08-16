import { getOutOfStockRequest } from "../../../../Utility/product/product";
import { clearAuthentication } from "../auth/loginAction";

export const getOutOfStock = (setState, token, object) => {
  if (!object.startDate || !object.endDate) {
    const date = new Date();
    const newDate = new Date(date.setMonth(date.getMonth(), 1));
    const startDate = `${newDate.getFullYear()}-${
      newDate.getMonth() + 1
    }-${newDate.getDate()}`;
    const newEndDate = new Date(date.setMonth(date.getMonth() + 1, 1));
    const endDate = `${newEndDate.getFullYear()}-${
      newEndDate.getMonth() + 1
    }-${newEndDate.getDate()}`;

    object.endDate = endDate;
    object.startDate = startDate;
  }

  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
          form: false,
        };
      });
      const outOfStockResponse = await getOutOfStockRequest(token, object);
      if (outOfStockResponse?.ok) {
        const newReport = await outOfStockResponse.json();
        const report = newReport.reduce((acc, cur) => {
          const duplicate = acc.find((pr) => pr.productName === cur.name);
          if (duplicate) {
            const index = acc.findIndex((pr) => pr.productName === cur.name);
            duplicate.number = duplicate.number + 1;
            acc.splice(index, 1, duplicate);
          } else {
            const newReport = {
              productName: cur.name,
              number: 1,
            };
            acc.push(newReport);
          }
          return acc;
        }, []);
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            report,
          };
        });
      } else {
        throw {
          message: outOfStockResponse.statusText,
          status: outOfStockResponse.status,
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

export const initOutOfStock = (setState, token, object) => {
  return (dispatch) => {
    dispatch(getOutOfStock(setState, token, object));
  };
};
