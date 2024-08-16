import {
  MESSENGER,
  CLEAR_MESSENGER,
} from "../../actions/actionTypes/actionTypes";
const intialState = {
  message: null,
};
const messenger = (state = intialState, action) => {
  switch (action.type) {
    case MESSENGER:
      return {
        ...state,
        message: action.message,
      };

    case CLEAR_MESSENGER:
      return {
        ...state,
        message: null,
      };

    default:
      return state;
  }
};

export default messenger;
