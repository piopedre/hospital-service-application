import {
  CLEAR_REQUISTION_LOADER,
  SET_REQUISTION_LOADER,
  CLEAR_REQUISTION_MODAL,
  REQUISTION_MODAL,
} from "../../../actions/actionTypes/actionTypes";

const initialState = {
  loading: null,
  modal: false,
};

const requistionReducer = (state = initialState, action) => {
  switch (action.type) {
    case REQUISTION_MODAL:
      return {
        ...state,
        modal: true,
      };
    case CLEAR_REQUISTION_MODAL:
      return {
        ...state,
        modal: null,
      };
    case CLEAR_REQUISTION_LOADER:
      return {
        ...state,
        loading: null,
      };
    case SET_REQUISTION_LOADER:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

export default requistionReducer;
