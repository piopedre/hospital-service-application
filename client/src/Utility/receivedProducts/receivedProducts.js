export const addToReceivedList = (setState, state, products, id) => {
  const isNotValid = state.receivedItems.find((item) => item.get("id") === id);
  if (isNotValid) {
    setState((prevState) => {
      return {
        ...prevState,
        searchRender: false,
        filteredProducts: [],
      };
    });
    return;
  }
  const productItem = new Map();
  const product = products.find((product) => product._id === id);
  productItem.set("name", product.name);
  productItem.set("id", product._id);
  productItem.set("quantity", "0");
  productItem.set("onHandQty", product.quantity);
  productItem.set("costPrice", product.costPrice);
  productItem.set("category", product.productCategory);
  productItem.set("expiryDate", product.expiryDate.split("T")[0].slice(0, -3));
  productItem.set("packSize", product.packSize);
  productItem.set(
    "qtyPrice",

    +(+productItem.get("quantity") * +productItem.get("costPrice")).toFixed(2)
  );

  setState((prevState) => {
    return {
      ...prevState,
      searchRender: false,
      search: "",
      filteredProducts: [],
      receivedItems: [productItem, ...prevState.receivedItems],
    };
  });
};

export const filteredProducts = (event, products, setState) => {
  if (event.target.value.trim()) {
    const filteredProducts = products.filter((product) =>
      product.name.includes(event.target.value.toUpperCase())
    );
    setState((prevState) => {
      return {
        ...prevState,
        searchRender: true,
        filteredProducts,
      };
    });
  } else {
    setState((prevState) => {
      return {
        ...prevState,
        searchRender: false,
        filteredProducts,
      };
    });
    return;
  }
};
export const updateReceivedListPrice = (e, id, setState) => {
  if (e.target.value && /^[0-9]\d*(\.\d+)?$/.test(+e.target.value)) {
    setState((prevState) => {
      const receivedItems = [...prevState.receivedItems];
      const productItem = receivedItems.find((item) => item.get("id") === id);
      const productIndex = receivedItems.findIndex(
        (item) => item.get("id") === id
      );
      productItem.set("costPrice", e.target.value);
      productItem.set(
        "qtyPrice",

        +(+productItem.get("quantity") * +productItem.get("costPrice")).toFixed(
          2
        )
      );
      receivedItems.splice(productIndex, 1, productItem);
      return {
        ...prevState,
        receivedItems,
      };
    });
  } else {
    setState((prevState) => {
      const receivedItems = [...prevState.receivedItems];
      const productItem = receivedItems.find((item) => item.get("id") === id);
      const productIndex = receivedItems.findIndex(
        (item) => item.get("id") === id
      );
      productItem.set("costPrice", 0);
      productItem.set(
        "qtyPrice",

        +(+productItem.get("quantity") * +productItem.get("costPrice")).toFixed(
          2
        )
      );
      receivedItems.splice(productIndex, 1, productItem);
      return {
        ...prevState,
        receivedItems,
      };
    });
  }
};

export const updateReceivedListExpiryDate = (e, id, setState) => {
  if (e.target.value) {
    setState((prevState) => {
      const receivedItems = [...prevState.receivedItems];
      const productItem = receivedItems.find((item) => item.get("id") === id);
      const productIndex = receivedItems.findIndex(
        (item) => item.get("id") === id
      );
      productItem.set("expiryDate", e.target.value);
      receivedItems.splice(productIndex, 1, productItem);
      return {
        ...prevState,
        receivedItems,
      };
    });
  }
};

export const updateReceivedListQuantity = (e, id, setState) => {
  if (e.target.value && /^[0-9]\d*(\.\d+)?$/.test(+e.target.value)) {
    setState((prevState) => {
      const receivedItems = [...prevState.receivedItems];
      const productItem = receivedItems.find((item) => item.get("id") === id);
      const productIndex = receivedItems.findIndex(
        (item) => item.get("id") === id
      );
      productItem.set("quantity", e.target.value);
      productItem.set(
        "qtyPrice",

        +(+productItem.get("quantity") * +productItem.get("costPrice")).toFixed(
          2
        )
      );
      receivedItems.splice(productIndex, 1, productItem);
      return {
        ...prevState,
        receivedItems,
      };
    });
  } else {
    setState((prevState) => {
      const receivedItems = [...prevState.receivedItems];
      const productItem = receivedItems.find((item) => item.get("id") === id);
      const productIndex = receivedItems.findIndex(
        (item) => item.get("id") === id
      );
      productItem.set("quantity", "0");
      productItem.set(
        "qtyPrice",

        +(+productItem.get("quantity") * +productItem.get("costPrice")).toFixed(
          2
        )
      );
      receivedItems.splice(productIndex, 1, productItem);
      return {
        ...prevState,
        receivedItems,
      };
    });
  }
};

export const removeReceivedListItem = (id, setState) => {
  setState((prevState) => {
    return {
      ...prevState,
      receivedItems: [...prevState.receivedItems].filter(
        (item) => item.get("id") !== id
      ),
    };
  });
};

// SUPPLIES

export const setSelectedSupplyHandler = (id, setState, state) => {
  const selectedSupply = state.supplies.find((supply) => supply._id === id);
  if (selectedSupply) {
    setState((prevState) => {
      return {
        ...prevState,
        selectedSupply,
        preview: true,
      };
    });
  }
};

export const validateReceivedItems = (database, setState) => {
  setState((prevState) => {
    const products = [...prevState.receivedItems];
    products.forEach((product) => {
      const updatedProduct = database.find((p) => p._id === product.get("id"));
      if (updatedProduct.quantity !== product.get("onHandQty")) {
        product.set("onHandQty", updatedProduct.quantity);
      }
      if (updatedProduct.packSize !== product.get("packSize")) {
        product.set("packSize", updatedProduct.packSize);
      }
      if (updatedProduct.costPrice !== product.get("costPrice")) {
        product.set("costPrice", updatedProduct.costPrice);
      }
      if (
        updatedProduct.expiryDate.split("T")[0].slice(0, 7) !==
        product.get("expiryDate")
      ) {
        product.set(
          "expiryDate",
          updatedProduct.expiryDate.split["T"][0].slice(0, 7)
        );
      }
    });
    return {
      ...prevState,
      receivedItems: products,
    };
  });
};
