import {
  GET_PRODUCT_CATEGORIES_SUCCESS,
  SET_ADD_PRODUCT_LOADER,
  RESET_PRODUCT_MESSENGER,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_FAILED,
  SEND_PRODUCT_MESSENGER,
  CLEAR_ADD_PRODUCT_ERROR,
  OPEN_ADD_CATEGORY,
  CLOSE_ADD_CATEGORY,
} from "../../../index";
import {
  getCategory,
  categoryAdd,
  validateForm,
  addProductRequest,
  addProductLogs,
  editCategory,
} from "../../../../Utility/inventory/addProduct";
import { clearAuthentication } from "../auth/loginAction";
import { fetchProducts } from "../../../../Utility/product/product";
import { deleteCategoryMethod } from "../../../../Utility/inventory/addProduct";

export const clearProductError = () => {
  return {
    type: CLEAR_ADD_PRODUCT_ERROR,
  };
};
const setAddProductLoader = () => {
  return {
    type: SET_ADD_PRODUCT_LOADER,
  };
};

const getCategoriesSuccess = (options) => {
  return {
    type: GET_PRODUCT_CATEGORIES_SUCCESS,
    options,
  };
};
export const resetProductMessenger = () => {
  return {
    type: RESET_PRODUCT_MESSENGER,
  };
};
export const sendProductMessenger = (message, errorMessage, error) => {
  return {
    type: SEND_PRODUCT_MESSENGER,
    message,
    errorMessage,
    error,
  };
};
const addCategorySuccess = () => {
  return {
    type: ADD_CATEGORY_SUCCESS,
  };
};
const addCategoryFailed = (error) => {
  return {
    type: ADD_CATEGORY_FAILED,
    error,
  };
};
export const openAddCategory = () => {
  return {
    type: OPEN_ADD_CATEGORY,
  };
};
export const closeAddCategory = () => {
  return {
    type: CLOSE_ADD_CATEGORY,
  };
};

export const deleteCategory = (token, id) => {
  return async (dispatch) => {
    dispatch(setAddProductLoader());
    try {
      const deleteResponse = await deleteCategoryMethod(token, id);
      if (deleteResponse?.ok) {
        dispatch(sendProductMessenger("Category Deleted Successfully"));
        dispatch(initProductCategories(token));
      } else {
        throw {
          message: deleteResponse.statusText,
          status: deleteResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(
          sendProductMessenger(
            "category linked to a product, unlink to delete",
            true
          )
        );
      }
    }
    setTimeout(() => {
      dispatch(resetProductMessenger);
    }, 3000);
  };
};
export const editCategoryMethod = (e, token, id) => {
  e.preventDefault();
  const body = JSON.stringify(
    Object.fromEntries(new FormData(e.target).entries())
  );
  return async (dispatch) => {
    dispatch(setAddProductLoader());
    try {
      const editResponse = await editCategory(token, id, body);
      if (editResponse?.ok) {
        dispatch(sendProductMessenger("category edited"));
        dispatch(initProductCategories(token));
      } else {
        throw {
          message: editResponse.statusText,
          status: editResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("unable to edit category", true));
      }
    }
    setTimeout(() => {
      dispatch(resetProductMessenger);
    }, 3000);
  };
};
export const initProductCategories = (token) => {
  return async (dispatch) => {
    dispatch(setAddProductLoader());
    try {
      const response = await getCategory(token);
      if (response?.ok) {
        const categories = await response.json();
        const options = categories;
        dispatch(getCategoriesSuccess(options));
      } else {
        throw new Object({
          message: response.statusText,
          status: response.status,
        });
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("No product Category", true, error));
      }
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};

export const addProductCategory = (event, token, setState) => {
  event.preventDefault();
  const form = Object.fromEntries(new FormData(event.target).entries());
  return async (dispatch) => {
    if (form.category.trim()) {
      dispatch(setAddProductLoader());
      try {
        const response = await categoryAdd(token, JSON.stringify(form));
        if (response?.ok) {
          event.target.reset();
          dispatch(addCategorySuccess());
          dispatch(initProductCategories(token));
          setState((prevState) => {
            return {
              ...prevState,
              category: "",
            };
          });
        } else {
          throw {
            message: response.statusText,
            status: response.status,
          };
        }
      } catch (error) {
        if (error.status === 401) {
          dispatch(clearAuthentication(error.status));
        } else {
          addCategoryFailed(error);
        }
      }
    } else {
      dispatch(sendProductMessenger("input can't be empty", true));
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};
export const addProduct = (
  event,
  token,
  location,
  unit,
  setForm,
  options,
  clinic,
  setAddState
) => {
  event.preventDefault();

  const formData = new FormData(event.target);
  return async (dispatch) => {
    dispatch(setAddProductLoader());

    if (validateForm(formData.entries())) {
      const categoryId = options.find(
        (option) => option.category === formData.get("productCategory")
      )._id;
      formData.set("location", location);
      formData.set("unit", unit);
      formData.set("productCategory", categoryId);
      formData.set("clinic", clinic);

      try {
        const response = await addProductRequest(
          token,
          JSON.stringify(Object.fromEntries(formData.entries()))
        );
        if (response?.ok) {
          dispatch(sendProductMessenger("Product added"));
          const product = await response.json();
          const movement = new Map();
          movement.set("movement", "Physical Stock");
          movement.set("received", product.quantity);
          movement.set("balance", product.quantity);
          movement.set("product", product._id);
          movement.set("unit", unit);
          movement.set("location", location);
          movement.set("clinic", clinic);

          const movementResponse = await addProductLogs(
            token,
            JSON.stringify(Object.fromEntries(movement))
          );
          if (movementResponse?.ok) {
            setAddState((prevState) => {
              return {
                ...prevState,
                firstClick: false,
              };
            });
            movement.clear();
            [...formData.keys()].forEach((key) => {
              if (key !== "productCategory") {
                setForm((prevState) => {
                  return {
                    ...prevState,
                    markUp: "1.25",
                    [key]: "",
                  };
                });
              }
            });
            [...formData.keys()].forEach((key) => formData.delete(key));
          } else {
            throw new Object({
              message: movementResponse.statusText,
              status: movementResponse.status,
            });
          }
        } else {
          throw new Object({
            message: response.statusText,
            status: response.status,
          });
        }
      } catch (error) {
        if (error.status === 401) {
          dispatch(clearAuthentication(error.status));
        } else {
          dispatch(
            sendProductMessenger(
              `${formData.get("name")} already exists`,
              true,
              error
            )
          );
        }
      }
    } else {
      dispatch(sendProductMessenger("some inputs are invalid", true));
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};

export const fetchProductsMethod = (token, search, setState) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          searchModal: true,
          loading: true,
        };
      });
      const productResponse = await fetchProducts(token, { search });
      if (productResponse?.ok) {
        const products = await productResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            products,
            loading: false,
          };
        });
      } else {
        throw {
          message: productResponse.statusText,
          status: productResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          products: [],
          searchModal: false,
          loading: false,
        };
      });
    }
  };
};
