export const setForm = (e, setFormFunction) => {
  setFormFunction((prevState) => {
    return {
      ...prevState,
      [e.target.name]: e.target.value,
    };
  });
};

export const addFormHandler = (e, id, database, form, setForm, setAddState) => {
  setAddState((prevState) => {
    return {
      ...prevState,
      searchModal: false,
      firstClick: true,
    };
  });
  const product = database.find((product) => product._id === id);

  const keys = Object.keys(form);
  const newProduct = {
    ...product,
  };
  const parsedDate = Date.parse(`${newProduct.expiryDate}`);
  const newDate = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    month: "2-digit",
  })
    .format(parsedDate)
    .replace("/", "-");
  const expiryDate = [newDate.split("-")[1], newDate.split("-")[0]].join("-");
  newProduct.expiryDate = expiryDate;
  newProduct.productCategory = newProduct.productCategory?.category;
  const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
  keys.forEach((key) => {
    setForm((prevState) => {
      const newState = { ...prevState };
      newState[key] = newProduct[key];

      newState.quantity = "";
      newState.minimumQuantity = "";
      return newState;
    });
  });
};

// Product Category
export async function categoryAdd(token, body) {
  const response = await fetch("/api/product/new-category", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
export async function getCategory(token) {
  const response = await fetch("/api/product/categories", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}
export async function editCategory(token, id, body) {
  const response = await fetch(`/api/product/categories/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
export async function deleteCategoryMethod(token, id) {
  const response = await fetch(`/api/product/categories/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

export const validateForm = (form) =>
  Object.entries(Object.fromEntries(form)).every(([key, value]) =>
    value.trim()
  );
export async function addProductRequest(token, data) {
  const response = await fetch("/api/products/add-product", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });
  return response;
}
export async function addProductLogs(token, body) {
  const response = await fetch("/api/productlogs", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
