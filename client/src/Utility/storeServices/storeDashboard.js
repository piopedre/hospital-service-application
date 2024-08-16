import { analyseData } from "./storeVisualizationReport";
export const getDataAnalysis = (state) => {
  let supplyData = null;
  let requistionData = null;

  if (state.supplies) {
    supplyData = state.supplies.reduce(
      (acc, cur) => {
        const totalPrice = [...cur.products].reduce(
          (acc, cur) => (acc += cur.qtyPrice),
          0
        );
        acc["price"][cur.createdAt]
          ? (acc["price"][cur.createdAt] += totalPrice)
          : (acc["price"][cur.createdAt] = totalPrice);
        acc["product"][cur.createdAt]
          ? (acc["product"][cur.createdAt] += cur.products.length)
          : (acc["product"][cur.createdAt] = cur.products.length);
        return acc;
      },
      {
        price: {},
        product: {},
        type: "Supply",
      }
    );
  } else {
    return {
      price: {},
      product: {},
      type: "Supply",
    };
  }

  if (state.requistions) {
    requistionData = state.requistions.reduce(
      (acc, cur) => {
        acc["price"][cur.createdAt]
          ? (acc["price"][cur.createdAt] += cur.costOfRequistion)
          : (acc["price"][cur.createdAt] = cur.costOfRequistion);
        acc["product"][cur.createdAt]
          ? (acc["product"][cur.createdAt] += cur.products.length)
          : (acc["product"][cur.createdAt] = cur.products.length);
        return acc;
      },
      {
        price: {},
        product: {},
        type: "Requistions",
      }
    );
  } else {
    return {
      price: {},
      product: {},
      type: "Requistions",
    };
  }

  const supplyGraphData = [];
  analyseData([supplyData]).forEach((data) => {
    if (data.x.length) {
      supplyGraphData.push(data);
    }
  });
  const requistionGraphData = [];
  analyseData([requistionData]).forEach((data) => {
    if (data.x.length) {
      requistionGraphData.push(data);
    }
  });
  if (requistionGraphData.length && supplyGraphData.length) {
    const priceGraph = [supplyGraphData[0], requistionGraphData[0]];
    const productGraph = [supplyGraphData[1], requistionGraphData[1]];
    return [
      { data: priceGraph, title: " Supply Requistion Price  Analysis" },
      {
        data: productGraph,
        title: "Requistions Supply Product Analysis",
      },
    ];
  } else if (requistionGraphData.length && !supplyGraphData.length) {
    return [
      { data: requistionGraphData, title: "Requistion Price Product Analysis" },
    ];
  } else if (!requistionGraphData.length && supplyGraphData.length) {
    return [
      {
        data: supplyGraphData,
        title: "Requistion Price Product Analysis",
      },
    ];
  } else {
    return [];
  }
};
