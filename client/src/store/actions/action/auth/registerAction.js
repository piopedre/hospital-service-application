import {
  REGISTER_USER_PROCESS,
  INIT_USER_REGISTRATION,
  sendProductMessenger,
  resetProductMessenger,
} from "../../../index";
import { registerUserReq } from "../../../../Utility/auth/auth";

const initRegistration = () => {
  return {
    type: INIT_USER_REGISTRATION,
  };
};
const registerUserProcess = () => {
  return {
    type: REGISTER_USER_PROCESS,
  };
};

export const validatePassword = (
  formData,
  dispatch,
  sendProductMessenger,
  resetProductMessenger
) => {
  const isUpperCase = (text) => {
    const pattern = /[A-Z]/;
    return text.split("").some((char) => pattern.test(char));
  };
  const isLowerCase = (text) => {
    const pattern = /[a-z]/;
    return text.split("").some((char) => pattern.test(char));
  };
  const isContainSpecialChar = (text) => {
    const pattern = /[^((0-9)|(a-z)|(A-Z)|\s)]/;
    return text.split("").some((char) => pattern.test(char));
  };
  const isNumber = (text) => {
    const pattern = /\d+/;
    return text.split("").some((char) => pattern.test(char));
  };
  if (formData.password.length < 8) {
    dispatch(sendProductMessenger("password must 8 characters long", true));
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 2500);
    return false;
  }

  if (!isUpperCase(formData.password)) {
    dispatch(
      sendProductMessenger("password must contain uppercase character", true)
    );
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 2500);
    return false;
  }
  if (!isLowerCase(formData.password)) {
    dispatch(
      sendProductMessenger("password must contain lowercase character", true)
    );
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 2500);
    return false;
  }
  if (!isNumber(formData.password)) {
    dispatch(
      sendProductMessenger("password must contain a number from 0-9", true)
    );
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 2500);
    return false;
  }

  if (!isContainSpecialChar(formData.password)) {
    dispatch(
      sendProductMessenger("password must contain a special character", true)
    );
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 2500);
    return false;
  }
  if (
    isContainSpecialChar(formData.password) &&
    isNumber(formData.password) &&
    isLowerCase(formData.password) &&
    isUpperCase(formData.password) &&
    formData.password.length >= 8
  ) {
    return true;
  }
};
export const registerUser = (e, form, setForm, token) => {
  e.preventDefault();
  const formData = Object.fromEntries(new FormData(e.target).entries());
  return async (dispatch) => {
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

    if (formData.retypePassword === formData.password) {
      if (!form.departments.length || !form.userRoles.length) {
        if (!form.departments.length) {
          sendProductMessenger("a user needs to be under a department", true);
          setTimeout(() => {
            dispatch(resetProductMessenger());
          }, 2500);
          return;
        }
        if (!form.userRoles.length) {
          sendProductMessenger(
            "a user needs to be under role to be registered",
            true
          );
          setTimeout(() => {
            dispatch(resetProductMessenger());
          }, 2500);
          return;
        }
      }
      try {
        const newForm = {
          ...formData,
          role: form.userRoleId,
          department: form.departmentId,
        };
        dispatch(initRegistration());
        const response = await registerUserReq(token, JSON.stringify(newForm));
        if (response?.ok) {
          dispatch(registerUserProcess());
          dispatch(sendProductMessenger("Registration Successful"));
          e.target.reset();
          setForm((prevState) => {
            return {
              ...prevState,
              firstName: "",
              lastName: "",
              username: "",
              password: "",
              retypePassword: "",
            };
          });
        } else {
          throw new Object({
            message: "Unable to Register",
          });
        }
      } catch (error) {
        dispatch(registerUserProcess());
        dispatch(sendProductMessenger(error.message, true));
      }
    } else {
      dispatch(sendProductMessenger("Passwords dont match", true));
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 2500);
  };
};
