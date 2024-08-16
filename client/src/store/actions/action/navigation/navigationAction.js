import {
  TOGGLE_FEATURES,
  SET_ACTIVE_LINK,
  RESET_ACTIVE_LINK,
  RESET_FEATURES,
  GET_NOTIFICATION_FAILED,
  CLEAR_NOTIFICATION,
  CLEAR_NOTIFICATION_MESSAGE,
} from "../../actionTypes/actionTypes";

export const toggleFeatures = (index, authStatus) => {
  return {
    type: TOGGLE_FEATURES,
    index,
    authStatus,
  };
};

export const setActiveLink = (index, authStatus) => {
  return {
    type: SET_ACTIVE_LINK,
    index,
    authStatus,
  };
};

export const resetActiveLink = () => {
  return {
    type: RESET_ACTIVE_LINK,
  };
};

export const resetFeatures = () => {
  return {
    type: RESET_FEATURES,
  };
};

export const getNotificationFailedAction = () => {
  return {
    type: GET_NOTIFICATION_FAILED,
  };
};

export const clearNotification = () => {
  return {
    type: CLEAR_NOTIFICATION,
  };
};

export const clearNotificationMessage = () => {
  return {
    type: CLEAR_NOTIFICATION_MESSAGE,
  };
};
