import {
  getExpiryQuantityAnalysis,
  getExpiryTotalPriceAnalysis,
} from "../../../../Utility/general/general";
import {
  getAllRequistion,
  getExpiriedProduct,
  getOutOfStockRequest,
} from "../../../../Utility/product/product";
import { getSupplyRequest } from "../../../../Utility/storeServices/storeServices";
import { clearAuthentication } from "../auth/loginAction";
import { getExpiriedProductMethod } from "../inventory/addExpiriesAction";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "../inventory/addProductAction";
import { getProductExpiryAction } from "../inventory/productInventoryAction";
import { setReorderHandler } from "../inventory/requistionAction";
import { getNotificationMethod } from "../message/messageAction";
// DONT TOUCH THIS O
// IT IS FOR ANOTHER MODULE
export const initStoreReportRequistion = (token, setState) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      const requistionResponse = await getAllRequistion(token, {
        issuance: true,
      });
      if (requistionResponse?.ok) {
        const requistions = await requistionResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            requistions,
            loading: false,
          };
        });
      } else {
        throw {
          message: requistionResponse.statusText,
          status: requistionResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
        };
      });
    }
  };
};

export const filterStoreReportRequistion = (e, token, setState) => {
  e.preventDefault();
  return async (dispatch) => {
    try {
      const object = Object.fromEntries(new FormData(e.target).entries());
      setState((prevState) => {
        return {
          ...prevState,
          form: false,
          loading: true,
        };
      });
      const requistionResponse = await getAllRequistion(token, object);
      if (requistionResponse?.ok) {
        const requistions = await requistionResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            requistions,
            loading: false,
          };
        });
      } else {
        throw {
          message: requistionResponse.statusText,
          status: requistionResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("no requistions found"));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
          requistions: [],
        };
      });
    }
  };
};

// STORE VISUALIZATION REPORT
export const storeVisualizationRequistions = (
  token,
  setState,
  object = { issuance: true }
) => {
  setState((prevState) => {
    return {
      ...prevState,
      loading: true,
    };
  });
  return async (dispatch) => {
    try {
      const requistionResponse = await getAllRequistion(token, object);
      if (!requistionResponse?.ok) {
        throw {
          message: requistionResponse.statusText,
          status: requistionResponse.status,
        };
      } else {
        const requistions = await requistionResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            requistions,
            loading: false,
          };
        });
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
          requistions: [],
        };
      });
    }
  };
};
export const storeVisualizationSupplies = (token, setState, object = {}) => {
  setState((prevState) => {
    return {
      ...prevState,
      loading: true,
    };
  });
  return async (dispatch) => {
    try {
      const suppliesResponse = await getSupplyRequest(token, object);

      if (!suppliesResponse?.ok) {
        throw {
          message: suppliesResponse.statusText,
          status: suppliesResponse.status,
        };
      } else {
        const supplies = await suppliesResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            supplies,
          };
        });
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
          supplies: [],
        };
      });
    }
  };
};
// / INIT STORE VISUALIZATION
export const initStoreVisualization = (token, setState, socket, object) => {
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  return (dispatch) => {
    dispatch(storeVisualizationRequistions(token, setState, object));
    dispatch(storeVisualizationSupplies(token, setState, object));
    dispatch(getProductExpiryAction(token, $location, unit, clinic, socket));
    dispatch(setReorderHandler(token, $location, unit, clinic));
    dispatch(
      getNotificationMethod(token, { clinic, unit, location: $location })
    );
    // dispatch(setMinimumQuantityHandler(token, $location, unit, clinic));
  };
};

export const filterStoreVisualization = (e, token, setState) => {
  e.preventDefault();
  const form = Object.fromEntries(new FormData(e.target).entries());
  return (dispatch) => {
    dispatch(initStoreVisualization(token, setState, form));
    setState((prevState) => {
      return {
        ...prevState,
        form: false,
      };
    });
  };
};

// INIT STORE OS AND EXPIRY VISUALIZATION
const expiryReportVisualization = (
  setState,
  token,
  location,
  unit,
  clinic,
  startDate,
  endDate
) => {
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    // FOR EXPIRIES
    try {
      const expiriesResponse = await getExpiriedProduct(token, {
        location,
        unit,
        clinic,
        startDate,
        endDate,
      });
      if (expiriesResponse?.ok) {
        const products = await expiriesResponse.json();
        const quantityGraph = getExpiryQuantityAnalysis(
          products,
          startDate,
          endDate
        );

        const totalPriceGraph = getExpiryTotalPriceAnalysis(
          products,
          startDate,
          endDate
        );

        const data = [totalPriceGraph, quantityGraph];
        setState((prevState) => {
          return {
            ...prevState,
            expiriesData: data,
            loading: false,
          };
        });
      } else {
        throw {
          status: expiriesResponse.status,
          message: expiriesResponse.statusText,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
        };
      });
    }
  };
};
const osReportVisualization = (token, setState, startDate, endDate) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      const osResponse = await getOutOfStockRequest(token, {
        startDate,
        endDate,
      });
      if (osResponse?.ok) {
        const osReport = await osResponse.json();
        const data = Object.entries(
          osReport.reduce((acc, cur) => {
            acc[cur.name] ? acc[cur.name]++ : (acc[cur.name] = 1);
            return acc;
          }, {})
        ).reduce(
          (acc, cur) => {
            const [x, y] = cur;
            acc.x.push(x);
            acc.y.push(y);
            return acc;
          },
          {
            x: [],
            y: [],
            type: "bar",
            marker: {
              color: "#25447d",
            },
          }
        );
        setState((prevState) => {
          return {
            ...prevState,
            osData: [data],
            loading: false,
          };
        });
      } else {
        throw {
          status: osResponse.status,
          message: osResponse.statusText,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
    }
  };
};

export const initOsExpiryVisualization = (
  token,
  setState,
  location,
  unit,
  clinic,
  startDate,
  endDate
) => {
  return (dispatch) => {
    dispatch(
      expiryReportVisualization(
        setState,
        token,
        location,
        unit,
        clinic,
        startDate,
        endDate
      )
    );
    dispatch(osReportVisualization(token, setState, startDate, endDate));
  };
};
export const filterOsExpiryVisualization = (
  e,
  token,
  setState,
  location,
  unit,
  clinic
) => {
  e.preventDefault();
  return (dispatch) => {
    const form = Object.fromEntries(new FormData(e.target).entries());
    setState((prevState) => {
      return {
        ...prevState,
        form: false,
      };
    });
    const { type, endDate, startDate } = form;
    if (type === "EXPIRIES") {
      dispatch(
        expiryReportVisualization(
          setState,
          token,
          location,
          unit,
          clinic,
          startDate,
          endDate
        )
      );
    } else {
      dispatch(osReportVisualization(token, setState, startDate, endDate));
    }
  };
};
