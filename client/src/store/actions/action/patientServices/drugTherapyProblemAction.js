import { getDrugTherapyRequest } from "../../../../Utility/product/product";
import { clearAuthentication } from "../auth/loginAction";

const getDrugTherapyProblem = (token, setState, object) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      const drugTherapyProblemResponse = await getDrugTherapyRequest(
        token,
        object
      );
      if (drugTherapyProblemResponse?.ok) {
        const reports = await drugTherapyProblemResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            reports,
          };
        });
      } else {
        throw {
          message: drugTherapyProblemResponse.statusText,
          status: drugTherapyProblemResponse.status,
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
export const initDrugTherapyProblem = (token, setState, object = {}) => {
  return (dispatch) => {
    dispatch(getDrugTherapyProblem(token, setState, object));
  };
};

export const filterDrugTherapyProblem = (e, token, setState, object) => {
  e.preventDefault();
  setState((prevState) => {
    return {
      ...prevState,
      filter: false,
    };
  });
  const form = Object.fromEntries(new FormData(e.target).entries());

  return (dispatch) => {
    dispatch(getDrugTherapyProblem(token, setState, { ...object, ...form }));
  };
};
