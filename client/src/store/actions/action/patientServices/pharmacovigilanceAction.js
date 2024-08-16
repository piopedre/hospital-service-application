import {
  addPharmacovigilanceRequest,
  getPharmacovigilanceRequest,
} from "../../../../Utility/product/product";
import {
  addFeedbackRequest,
  getFeedbackRequest,
} from "../../../../Utility/PatientServices/productSales";
import { clearAuthentication } from "../auth/loginAction";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "../inventory/addProductAction";
const validateConcomitant = (state) => {
  const medicines = [...state.concomitantMedicines];
  if (!medicines.length) {
    return true;
  } else {
    const valid = medicines.reduce(
      (acc, cur) => {
        const entries = Object.values(cur);
        acc.valid = entries.every((entry) => entry);

        return acc;
      },
      { valid: false }
    );
    return valid.valid;
  }
};
export const validatePharmacovigilanceForm = (e, token, state, setState) => {
  e.preventDefault();

  const form = Object.fromEntries(new FormData(e.target).entries());

  return async (dispatch) => {
    if (!form.admitted || !form.prolonged) {
      dispatch(
        sendProductMessenger(
          "part 2 is incomplete, checkboxes are unchecked",
          true
        )
      );
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
      return;
    }
    if (!validateConcomitant(state)) {
      dispatch(sendProductMessenger("A field in part 4  is incomplete", true));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
      return;
    }

    setState((prevState) => {
      return {
        ...prevState,
        form,
        loading: true,
        // preview: true,
      };
    });
    let body = {
      ...form,
    };
    if (state.concomitantMedicines.length) {
      body.concomitantMedicines = state.concomitantMedicines;
    }
    try {
      const pharmacovigilanceResponse = await addPharmacovigilanceRequest(
        token,
        JSON.stringify(body)
      );
      if (pharmacovigilanceResponse?.ok) {
        setState((prevState) => {
          return {
            ...prevState,
            form,
            loading: false,
            preview: true,
          };
        });
        dispatch(sendProductMessenger("Report saved"));
      } else {
        throw {
          message: pharmacovigilanceResponse.statusText,
          status: pharmacovigilanceResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("Unable to save Report", true));
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
      }
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};
export const getPharmacovigilances = (object, token, setState) => {
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    try {
      const pharmacovigilanceResponse = await getPharmacovigilanceRequest(
        token,
        object
      );
      if (pharmacovigilanceResponse?.ok) {
        const forms = await pharmacovigilanceResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            forms,
          };
        });
      } else {
        throw {
          message: pharmacovigilanceResponse.statusText,
          status: pharmacovigilanceResponse.status,
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
          forms: [],
        };
      });
    }
  };
};

export const addFeedback = (e, token, setState, location, unit, clinic) => {
  return async (dispatch) => {
    e.preventDefault();
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    const object = Object.fromEntries(new FormData(e.target).entries());
    object.location = location;
    object.unit = unit;
    object.clinic = clinic;
    try {
      const feedbackResponse = await addFeedbackRequest(
        token,
        JSON.stringify(object)
      );
      if (feedbackResponse?.ok) {
        dispatch(sendProductMessenger("Feedback was added"));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
      } else {
        throw {
          message: feedbackResponse.statusText,
          status: feedbackResponse.status,
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
export const getFeedback = (object, token, setState) => {
  return async (dispatch) => {
    if (!object.startDate && !object.endDate) {
      const startDate = new Date().toISOString().split("T")[0];
      const newDate = new Date().setDate(new Date().getDate() + 1);
      const tomorrow = new Date(newDate);
      const endDate = tomorrow.toISOString().split("T")[0];
      object = {
        ...object,
        startDate,
        endDate,
      };
    }

    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
        form: false,
      };
    });
    try {
      const feedbackResponse = await getFeedbackRequest(token, object);
      if (feedbackResponse?.ok) {
        const reports = await feedbackResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            reports,
          };
        });
      } else {
        throw {
          message: feedbackResponse.statusText,
          status: feedbackResponse.status,
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
          reports: [],
        };
      });
    }
  };
};

export const filterFeedback = (e, token, setState, location, unit, clinic) => {
  return async (dispatch) => {
    e.preventDefault();
    const object = Object.fromEntries(new FormData(e.target).entries());
    object.location = location;
    object.unit = unit;
    object.clinic = clinic;
    dispatch(getFeedback(object, token, setState));
  };
};
