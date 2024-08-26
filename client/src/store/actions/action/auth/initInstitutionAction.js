import { playWelcomeSound } from "../../../../Utility/general/general";
import {
  addInstitutionRequest,
  loginInstitutionRequest,
  logoutInstitutionRequest,
} from "../../../../Utility/institution/initInstitution";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "../inventory/addProductAction";
import { clearAuthentication, authentication, logout } from "./loginAction";
import { validatePassword } from "./registerAction";

export const registerInstitution = (e, setState) => {
  e.preventDefault();
  return async (dispatch) => {
    const formData = Object.fromEntries(new FormData(e.target).entries());
    if (formData.password === formData.confirmPassword) {
      if (
        !validatePassword(
          formData,
          dispatch,
          sendProductMessenger,
          resetProductMessenger
        )
      ) {
        return;
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      try {
        const institutionResponse = await addInstitutionRequest(
          JSON.stringify(formData)
        );
        if (institutionResponse?.ok) {
          dispatch(sendProductMessenger("institution has been created"));
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
            message: institutionResponse.statusText,
            status: institutionResponse.status,
          };
        }
      } catch (error) {
        if (error.status === 401) {
          dispatch(clearAuthentication(error.status));
        } else {
          dispatch(sendProductMessenger("there is an institution", true));
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
    } else {
      dispatch(sendProductMessenger("Passwords don't match", true));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
    }
  };
};
export const loginInstitution = (e, setState) => {
  e.preventDefault();
  setState((prevState) => {
    return {
      ...prevState,
      loading: true,
    };
  });
  return async (dispatch) => {
    const formData = Object.fromEntries(new FormData(e.target).entries());
    try {
      const loginResponse = await loginInstitutionRequest(
        JSON.stringify(formData)
      );
      const authStatus = loginResponse?.ok;
      if (loginResponse?.ok) {
        setTimeout(() => {
          playWelcomeSound();
        }, 300);
        const { name, token } = await loginResponse.json();
        sessionStorage.setItem("activeLink", JSON.stringify(0));
        sessionStorage.setItem("token", JSON.stringify(token));
        sessionStorage.setItem("institution", JSON.stringify({ name }));
        sessionStorage.setItem("isInstitution", JSON.stringify(true));
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
      } else {
        throw {
          message: loginResponse.statusText,
          status: loginResponse.status,
        };
      }
      dispatch(authentication(authStatus));
    } catch (error) {
      dispatch(sendProductMessenger("unable to login", true));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
      setState((prevState) => {
        return {
          ...prevState,
          error: true,
          loading: false,
          password: "",
        };
      });
    }
  };
};
export const institutionLogout = (token, setState) => {
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    try {
      const logoutResponse = await logoutInstitutionRequest(token);
      if (logoutResponse?.ok) {
        dispatch(logout());
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
      } else {
        throw {
          message: logoutResponse.statusText,
          status: logoutResponse.status,
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
