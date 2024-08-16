export const updateRequistionTabHandler = (requistion) => {
  const newRequistion = [...requistion];
  const requistionInformation = newRequistion.reduce(
    (acc, requiste, _, arr) => {
      acc.length = arr.length;
      acc.totalPrice = acc.totalPrice + +requiste.get("quantityPrice");
      return acc;
    },
    {
      length: 0,
      totalPrice: 0,
    }
  );
  return requistionInformation;
};

export const filteredSearch = (e, setRender, setfilteredProducts, products) => {
  if (e.target.value.trim()) {
    setRender(true);
    const filteredProducts = products.filter((product) =>
      product.name.includes(e.target.value.toUpperCase())
    );
    setfilteredProducts(filteredProducts);
  } else {
    setRender(false);
    setfilteredProducts([]);
  }
};
export const addRequistionItemHandler = (
  id,
  setRequistion,
  products,
  setRender,
  setPrice,
  setNumber
) => {
  const product = products.find((product) => product._id === id);
  const requistionItem = new Map();
  requistionItem.set("id", product._id);
  requistionItem.set("name", product.name);
  requistionItem.set("onHandQuantity", product.quantity);
  requistionItem.set("costPrice", +product.costPrice);
  requistionItem.set("stockRequired", 1);
  requistionItem.set("approvedQty", 0);
  requistionItem.set("packSize", product.packSize);
  requistionItem.set(
    "quantityPrice",
    +(requistionItem.get("stockRequired") * product.costPrice).toFixed(2)
  );

  let requistionInformation = null;
  setRequistion((prevRequistion) => {
    if (!prevRequistion.length) {
      requistionInformation = updateRequistionTabHandler([requistionItem]);
      setPrice(requistionInformation.totalPrice);
      setNumber(requistionInformation.length);
      return [requistionItem];
    } else {
      const duplicate = prevRequistion.find(
        (requiste) => requiste.get("id") === id
      );
      if (duplicate) {
        requistionInformation = updateRequistionTabHandler(prevRequistion);
        setPrice(requistionInformation.totalPrice);
        setNumber(requistionInformation.length);
        return prevRequistion;
      } else {
        requistionInformation = updateRequistionTabHandler([
          ...prevRequistion,
          requistionItem,
        ]);
        setPrice(requistionInformation.totalPrice);
        setNumber(requistionInformation.length);
        return [requistionItem, ...prevRequistion];
      }
    }
  });

  setRender(false);
};
export const updateRequistionItemHandler = (
  e,
  id,
  setRequistion,
  setPrice,
  setNumber
) => {
  let requistionInformation = null;
  setRequistion((prevRequistion) => {
    const requiste = prevRequistion.find(
      (requiste) => requiste.get("id") === id
    );
    const requisteIndex = prevRequistion.findIndex(
      (requiste) => requiste.get("id") === id
    );
    const newRequistion = [...prevRequistion];
    requiste.set("stockRequired", e.target.value);
    requiste.set("quantityPrice", +e.target.value * requiste.get("costPrice"));
    newRequistion.splice(requisteIndex, 1, requiste);
    requistionInformation = updateRequistionTabHandler(newRequistion);
    setPrice(requistionInformation.totalPrice);
    setNumber(requistionInformation.length);
    return newRequistion;
  });
};

export const deleteRequistionItemHandler = (
  id,
  setRequistion,
  setPrice,
  setNumber
) => {
  let requistionInformation = null;
  setRequistion((prevRequistion) => {
    const requistion = [...prevRequistion];
    const newRequistion = requistion.filter(
      (requiste) => requiste.get("id") !== id
    );
    requistionInformation = updateRequistionTabHandler(newRequistion);
    setPrice(requistionInformation.totalPrice);
    setNumber(requistionInformation.length);
    return newRequistion;
  });
};

export const addPotentialRequisteHandler = (
  database,
  setRequistion,
  setRender,
  setPrice,
  setNumber
) => {
  const requistes = database
    .filter(
      (product) =>
        product.quantity <= product.minimumQuantity || product.quantity === 0
    )
    .slice(0, 10);
  requistes.forEach((req) => {
    addRequistionItemHandler(
      req._id,
      setRequistion,
      database,
      setRender,
      setPrice,
      setNumber
    );
  });
};
