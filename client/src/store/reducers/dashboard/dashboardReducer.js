import {
  INIT_DASHBOARD_FAILED,
  CLEAR_ERROR,
  SET_DASHBOARD_LOADER,
  SET_DASBOARD_PRODUCTS_DATA,
  SET_DASHBOARD_SALES_DATA,
} from "../../actions/actionTypes/actionTypes";
const intialState = {
  error: {
    status: null,
    message: null,
  },
  loading: false,
  slides: [
    {
      title: "Patient Sales Plot",
      data: null,
    },
    {
      title: "Product Sales Plot",
      data: null,
    },
    {
      title: "Products Plot",
      data: null,
    },
  ],
};

const dashboard = (state = intialState, action) => {
  switch (action.type) {
    case SET_DASHBOARD_LOADER:
      return {
        ...state,
        loading: true,
      };
    case SET_DASBOARD_PRODUCTS_DATA:
      // const productSlides = structuredClone(state.slides);
      const productSlides = JSON.parse(JSON.stringify(state.slides));
      productSlides.splice(2, 1, action.data);
      return {
        ...state,
        loading: false,
        error: {
          message: null,
          status: null,
        },
        slides: productSlides,
      };
    case SET_DASHBOARD_SALES_DATA:
      // const salesSlides = structuredClone(state.slides);
      const salesSlides = JSON.parse(JSON.stringify(state.slides));
      salesSlides.splice(0, 2, action.data.firstSlide, action.data.secondSlide);
      return {
        ...state,
        loading: false,
        error: {
          message: null,
          status: null,
        },
        slides: salesSlides,
      };
    case INIT_DASHBOARD_FAILED:
      return {
        ...state,
        ...state.error,
        loading: false,
        slides: [],
        error: {
          status: action.error.status,
          message: action.error.message,
        },
      };
    case CLEAR_ERROR:
      return {
        ...state,
        ...state.error,
        error: {
          status: null,
          message: null,
        },
      };
    default:
      return state;
  }
};

export default dashboard;
