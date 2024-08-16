import { getDate } from "../../../../Utility/general/general";

import {
  initProductDatabase,
  initProductSalesDatabase,
  initDrugTherapyProblem,
  getCompletedTransfers,
  getCompletedSupplies,
  getPotentialExpiries,
  getUnitsTransfers,
  getExpiriedProductMethod,
} from "../../../index";

import { getPharmacovigilances } from "../patientServices/pharmacovigilanceAction";
import { getOutOfStock } from "../storeServices/outOfStockAction";
import { completedRequistionAction } from "./receiveRequistionAction";

const getProductsReport = (
  token,
  setState,
  location,
  unit,
  clinic,
  startDate,
  endDate
) => {
  const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;

  return (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    // ProductSales Database
    dispatch(
      initProductSalesDatabase(
        token,
        location,
        unit,
        clinic,
        startDate,
        endDate
      )
    );
    //   Product Database
    //   EXPIRED PRODUCTS
    dispatch(
      getExpiriedProductMethod(
        token,
        setState,
        location,
        unit,
        clinic,
        startDate,
        endDate
      )
    );
    //   NO OF SHORTDATED PRODUCTS
    const yearDate = new Date(startDate).setFullYear(
      new Date(startDate).getFullYear() + 1,
      0,
      1
    );
    dispatch(
      getPotentialExpiries(token, location, unit, clinic, yearDate, setState)
    );

    //   GET OUT OF STOCK DATABASE
    dispatch(getOutOfStock(setState, token, { startDate, endDate }));
    // PRODUCTS
    dispatch(initProductDatabase(token, location, unit, clinic));
    // REQUISTIONS
    dispatch(
      completedRequistionAction(
        token,
        setState,
        location,
        unit,
        clinic,
        startDate,
        endDate
      )
    );
    // TRANSFERS
    dispatch(
      getCompletedTransfers(
        token,
        setState,
        location,
        unit,
        clinic,
        startDate,
        endDate
      )
    );
    // UNIT MADE TRANSFERS
    dispatch(
      getUnitsTransfers(
        token,
        setState,
        location,
        unit,
        clinic,
        startDate,
        endDate
      )
    );
    if (unitName === "STORE") {
      // // SUPPLIES
      dispatch(
        getCompletedSupplies(
          token,
          setState,
          location,
          unit,
          clinic,
          startDate,
          endDate
        )
      );
    }

    //   DRUG THERAPY PROBLEMS
    dispatch(initDrugTherapyProblem(token, setState, { startDate, endDate }));
    //  AND PHARMACOVIGILANCE REPORT
    dispatch(getPharmacovigilances({ startDate, endDate }, token, setState));
    setState((prevState) => {
      return {
        ...prevState,
        loading: false,
      };
    });
  };
};

export const initProductsReport = (token, setState, location, unit, clinic) => {
  return (dispatch) => {
    const now = new Date();
    const startDate = getDate(now.setDate(1));
    const endDate = getDate(now.setMonth(now.getMonth() + 1, 1));

    dispatch(
      getProductsReport(
        token,
        setState,
        location,
        unit,
        clinic,
        startDate,
        endDate
      )
    );
  };
};

export const filterProductsReport = (
  e,
  token,
  setState,
  location,
  unit,
  clinic
) => {
  e.preventDefault();
  return (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        filter: false,
      };
    });
    const { startDate, endDate } = Object.fromEntries(
      new FormData(e.target).entries()
    );
    dispatch(
      getProductsReport(
        token,
        setState,
        location,
        unit,
        clinic,
        startDate,
        endDate
      )
    );
  };
};
