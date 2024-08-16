import {
  sendProductMessenger,
  resetProductMessenger,
  FILTER_PRODUCTS,
  RESET_FILTER,
  clearAuthentication,
  initProductDatabase,
  SET_EDIT_LOADER,
  CLEAR_EDIT_LOADER,
} from "../../../index";
import { getReqById, sendEditReq } from "../../../../Utility/general/general";
import { ResponseError } from "../../../../Utility/auth/auth";
import {
  editProductById,
  getProductById,
} from "../../../../Utility/product/product";
import { addProductLogs } from "../../../../Utility/inventory/addProduct";
const renderFilteredProducts = (products) => {
  return {
    type: FILTER_PRODUCTS,
    products,
  };
};
export const resetFilteredProducts = () => {
  return {
    type: RESET_FILTER,
  };
};
const setLoader = () => {
  return {
    type: SET_EDIT_LOADER,
  };
};
const clearLoader = () => {
  return {
    type: CLEAR_EDIT_LOADER,
  };
};
export const filteredProducts = (event, products) => {
  return (dispatch) => {
    if (products.length && event.target.value.trim()) {
      const filteredProducts = products.filter((product) =>
        product.name.includes(event.target.value.toUpperCase())
      );
      dispatch(renderFilteredProducts(filteredProducts));
    } else if (!products.length && event.target.value.trim()) {
      dispatch(resetFilteredProducts());
      dispatch(
        sendProductMessenger("There is no product in the database", true)
      );
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
    } else {
      dispatch(resetFilteredProducts());
      return;
    }
  };
};

export const submitEditForm = (
  e,
  id,
  token,
  unit,
  $location,
  setState,
  options,
  clinic,
  setSearch
) => {
  return async (dispatch) => {
    dispatch(setLoader());
    const form = Object.create(null);
    const formData = Object.fromEntries(new FormData(e.target).entries());
    const keys = Object.keys(formData);
    try {
      const response = await getReqById(
        ResponseError,
        getProductById,
        token,
        id
      );
      // Start Debugging from here
      // Add loading
      if (response?.ok) {
        const product = await response.json();

        const newProduct = {
          ...product,
        };
        const parsedDate = Date.parse(`${newProduct.expiryDate}`);
        const newDate = new Intl.DateTimeFormat("en-GB", {
          year: "numeric",
          month: "2-digit",
        })
          .format(parsedDate)
          .replace("/", "-");
        const expiryDate = [newDate.split("-")[1], newDate.split("-")[0]].join(
          "-"
        );
        newProduct.expiryDate = expiryDate;
        const numberVariables = [
          "minimumQuantity",
          "quantity",
          "costPrice",
          "fgPrice",
          "packSize",
          "markUp",
        ];
        numberVariables.forEach(
          (variable) => (formData[variable] = +formData[variable])
        );
        keys.forEach((key) => {
          if (key === "productCategory") {
            if (formData[key] !== newProduct[key]?.category) {
              const newCategory = options.find(
                (opt) => opt.category === formData[key]
              );
              form[key] = newCategory._id;
            }
          } else {
            if (formData[key] !== newProduct[key]) {
              form[key] = formData[key];
            }
          }
        });
        if (!Object.keys(form).length) {
          dispatch(clearLoader());
          dispatch(sendProductMessenger("no changes have been made", true));
        } else {
          try {
            const sendEditResponse = await sendEditReq(
              token,
              editProductById,
              id,
              JSON.stringify(form),
              ResponseError
            );
            if (sendEditResponse?.ok) {
              if (Object.keys(form).includes("expiryDate")) {
                sessionStorage.setItem("expired", JSON.stringify(false));
              }
              const movementName = [...Object.keys(form)].reduce((acc, key) => {
                acc += key + " ";
                return acc;
              }, "edited ");
              const product = await sendEditResponse.json();
              const movement = new Map();
              movement.set("movement", movementName);
              movement.set("product", id);
              if (newProduct.quantity < form.quantity) {
                movement.set("received", form.quantity - newProduct.quantity);
              } else if (newProduct.quantity > form.quantity) {
                movement.set("issued", newProduct.quantity - form.quantity);
              }
              movement.set("balance", product.quantity);
              movement.set("unit", unit);
              movement.set("location", $location);
              movement.set("clinic", clinic);
              const movementResponse = await addProductLogs(
                token,
                JSON.stringify(Object.fromEntries(movement))
              );
              if (movementResponse?.ok) {
                dispatch(clearLoader());
                e.target.reset();
                movement.clear();
                [...Object.keys(form)].forEach((key) => delete form[key]);
                setState(false);
                dispatch(initProductDatabase(token, $location, unit, clinic));
                dispatch(sendProductMessenger("changes saved"));
                setSearch("");
              } else {
                dispatch(clearLoader());
                e.target.reset();
                dispatch(sendProductMessenger("Problem adding product", true));
              }
            } else {
              throw new Object({
                message: sendEditResponse.err.response.statusText,
                status: sendEditResponse.err.response.status,
              });
            }
          } catch (error) {
            dispatch(clearLoader());
            if (error.status === 401) {
              dispatch(clearAuthentication(error.status));
            } else {
              dispatch(sendProductMessenger(error.message, true));
            }
          }
        }
      } else {
        throw new Object({
          message:
            response.error.statusText || response?.error?.response?.statusText,
          status: response.error.status || response?.error?.response.status,
        });
      }
    } catch (error) {
      dispatch(clearLoader());
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger(error.message, true));
      }
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 2500);
  };
};
