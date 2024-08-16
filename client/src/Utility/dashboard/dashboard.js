import { ResponseError } from "../auth/auth";
import { getSales, getSalesDatabase } from "../sales/sales";
import { getDatabase } from "../general/general";
import { getAllProducts } from "../product/product";

// Dashboard Utils Function
export const dashboardGetProducts = async (token, location, unit, clinic) => {
  return await getDatabase(
    token,
    getAllProducts,
    location,
    unit,
    clinic,
    ResponseError
  );
};

export const dashboardGetSales = async (token, location, unit, clinic) =>
  await getSalesDatabase(
    token,
    getSales,
    location,
    unit,
    clinic,
    ResponseError
  );
// Data analysis function
export function productAnalysis(database, plotConfig) {
  if (database || database?.length) {
    const dataAnalysed = database.reduce((acc, cur) => {
      acc[cur.productCategory?.category]
        ? acc[cur.productCategory?.category]++
        : (acc[cur.productCategory?.category] = 1);
      return acc;
    }, {});
    const plotData = Object.entries(dataAnalysed).reduce(
      (acc, [key, value], i) => {
        acc.x.push(key);
        acc.y.push(value);
        return acc;
      },
      { x: [], y: [] }
    );
    plotData.type = plotConfig.type;
    plotData.marker = plotConfig.marker;
    return plotData;
  }
  return {};
}
// DAILY SALES
// to be adjusted later
export function salesAnalysis(database, plotConfig) {
  if (!database || !database.length) {
    return {};
  }
  const dataAnalysed = database.reduce((acc, cur) => {
    acc[cur.createdAt]
      ? (acc[cur.createdAt] += cur.totalPrice)
      : (acc[cur.createdAt] = cur.totalPrice);
    return acc;
  }, {});
  const plotData = Object.entries(dataAnalysed).reduce(
    (acc, [key, value], i) => {
      acc.x.push(key);
      acc.y.push(value);
      return acc;
    },
    { x: [], y: [] }
  );
  plotData.marker = plotConfig.marker;
  return plotData;
}
// Product Sold Analaysis
export function productSalesAnalysis(database, plotConfig) {
  if (database || database?.length) {
    const dataAnalysed = database
      .flatMap((sale) => {
        return sale.products;
      })
      .reduce((acc, cur) => {
        acc[cur.name]
          ? (acc[cur.name] += +cur.quantity)
          : (acc[cur.name] = +cur.quantity);
        return acc;
      }, {});
    const plotData = Object.entries(dataAnalysed).reduce(
      (acc, [key, value]) => {
        acc.x.push(key);
        acc.y.push(value);
        return acc;
      },
      { x: [], y: [] }
    );
    plotData.type = plotConfig.type;
    plotData.marker = plotConfig.marker;
    return plotData;
  }
  return {};
}
