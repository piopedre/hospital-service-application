import { getUsername } from "../../../../Utility/auth/auth";
import { getDepartmentsRequest } from "../../../../Utility/general/general";
import { clearAuthentication } from "../auth/loginAction";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "../inventory/addProductAction";
import {
  getLocationRequest,
  getUnitRequest,
  getClinicalsRequest,
} from "../../../../Utility/institution/initInstitution";

export const getDepartments = (setState) => {
  setState((prevState) => {
    return {
      ...prevState,
      loading: true,
    };
  });
  return async (dispatch) => {
    try {
      const departmentsResponse = await getDepartmentsRequest();
      if (departmentsResponse?.ok) {
        const departments = await departmentsResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            departments,
          };
        });
      } else {
        throw {
          message: departmentsResponse.statusText,
          status: departmentsResponse.status,
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
          departments: [],
        };
      });
    }
  };
};
export const getLocationsByDepartment = (setState, department) => {
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    try {
      const locationResponse = await getLocationRequest(
        JSON.stringify({ department })
      );
      if (locationResponse?.ok) {
        const { locations, institution } = await locationResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            locations,
            institution,
          };
        });
      } else {
        throw {
          message: locationResponse.statusText,
          status: locationResponse.status,
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
          locations: [],
        };
      });
    }
  };
};

export const getUnitsByDepartment = (setState, department) => {
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    try {
      const unitResponse = await getUnitRequest(JSON.stringify({ department }));
      if (unitResponse?.ok) {
        const units = await unitResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            units,
          };
        });
      } else {
        throw {
          message: unitResponse.statusText,
          status: unitResponse.status,
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
          units: [],
        };
      });
    }
  };
};
export const getClinics = (setState) => {
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    try {
      const clinicResponse = await getClinicalsRequest(
        JSON.stringify({ $clinic: "clinical" })
      );
      if (clinicResponse?.ok) {
        const clinics = await clinicResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            clinics,
          };
        });
      } else {
        throw {
          message: clinicResponse.statusText,
          status: clinicResponse.status,
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
          clinics: [],
        };
      });
    }
  };
};
export const getUserLogin = (e, setState, state) => {
  e.preventDefault();
  return async (dispatch) => {
    if (!state.departments.length) {
      dispatch(sendProductMessenger("a department is required to login", true));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
      return;
    }
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    try {
      const form = Object.fromEntries(new FormData(e.target).entries());
      const newForm = {
        ...form,
        department: state.departmentId,
      };
      const getUserLoginResponse = await getUsername(JSON.stringify(newForm));
      if (getUserLoginResponse?.ok) {
        const user = await getUserLoginResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            user,
            loading: false,
          };
        });
        dispatch(getLocationsByDepartment(setState, state.departmentId));
        dispatch(getUnitsByDepartment(setState, state.departmentId));
        dispatch(getClinics(setState));
      } else {
        throw {
          message: getUserLoginResponse.statusText,
          status: getUserLoginResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
      } else if (error.status === 404) {
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
        dispatch(sendProductMessenger("Username does not exist", true));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
        return;
      } else {
        dispatch(sendProductMessenger("Unable to login", true));
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
  };
};
