import { REGISTER_USER_PROCESS, INIT_USER_REGISTRATION } from "../../index";
const intialState = {
  loading: null,
};

const registerReducer = (state = intialState, action) => {
  switch (action.type) {
    case INIT_USER_REGISTRATION:
      return {
        ...state,
        loading: true,
      };
    case REGISTER_USER_PROCESS:
      return {
        ...state,
        loading: null,
      };
    default:
      return state;
  }
};

export default registerReducer;
