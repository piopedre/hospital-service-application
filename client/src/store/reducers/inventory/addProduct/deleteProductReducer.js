import { DELETE_PRODUCT_PROCESS, DELETE_PRODUCT_INIT } from "../../../index";
const intialState = {
  loading: null,
};

const deleteProductReducer = (state = intialState, action) => {
  switch (action.type) {
    case DELETE_PRODUCT_PROCESS:
      return {
        ...state,
        loading: null,
      };
    case DELETE_PRODUCT_INIT:
      return {
        ...state,
        loading: true,
      };
    default:
      return state;
  }
};

export default deleteProductReducer;
