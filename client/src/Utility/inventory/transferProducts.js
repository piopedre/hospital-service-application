export const addToProductListHandler = (id, products, state, setState) => {
  const duplicate = state.productList.find(
    (product) => product.get("id") === id
  );
  if (duplicate) {
    setState((prevState) => {
      return {
        ...prevState,
        search: "",
        searchModal: false,
      };
    });
    return;
  }

  const product = products.find((product) => product._id === id);
  const newProduct = new Map();
  newProduct.set("id", product._id);
  newProduct.set("name", product.name);
  newProduct.set("onHandQuantity", product.quantity);
  newProduct.set("quantity", "");
  newProduct.set("costPrice", product.costPrice);
  newProduct.set("unitCostPrice", product.unitCostPrice);
  newProduct.set("expiryDate", product.expiryDate);
  newProduct.set("packSize", product.packSize);
  const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
  if (unitName !== "STORE") {
    newProduct.set(
      "totalPrice",
      +newProduct.get("quantity") * newProduct.get("unitCostPrice")
    );
  } else {
    newProduct.set(
      "totalPrice",
      +newProduct.get("quantity") * newProduct.get("costPrice")
    );
  }

  setState((prevState) => {
    return {
      ...prevState,
      searchModal: false,
      search: "",
      productList: [newProduct, ...prevState.productList],
    };
  });
};

export const updateProductItem = (e, setState, id) => {
  setState((prevState) => {
    const product = prevState.productList.find(
      (product) => product.get("id") === id
    );
    const productIndex = prevState.productList.findIndex(
      (product) => product.get("id") === id
    );

    product.set("quantity", e.target.value);
    const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
    if (unitName === "STORE") {
      product.set(
        "totalPrice",
        +product.get("quantity") * product.get("costPrice")
      );
    } else {
      product.set(
        "totalPrice",
        +product.get("quantity") * product.get("unitCostPrice")
      );
    }

    const products = [...prevState.productList];
    products.splice(productIndex, 1, product);
    return {
      ...prevState,
      productList: products,
    };
  });
};

export const deleteProductItem = (setState, id) => {
  setState((prevState) => {
    return {
      ...prevState,
      productList: prevState.productList.filter(
        (product) => product.get("id") !== id
      ),
    };
  });
};

// Requests
export async function addTransferRequest(token, body) {
  const response = await fetch("/api/transfer", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
// use this as format
export async function getTransferRequest(token, object) {
  const queryString = Object.keys(object)
    .map((key) => `${[key]}=${object[key]}`)
    .join("&");

  const response = await fetch(`/api/transfer?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

export async function getTransfers(token, object) {
  const queryString = Object.keys(object)
    .map((key) => `${[key]}=${object[key]}`)
    .join("&");

  const response = await fetch(`/api/transfers?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

export async function editTransferRequest(token, id) {
  const response = await fetch(`/api/transfer/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

export const addExpiredProductsToList = (database, state, setState) => {
  const getExpiredProducts = new Set(
    database
      .filter(
        (pr) =>
          Date.parse(pr.expiryDate) < Date.parse(new Date()) && pr.quantity > 0
      )
      .map((product) => product._id)
  );
  [...getExpiredProducts].forEach((id) => {
    addToProductListHandler(id, database, state, setState);
  });
};
