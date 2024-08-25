import {
  AUTHENTICATING,
  AUTHENTICATION,
  CLEAR_LOGIN_ERROR,
  RE_AUTHENTICATE,
  CLEAR_AUTHENTICATION,
} from "../../../index";
import { loginUser, logoutRequest } from "../../../../Utility/auth/auth";
import { LOG_OUT } from "../../actionTypes/actionTypes";
import { playWelcomeSound } from "../../../../Utility/general/general";

export const authentication = (authStatus, text) => {
  return {
    type: AUTHENTICATION,
    authStatus,
    text,
  };
};
export const clearLoginError = () => {
  return {
    type: CLEAR_LOGIN_ERROR,
  };
};
const initAuthentication = () => {
  return {
    type: AUTHENTICATING,
  };
};
const authenticate = () => {
  return {
    type: RE_AUTHENTICATE,
  };
};
export const authenticating = (e, state) => {
  e.preventDefault();
  return async (dispatch) => {
    dispatch(initAuthentication());
    const formData = Object.fromEntries(new FormData(e.target).entries());
    const department = state.departments.find(
      (dep) => dep.name === state.department
    );
    const form = {
      ...formData,
      department: department._id,
    };
    const loginResponse = await loginUser(JSON.stringify(form));

    if (loginResponse?.ok) {
      setTimeout(() => {
        playWelcomeSound();
      }, 300);

      const { token, user } = await loginResponse.json();

      // User id
      sessionStorage.setItem("id", JSON.stringify(user));
      // for Navbar
      sessionStorage.setItem("activeLink", JSON.stringify(0));
      // for Institution
      sessionStorage.setItem("institution", JSON.stringify(state.institution));
      // For Department
      sessionStorage.setItem(
        "department",
        JSON.stringify({ department: department._id })
      );
      sessionStorage.setItem("depLogin", JSON.stringify(department));
      // for location
      const location = state.locations.find(
        (loc) => loc.name === formData.location
      );
      const locationData = {
        name: location.name,
        id: location._id,
      };
      // for Units
      const unit = state.units.find((unit) => unit.name === formData.unit);
      const unitData = {
        name: unit.name,
        id: unit._id,
      };
      sessionStorage.setItem("location", JSON.stringify(locationData));
      sessionStorage.setItem("unit", JSON.stringify(unitData));
      if (department.name === "PHARMACY") {
        // for clinic
        const clinic = state.clinics.find(
          (clinic) => clinic.name === formData.clinic
        );
        const clinicData = {
          name: clinic.name,
          id: clinic._id,
        };
        sessionStorage.setItem("clinic", JSON.stringify(clinicData));
      }

      // Token
      sessionStorage.setItem("token", JSON.stringify(token));
      dispatch(authentication(loginResponse?.ok));
    } else {
      const text = JSON.parse(await loginResponse.text()).error;
      dispatch(authentication(loginResponse?.ok, text));
    }
  };
};

export const reAuthenticate = () => {
  return (dispatch) => {
    const token = sessionStorage.getItem("token");
    if (token) {
      dispatch(authenticate());
    }
    return;
  };
};
export const clearAuthentication = (status) => {
  return {
    type: CLEAR_AUTHENTICATION,
    status,
  };
};

export const logout = () => {
  return {
    type: LOG_OUT,
  };
};

export const loggingOut = (token) => {
  return async (dispatch) => {
    const userLogout = await logoutRequest(token);
    if (userLogout?.ok) {
      dispatch(logout());
    } else {
      if (userLogout.status === 401) {
        dispatch(clearAuthentication(userLogout.status));
      }
    }
  };
};
