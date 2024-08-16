import {
  SET_PRODUCT_LOG_LOADER,
  CLEAR_PRODUCT_LOG_LOADER,
  PRODUCT_LOG_FAILED,
  PRODUCT_LOG_SUCCESS,
  CLEAR_PRODUCTLOG_ERROR,
} from "../../../index";
const initialState = {
  productLog: [],
  loading: null,
  error: {
    message: null,
    status: null,
  },
};

const productLogReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_PRODUCT_LOG_LOADER:
      return {
        ...state,
        loading: true,
      };
    case CLEAR_PRODUCT_LOG_LOADER:
      return {
        ...state,
        loading: null,
      };
    case PRODUCT_LOG_SUCCESS:
      return {
        ...state,
        productLog: [...action.productLog],
      };
    case PRODUCT_LOG_FAILED:
      return {
        ...state,
        error: {
          message: action.error.message,
          status: action.error.status,
        },
      };
    case CLEAR_PRODUCTLOG_ERROR:
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

export default productLogReducer;
