// for databases
import {
  PRODUCT_DATABASE,
  PRODUCT_DATABASE_ERROR,
  CLEAR_PRODUCT_DATABASE_ERROR,
  SET_PRODUCT_DATABASE_LOADER,
  clearAuthentication,
  resetProductMessenger,
  sendProductMessenger,
  resetFilteredProducts,
  WARD_DATABASE,
  PRODUCT_SALES_DATABASE,
  PRODUCT_SALES_LOADER,
  PRODUCT_SALES_DATABASE_ERROR,
  CLEAR_PRODUCT_SALES_ERROR,
  getProductExpiryAction,
} from "../../../index";
import { getDatabase } from "../../../../Utility/general/general";
import { getAllProducts } from "../../../../Utility/product/product";
import { getAllPatients } from "../../../../Utility/patient/patient";
import { ResponseError } from "../../../../Utility/auth/auth";
import { getAllWards } from "../../../../Utility/ward/ward";
import { getFilterSales, getSales } from "../../../../Utility/sales/sales";
const getProductDatabase = (productDatabase) => {
  return {
    type: PRODUCT_DATABASE,
    productDatabase,
  };
};
const getProductDatabaseError = (error) => {
  return {
    type: PRODUCT_DATABASE_ERROR,
    error,
  };
};
const setProductLoader = () => {
  return {
    type: SET_PRODUCT_DATABASE_LOADER,
  };
};
const getSalesDatabase = (salesDatabase) => {
  return {
    type: PRODUCT_SALES_DATABASE,
    salesDatabase,
  };
};

export const setSalesLoader = () => {
  return {
    type: PRODUCT_SALES_LOADER,
  };
};
export const clearProductSalesError = () => {
  return {
    type: CLEAR_PRODUCT_SALES_ERROR,
  };
};
const getProductSalesDatabaseError = (error) => {
  return {
    type: PRODUCT_SALES_DATABASE_ERROR,
    error,
  };
};

const getWardDatabase = (wardDatabase) => {
  return {
    type: WARD_DATABASE,
    wardDatabase,
  };
};

export const clearProductDatabaseError = () => {
  return {
    type: CLEAR_PRODUCT_DATABASE_ERROR,
  };
};
export const initProductDatabase = (token, location, unit, clinic) => {
  return async (dispatch) => {
    dispatch(setProductLoader());
    try {
      const productResponse = await getDatabase(
        token,
        getAllProducts,
        location,
        unit,
        clinic,
        ResponseError
      );
      if (productResponse?.ok) {
        const productDatabase = await productResponse.json();
        dispatch(getProductDatabase(productDatabase));
        dispatch(resetFilteredProducts());
        const expired = JSON.parse(sessionStorage.getItem("expired"));

        if (!expired) {
          dispatch(getProductExpiryAction(token, location, unit, clinic));
          sessionStorage.setItem("expired", JSON.stringify(true));
        }
      } else {
        throw {
          status: productResponse.err.response.status,
          message: productResponse.message,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(getProductDatabaseError(error));
        dispatch(sendProductMessenger(error.message, true));
        dispatch(resetFilteredProducts());
      }
    }
    setTimeout(() => {
      dispatch(resetProductMessenger());
    }, 3000);
  };
};
export const initPatientDatabase = (token, search, setState) => {
  return async (dispatch) => {
    try {
      const response = await getAllPatients(token, search);
      if (response?.ok) {
        const patients = await response.json();
        setState((prevState) => {
          return {
            ...prevState,
            previewSearchRender: true,
            filteredItems: patients,
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
      }
      setState((prevState) => {
        return {
          ...prevState,
          filteredItems: [],
          previewSearchRender: false,
        };
      });
    }
  };
};

export const initWardDatabase = (token) => {
  return async (dispatch) => {
    try {
      const response = await getAllWards(token);
      if (response?.ok) {
        const wards = await response.json();
        dispatch(getWardDatabase(wards));
      } else {
        throw {
          message: response.statusText,
          status: response.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
    }
  };
};

export const initProductSalesDatabase = (
  token,
  location,
  unit,
  clinic,
  startDate,
  endDate
) => {
  return async (dispatch) => {
    dispatch(setSalesLoader());
    try {
      if (!startDate || !endDate) {
        startDate = new Date().toISOString().split("T")[0];
        const newDate = new Date().setDate(new Date().getDate() + 1);
        const tomorrow = new Date(newDate);
        endDate = tomorrow.toISOString().split("T")[0];
      }
      // DAILY SALES
      const response = await getSales(
        token,
        location,
        unit,
        clinic,
        startDate,
        endDate
      );
      if (response.ok) {
        const database = await response.json();
        dispatch(getSalesDatabase(database));
      } else {
        throw {
          message: response.statusText,
          status: response.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      dispatch(getProductSalesDatabaseError(error));
    }
  };
};

export const filterSales = (e, token, location, unit, clinic) => {
  if (e) {
    return async (dispatch) => {
      dispatch(setSalesLoader());
      const formData = Object.fromEntries(new FormData(e.target).entries());
      formData.location = location;
      formData.unit = unit;
      formData.clinic = clinic;
      try {
        const response = await getFilterSales(token, formData);
        if (response?.ok) {
          const sales = await response.json();
          e.target.reset();
          dispatch(getSalesDatabase(sales));
        } else {
          throw {
            message: response.statusText,
            status: response.status,
          };
        }
      } catch (error) {
        if (error.status === 401) {
          dispatch(clearAuthentication(error.status));
        }
        dispatch(getProductSalesDatabaseError(error));
      }
    };
  } else {
    return async (dispatch) => {
      dispatch(setSalesLoader());
      const formData = Object.create(null);
      formData.location = location;
      formData.unit = unit;
      // 1 month duration
      formData.start_date = new Date().toISOString().split("T")[0].slice(0, -3);
      let now = new Date();
      if (now.getMonth() === 11) {
        let current = new Date(now.getFullYear() + 1, 0, 1);
        formData.end_date = `${current.getFullYear()}-${
          current.getMonth() + 1
        }`;
      } else {
        let current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        formData.end_date = `${current.getFullYear()}-${
          current.getMonth() + 1
        }`;
      }
      try {
        const response = await getFilterSales(token, formData);
        if (response?.ok) {
          const sales = await response.json();
          dispatch(getSalesDatabase(sales));
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
          dispatch(getProductSalesDatabaseError(error));
        }
      }
    };
  }
};
