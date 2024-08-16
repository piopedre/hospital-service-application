import {
  PRODUCT_DATABASE,
  PRODUCT_DATABASE_ERROR,
  CLEAR_PRODUCT_DATABASE_ERROR,
  SET_PRODUCT_DATABASE_LOADER,
  WARD_DATABASE,
  PRODUCT_SALES_DATABASE,
  PRODUCT_SALES_LOADER,
  PRODUCT_SALES_DATABASE_ERROR,
  CLEAR_PRODUCT_SALES_ERROR,
} from "../../index";

const initialState = {
  products: {
    database: [],
    error: {
      message: null,
      status: null,
    },
    loading: null,
  },
  sales: {
    database: [],
    error: {
      message: null,
      status: null,
    },
    loading: false,
  },

  wards: {
    database: [],
    error: {
      message: null,
      status: null,
    },
  },
};
const generalReducer = (state = initialState, action) => {
  switch (action.type) {
    case PRODUCT_DATABASE:
      return {
        ...state,
        products: {
          ...state.products,
          database: [...action.productDatabase],
          loading: null,
        },
      };
    case SET_PRODUCT_DATABASE_LOADER:
      return {
        ...state,
        products: {
          ...state.products,
          loading: true,
        },
      };
    case PRODUCT_DATABASE_ERROR:
      return {
        ...state,
        products: {
          ...state.products,
          loading: false,
          database: [],
          error: {
            message: action.error.message,
            status: action.error.status,
          },
        },
      };
    case CLEAR_PRODUCT_DATABASE_ERROR:
      return {
        ...state,
        products: {
          ...state.products,
          error: {
            message: null,
            status: null,
          },
        },
      };
    case WARD_DATABASE:
      return {
        ...state,
        wards: {
          ...state.wards,
          database: [...action.wardDatabase],
        },
      };
    case PRODUCT_SALES_DATABASE:
      return {
        ...state,
        sales: {
          ...state.sales,
          database: [...action.salesDatabase],
          loading: false,
        },
      };
    case PRODUCT_SALES_LOADER:
      return {
        ...state,
        sales: {
          ...state.sales,
          loading: !state.sales.loading,
        },
      };
    case PRODUCT_SALES_DATABASE_ERROR:
      return {
        ...state,
        sales: {
          ...state.sales,
          database: [],
          error: {
            message: action.error.message,
            status: action.error.status,
          },
          loading: false,
        },
      };
    case CLEAR_PRODUCT_SALES_ERROR:
      return {
        ...state,
        sales: {
          ...state.sales,
          error: {
            message: null,
            status: null,
          },
        },
      };
    default:
      return state;
  }
};

export default generalReducer;
