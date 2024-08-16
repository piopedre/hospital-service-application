export const selectTransfer = (setState, id, products) => {
  setState((prevState) => {
    const selectedTransfer = [...prevState.transfers].find(
      (transfer) => transfer._id === id
    );
    const newTransfer = {
      ...selectedTransfer,
    };
    const finishTransfer = newTransfer.products.map((product) => {
      const locationProduct = {};
      const lProduct = products.find((pr) => pr.name === product.name);
      if (lProduct) {
        const newProduct = {
          ...lProduct,
        };
        locationProduct.name = newProduct.name;
        locationProduct.quantity = newProduct.quantity;
        locationProduct.expiryDate = newProduct.expiryDate;
        locationProduct.id = newProduct._id;
        locationProduct.packSize = newProduct.packSize;
      }
      return {
        ...product,
        locationProduct,
      };
    });
    return {
      ...prevState,
      selectedTransfer: { ...newTransfer, products: finishTransfer },
      issueTransfer: true,
    };
  });
};

export const setLocationProduct = (setState, products, id) => {
  const product = products.find((pr) => pr._id === id);
  const newProduct = {
    ...product,
  };
  setState((prevState) => {
    const newSelectedTransfer = {
      ...prevState.selectedTransfer,
    };
    const mainProduct = newSelectedTransfer.products.find(
      (pr) => pr.id === prevState.selectedProduct
    );
    const mainProductIndex = newSelectedTransfer.products.findIndex(
      (pr) => pr.id === prevState.selectedProduct
    );

    mainProduct.locationProduct.name = newProduct.name;
    mainProduct.locationProduct.quantity = newProduct.quantity;
    mainProduct.locationProduct.expiryDate = newProduct.expiryDate;
    mainProduct.locationProduct.id = newProduct._id;
    newSelectedTransfer.products.splice(mainProductIndex, 1, mainProduct);
    return {
      ...prevState,
      selectedTransfer: newSelectedTransfer,
      changedModal: false,
    };
  });
};
