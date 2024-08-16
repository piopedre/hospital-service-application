import {
  FILTER_PRODUCTS,
  RESET_FILTER,
  SET_EDIT_LOADER,
  CLEAR_EDIT_LOADER,
} from "../../../index";
const initialState = {
  renderedProducts: [],
  loading: false,
};

const editProductReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_EDIT_LOADER:
      return {
        ...state,
        loading: true,
      };
    case CLEAR_EDIT_LOADER:
      return {
        ...state,
        loading: false,
      };
    case RESET_FILTER:
      return {
        renderedProducts: [],
      };
    case FILTER_PRODUCTS:
      return {
        ...state,
        renderedProducts: [...action.products],
      };
    default:
      return state;
  }
};

export default editProductReducer;
