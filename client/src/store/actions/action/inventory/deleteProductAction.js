import {
  DELETE_PRODUCT_PROCESS,
  DELETE_PRODUCT_INIT,
  resetProductMessenger,
  sendProductMessenger,
  clearAuthentication,
  resetFilteredProducts,
  initProductDatabase,
} from "../../../index";
import { deleteProductById } from "../../../../Utility/product/product";
const initDeleteProduct = () => {
  return {
    type: DELETE_PRODUCT_INIT,
  };
};
const deleteProductProcess = () => {
  return {
    type: DELETE_PRODUCT_PROCESS,
  };
};

export const deleteProduct = (id, token, $location, clinic, unit) => {
  return async (dispatch) => {
    try {
      dispatch(initDeleteProduct());
      const response = await deleteProductById(token, id);
      if (response.ok) {
        dispatch(deleteProductProcess());
        dispatch(resetFilteredProducts());
        dispatch(sendProductMessenger("Product Deleted"));
        // reset database
        dispatch(initProductDatabase(token, $location, unit, clinic));
      } else {
        throw new Object({
          status: response.status,
          message: response.statusText,
        });
      }
    } catch (error) {
      dispatch(deleteProductProcess());
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger(error.message, true));
      }
    }
    dispatch(resetProductMessenger());
  };
};
