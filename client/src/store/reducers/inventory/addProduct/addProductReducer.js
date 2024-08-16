import {
  SET_ADD_PRODUCT_LOADER,
  REMOVE_ADD_PRODUCT_LOADER,
  GET_PRODUCT_CATEGORIES_SUCCESS,
  RESET_PRODUCT_MESSENGER,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAILED,
  SEND_PRODUCT_MESSENGER,
  CLEAR_ADD_PRODUCT_ERROR,
  OPEN_ADD_CATEGORY,
  CLOSE_ADD_CATEGORY,
} from "../../../actions/actionTypes/actionTypes";
const intialState = {
  options: [],
  modal: false,
  message: null,
  errorMessage: false,
  error: {
    message: null,
    status: null,
  },
  loading: false,
};

const addProductReducer = (state = intialState, action) => {
  switch (action.type) {
    case SET_ADD_PRODUCT_LOADER:
      return {
        ...state,
        loading: true,
      };
    case GET_PRODUCT_CATEGORIES_SUCCESS:
      return {
        ...state,
        loading: false,
        options: action.options,
      };
    case REMOVE_ADD_PRODUCT_LOADER:
      return {
        ...state,
        loading: false,
      };
    case RESET_PRODUCT_MESSENGER:
      return {
        ...state,
        message: null,
        errorMessage: null,
      };
    case ADD_CATEGORY_SUCCESS:
      return {
        ...state,
        loading: false,
        message: "Category Added",
        modal: false,
      };
    case ADD_CATEGORY_FAILED:
      return {
        ...state,
        loading: false,
        errorMessage: true,
        message: "Error adding category",
      };
    case SEND_PRODUCT_MESSENGER:
      if (action.error?.message) {
        return {
          ...state,
          loading: false,
          errorMessage: true,
          message: action.message,
          error: {
            message: action.error.message,
            status: action.error.status,
          },
        };
      } else if (action.errorMessage) {
        return {
          ...state,
          loading: false,
          errorMessage: true,
          message: action.message,
        };
      } else {
        return {
          ...state,
          loading: false,
          message: action.message,
          errorMessage: null,
          error: {
            message: null,
            status: null,
          },
        };
      }
    case OPEN_ADD_CATEGORY:
      return {
        ...state,
        modal: true,
      };
    case CLOSE_ADD_CATEGORY:
      return {
        ...state,
        modal: false,
      };
    case CLEAR_ADD_PRODUCT_ERROR:
      return {
        ...state,
        error: {
          message: null,
          status: null,
        },
      };
    default:
      return state;
  }
};

export default addProductReducer;
