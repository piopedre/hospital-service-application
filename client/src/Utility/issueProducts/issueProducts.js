export const storeProductHandler = (id, setState, state, products) => {
  // get requistion
  const requistion = [...state.requistions].find(
    (requistion) => requistion._id === id
  );
  // set to new requistion
  // const newRequistion = structuredClone(requistion);
  const newRequistion = JSON.parse(JSON.stringify(requistion));
  // Checking for product in store database
  newRequistion.products.forEach((product) => {
    const storeProduct = products.find((pr) => pr.name.includes(product.name));
    if (storeProduct) {
      product.storeProduct = storeProduct;
      if (storeProduct.costPrice !== product.costPrice) {
        product.costPrice = storeProduct.costPrice;
      }
      if (storeProduct.packSize !== product.packSize) {
        product.packSize = storeProduct.packSize;
      }
    } else {
      product.storeProduct = null;
    }
    product.quantityPrice = 0;
  });
  setState((prevState) => {
    return {
      ...prevState,
      requistionComponent: true,
      selectedRequistion: newRequistion,
      selected: true,
    };
  });
};

export const updateStockRequiredHandler = (e, id, setState) => {
  setState((prevState) => {
    const requistion = { ...prevState.selectedRequistion };
    const productItem = requistion.products.find(
      (product) => product.id === id
    );
    const productIndex = requistion.products.findIndex(
      (item) => item.id === id
    );
    productItem.approvedQty = +e.target.value;
    productItem.quantityPrice = +(
      +productItem.approvedQty * +productItem.costPrice
    ).toFixed(2);

    requistion.products.splice(productIndex, 1, productItem);
    return {
      ...prevState,
      selectedRequistion: requistion,
    };
  });
};
export const updateCostPriceHandler = (e, id, setState) => {
  setState((prevState) => {
    const requistion = { ...prevState.selectedRequistion };
    const productItem = requistion.products.find(
      (product) => product.id === id
    );
    const productIndex = requistion.products.findIndex(
      (item) => item.id === id
    );
    productItem.costPrice = +e.target.value;
    productItem.quantityPrice = +(
      +productItem.approvedQty * +productItem.costPrice
    ).toFixed(2);

    requistion.products.splice(productIndex, 1, productItem);
    return {
      ...prevState,
      selectedRequistion: requistion,
    };
  });
};

export const searchStoreProductHandler = (e, setState, products) => {
  if (e.target.value.trim()) {
    const storeProducts = products.filter((product) =>
      product.name.includes(e.target.value.toUpperCase())
    );
    setState((prevState) => {
      return {
        ...prevState,
        storeProducts,
      };
    });
  }
};

export const updateStoreProductHandler = (pr, setState) => {
  setState((prevState) => {
    const selectedRequistionProducts = [
      ...prevState.selectedRequistion.products,
    ];
    const productItem = selectedRequistionProducts.find(
      (pr) => pr.id === prevState.selectedRequistionProduct
    );
    const productIndex = selectedRequistionProducts.findIndex(
      (pr) => pr.id === prevState.selectedRequistionProduct
    );
    productItem.storeProduct = pr;
    if (pr.costPrice !== productItem.costPrice) {
      productItem.costPrice = pr.costPrice;
    }
    if (pr.packSize !== productItem.packSize) {
      productItem.packSize = pr.packSize;
    }
    selectedRequistionProducts.splice(productIndex, 1, productItem);
    const selectedRequistion = {
      ...prevState.selectedRequistion,
    };
    selectedRequistion.products = selectedRequistionProducts;
    return {
      ...prevState,
      selectedRequistion,
      modalPreview: false,
      selectedRequistionProduct: null,
    };
  });
};
export const checkRequistionHeld = (id) => {
  if (sessionStorage.getItem("heldRequistions")) {
    const heldRequistions = JSON.parse(
      sessionStorage.getItem("heldRequistions")
    );
    const requistion = heldRequistions.find((req) => req._id === id);
    if (requistion) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};
