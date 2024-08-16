const getData = (state, type = "supplies") => {
  let stateData = state.supplies;
  let data = null;
  if (type === "requistions") {
    stateData = state.requistions;
  }
  if (stateData?.length) {
    data = stateData.reduce(
      (acc, cur) => {
        if (state.dataType === "product") {
          acc["product"][cur.createdAt]
            ? (acc["product"][cur.createdAt] += +cur.products.length)
            : (acc["product"][cur.createdAt] = +cur.products.length);
        } else if (state.dataType === "price") {
          if (type === "requistions") {
            acc["price"][cur.createdAt]
              ? (acc["price"][cur.createdAt] += cur.costOfRequistion)
              : (acc["price"][cur.createdAt] = cur.costOfRequistion);
          } else {
            const totalPrice = [...cur.products].reduce(
              (acc, cur) => (acc += cur.qtyPrice),
              0
            );
            acc["price"][cur.createdAt]
              ? (acc["price"][cur.createdAt] += totalPrice)
              : (acc["price"][cur.createdAt] = totalPrice);
          }
        } else {
          if (type === "requistions") {
            acc["price"][cur.createdAt]
              ? (acc["price"][cur.createdAt] += cur.costOfRequistion)
              : (acc["price"][cur.createdAt] = cur.costOfRequistion);
          } else {
            const totalPrice = [...cur.products].reduce(
              (acc, cur) => (acc += cur.qtyPrice),
              0
            );

            acc["price"][cur.createdAt]
              ? (acc["price"][cur.createdAt] += totalPrice)
              : (acc["price"][cur.createdAt] = totalPrice);
          }
          acc["product"][cur.createdAt]
            ? (acc["product"][cur.createdAt] += cur.products.length)
            : (acc["product"][cur.createdAt] = cur.products.length);
        }
        acc.type = type;
        return acc;
      },
      { price: {}, product: {} }
    );
    return data;
  } else {
    return { price: {}, product: {} };
  }
};

const analyseDataMethod = (data, type, dataType) => {
  const finalData = [{ ...data }].reduce(
    (acc, cur) => {
      if (Object.entries(cur).length) {
        Object.entries(cur).forEach(([key, value]) => {
          acc.x.push(key);
          acc.y.push(value);
        });
      }
      return acc;
    },
    {
      x: [],
      y: [],
      name: `${dataType} ${type}`.toUpperCase(),
      mode: "lines+markers",
      type: "scatter",
    }
  );
  return finalData;
};
export const analyseData = (data) => {
  let mainData = [];

  data.forEach((datum) => {
    Object.entries(datum).forEach(([key, value], i) => {
      if (typeof value === "object") {
        mainData.push(analyseDataMethod(value, key, datum.type));
      }
    });
  });
  return mainData;
};
export const dataAnalysis = (state) => {
  const mainData = [];
  const dataSupply = getData(state);
  const dataRequistion = getData(state, "requistions");
  const graphData = [];

  // GET ANALYSIS DATA

  if (state.report === "both") {
    if (state.dataType === "both") {
      mainData.push(dataSupply);
      mainData.push(dataRequistion);
      analyseData(mainData).forEach((data) => {
        if (data.x.length) {
          graphData.push(data);
        }
      });
      return graphData;

      //  get Report Data
    } else if (state.dataType === "price") {
      mainData.push({ price: dataSupply.price, type: dataSupply.type });
      mainData.push({ price: dataRequistion.price, type: dataRequistion.type });
      analyseData(mainData).forEach((data) => {
        if (data.x.length) {
          graphData.push(data);
        }
      });
      return graphData;
    } else {
      mainData.push({ product: dataSupply.product, type: dataSupply.type });
      mainData.push({
        product: dataRequistion.product,
        type: dataRequistion.type,
      });
      analyseData(mainData).forEach((data) => {
        if (data.x.length) {
          graphData.push(data);
        }
      });
      return graphData;
    }
  } else if (state.report === "supply") {
    if (state.dataType === "both") {
      mainData.push(dataSupply);
      analyseData(mainData).forEach((data) => {
        if (data.x.length) {
          graphData.push(data);
        }
      });
      return graphData;
    } else if (state.dataType === "price") {
      mainData.push({ price: dataSupply.price, type: dataSupply.type });
      analyseData(mainData).forEach((data) => {
        if (data.x.length) {
          graphData.push(data);
        }
      });
      return graphData;
    } else {
      mainData.push({ product: dataSupply.product, type: dataSupply.type });
      analyseData(mainData).forEach((data) => {
        if (data.x.length) {
          graphData.push(data);
        }
      });
      return graphData;
    }
  } else {
    if (state.dataType === "both") {
      mainData.push(dataRequistion);
      analyseData(mainData).forEach((data) => {
        if (data.x.length) {
          graphData.push(data);
        }
      });
      return graphData;
    } else if (state.dataType === "price") {
      mainData.push({ price: dataRequistion.price, type: dataRequistion.type });
      analyseData(mainData).forEach((data) => {
        if (data.x.length) {
          graphData.push(data);
        }
      });
      return graphData;
    } else {
      mainData.push({
        product: dataRequistion.product,
        type: dataRequistion.type,
      });
      analyseData(mainData).forEach((data) => {
        if (data.x.length) {
          graphData.push(data);
        }
      });
      return graphData;
    }
  }
};
