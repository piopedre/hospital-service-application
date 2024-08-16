import {
  AUTHENTICATION,
  AUTHENTICATING,
  CLEAR_LOGIN_ERROR,
  RE_AUTHENTICATE,
  CLEAR_AUTHENTICATION,
  LOG_OUT,
} from "../../actions/actionTypes/actionTypes";
const intialState = {
  isAuthenticated: false,
  loading: false,
  error: {
    message: null,
    status: null,
  },
};

const login = (state = intialState, action) => {
  switch (action.type) {
    case AUTHENTICATION:
      return {
        ...state,
        loading: false,
        isAuthenticated: action.authStatus,
        error: {
          message: !action.authStatus ? action.text : null,
        },
      };
    case AUTHENTICATING:
      return {
        ...state,
        loading: true,
      };
    case CLEAR_LOGIN_ERROR:
      return {
        ...state,
        error: {
          message: null,
          status: null,
        },
        loading: false,
      };
    case RE_AUTHENTICATE:
      return {
        ...state,
        isAuthenticated: true,
      };
    case CLEAR_AUTHENTICATION:
      if (action.status === 401) {
        sessionStorage.clear();
        localStorage.clear();
        sessionStorage.setItem("activeLink", JSON.stringify(0));
        return {
          ...state,
          error: {
            status: null,
            message: null,
          },
          isAuthenticated: false,
        };
      }
      break;
    case LOG_OUT:
      sessionStorage.clear();
      localStorage.clear();
      sessionStorage.setItem("activeLink", JSON.stringify(0));
      return {
        ...state,
        error: {
          status: null,
          message: null,
        },
        isAuthenticated: false,
      };
    default:
      return state;
  }
};

export default login;
