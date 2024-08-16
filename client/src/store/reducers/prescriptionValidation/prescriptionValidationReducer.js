import { SET_VALIDATION_LOADER, REMOVE_VALIDATION_LOADER } from "../../index";
const intialState = {
  loading: null,
};

const prescriptionValidationReducer = (state = intialState, action) => {
  switch (action.type) {
    case SET_VALIDATION_LOADER:
      return {
        ...state,
        loading: true,
      };
    case REMOVE_VALIDATION_LOADER:
      return {
        ...state,
        loading: false,
      };
    default:
      return state;
  }
};

export default prescriptionValidationReducer;
