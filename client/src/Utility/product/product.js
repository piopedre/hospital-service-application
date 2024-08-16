export async function getAllProducts(
  token,
  location = undefined,
  pharmacyUnit = undefined,
  clinic = undefined
) {
  const response = await fetch(
    `/api/products/search?location=${location}&unit=${pharmacyUnit}&clinic=${clinic}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  return response;
}
export async function getProductById(token, id) {
  const response = await fetch(`/api/products/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

export async function updateProductQuantity(token, id, body) {
  const response = await fetch(`/api/product/quantity/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
export async function fetchProducts(token, object) {
  const queryString = Object.keys(object)
    .map((key) => `${[key]}=${object[key]}`)
    .join("&");
  const response = await fetch(`/api/fetch-products?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

export async function otherUnitsInventory(token, id, object) {
  const queryString = Object.keys(object)
    .map((key) => `${[key]}=${object[key]}`)
    .join("&");

  const response = await fetch(`/api/other-products/${id}?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

export async function addProductQuantity(token, id, body) {
  const response = await fetch(`/api/product/add-quantity/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
export async function editProductById(token, id, body) {
  const response = await fetch(`/api/products/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
export async function deleteProductById(token, id) {
  const response = await fetch(`/api/products/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}
// PRODUCT LOG
export async function getProductLogsByProduct(token, object, id) {
  const queryString = Object.keys(object)
    .map((key) => `${[key]}=${object[key]}`)
    .join("&");
  const response = await fetch(
    `/api/productlogsbyproduct/${id}?${queryString}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  return response;
}
export async function getExpiriedProduct(token, object) {
  const queryString = Object.keys(object)
    .map((key) => `${[key]}=${object[key]}`)
    .join("&");
  const response = await fetch(`/api/product/expiries?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

// REQUISTION
export async function postRequistion(token, body) {
  const response = await fetch("/api/requistion", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
export async function getAllRequistion(token, object) {
  if (Object.keys(object).length) {
    const queryString = Object.keys(object)
      .map((key) => `${[key]}=${object[key]}`)
      .join("&");
    const response = await fetch(`/api/requistion?${queryString}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });
    return response;
  } else {
    const response = await fetch("/api/requistion?", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });
    return response;
  }
}

export async function getLastRequistion(token, location, unit, clinic) {
  const response = await fetch(
    `/api/last-requistion?location=${location}&unit=${unit}&clinic=${clinic}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  return response;
}
export async function getissuedRequistion(token, location, unit) {
  const response = await fetch(
    `/api/issued-requistion?location=${location}&unit=${unit}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    }
  );
  return response;
}

export async function setRequistion(token, id, body) {
  const response = await fetch(`/api/requistion/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
// OUT OF STOCK
export async function addOutOfStockRequest(token, body) {
  const response = await fetch(`/api/out-of-stock`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}

export async function getOutOfStockRequest(token, object) {
  const queryString = Object.keys(object)
    .map((key) => `${[key]}=${object[key]}`)
    .join("&");

  const response = await fetch(`/api/out-of-stock?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

export async function getAllOsRequest(token, object) {
  const queryString = Object.keys(object)
    .map((key) => `${[key]}=${object[key]}`)
    .join("&");
  const response = await fetch(`/api/get-all-os?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}
// DRUG THERAPY PROBLEM
export async function addDrugTherapyRequest(token, body) {
  const response = await fetch("/api/drugtherapyProblem", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}

export async function getDrugTherapyRequest(token, object) {
  const queryString = Object.keys(object)
    .map((key) => `${[key]}=${object[key]}`)
    .join("&");
  if (Object.keys(object).length) {
    const response = await fetch(`/api/drugtherapyProblem?${queryString}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });
    return response;
  } else {
    const response = await fetch("/api/drugtherapyProblem", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-type": "application/json",
      },
    });
    return response;
  }
}
// Add Expiries to Product
export async function addExpiriesRequest(token, id, body) {
  const response = await fetch(`/api/product/expiries/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}

// Pharmacovigilance

export async function addPharmacovigilanceRequest(token, body) {
  const response = await fetch(`/api/pharmacovigilance`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
export async function getPharmacovigilanceRequest(token, object) {
  // GET PHARMACOVIGILANCE REPORTS WITHIN A MONTH
  let startDate = null;
  let endDate = null;
  let now = new Date();
  startDate = `${now.getFullYear()}-${now.getMonth() + 1}`;
  if (now.getMonth() == 11) {
    let current = new Date(now.getFullYear() + 1, 0, 1);
    endDate = `${current.getFullYear()}-${current.getMonth() + 1}`;
  } else {
    let current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    endDate = `${current.getFullYear()}-${current.getMonth() + 1}`;
  }
  if (!object.startDate && !object.endDate) {
    object.startDate = startDate;
    object.endDate = endDate;
  }
  const queryString = Object.keys(object)
    .map((key) => `${[key]}=${object[key]}`)
    .join("&");
  const response = await fetch(`/api/pharmacovigilance?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}
export async function getProductExpires(token, object) {
  const queryString = Object.keys(object)
    .map((key) => `${[key]}=${object[key]}`)
    .join("&");
  const response = await fetch(`/api/product/get-expiries?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}
