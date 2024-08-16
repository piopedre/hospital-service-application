import { getAllRequistion } from "../../../../Utility/product/product";
import { clearAuthentication } from "../auth/loginAction";

export const initRequistions = (token, setState, location, unit) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      const requistionResponse = await getAllRequistion(token, {
        location,
        unit,
      });
      if (requistionResponse?.ok) {
        const requistions = await requistionResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
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
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
        };
      });
    }
  };
};
