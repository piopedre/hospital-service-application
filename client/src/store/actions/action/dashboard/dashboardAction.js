import {
  INIT_DASHBOARD_FAILED,
  CLEAR_ERROR,
  SET_DASHBOARD_LOADER,
  clearAuthentication,
  getProductExpiryAction,
  setMinimumQuantityHandler,
  getNotificationMethod,
} from "../../../index";
import {
  dashboardGetSales,
  dashboardGetProducts,
  productAnalysis,
  productSalesAnalysis,
  salesAnalysis,
} from "../../../../Utility/dashboard/dashboard";
import {
  SET_DASBOARD_PRODUCTS_DATA,
  SET_DASHBOARD_SALES_DATA,
} from "../../actionTypes/actionTypes";

const setDashboardSalesData = (data) => {
  return {
    type: SET_DASHBOARD_SALES_DATA,
    data,
  };
};
const setDashboardProductData = (data) => {
  return {
    type: SET_DASBOARD_PRODUCTS_DATA,
    data,
  };
};
const setDashboardLoader = () => {
  return {
    type: SET_DASHBOARD_LOADER,
  };
};
const initDashboardFailed = (error) => {
  return {
    type: INIT_DASHBOARD_FAILED,
    error,
  };
};
export const clearError = () => {
  return {
    type: CLEAR_ERROR,
  };
};
const getDashbardProducts = (token, location, unit, clinic, data) => {
  return async (dispatch) => {
    try {
      const productsResponse = await dashboardGetProducts(
        token,
        location,
        unit,
        clinic
      );
      if (productsResponse?.ok) {
        const productsData = await productsResponse.json();
        dispatch(
          setDashboardProductData({
            title: "Products Plot",
            data: productAnalysis(productsData, data),
          })
        );
      } else {
        throw {
          status: productsResponse?.err?.response?.status,
          message: productsResponse?.err?.response?.statusText,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(initDashboardFailed(error));
      }
    }
  };
};
const getDashbardSales = (token, location, unit, clinic, data) => {
  return async (dispatch) => {
    try {
      const salesResponse = await dashboardGetSales(
        token,
        location,
        unit,
        clinic
      );
      if (salesResponse?.ok) {
        const salesData = await salesResponse.json();
        const salesGraph = {
          firstSlide: {
            title: "Daily Plot",
            data: salesAnalysis(salesData, data),
          },
          secondSlide: {
            title: "Product Sales Plot",
            data: productSalesAnalysis(salesData, data),
          },
        };
        dispatch(setDashboardSalesData(salesGraph));
      } else {
        throw {
          status: salesResponse?.err?.response?.status,
          message: salesResponse?.err?.response?.statusText,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(initDashboardFailed(error));
      }
    }
  };
};

export const initDashboard = (
  socket,
  data = { type: "bar", marker: { color: "#936c60" } }
) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  return async (dispatch) => {
    dispatch(setDashboardLoader());
    dispatch(getDashbardProducts(token, location, unit, clinic, data));
    dispatch(getDashbardSales(token, location, unit, clinic, data));
    dispatch(getProductExpiryAction(token, location, unit, clinic, socket));
    dispatch(setMinimumQuantityHandler(token, location, unit, clinic));
    dispatch(getNotificationMethod(token, { location, unit, clinic }));
  };
};
