export async function getSalesDatabase(
  token,
  reqFunction,
  location,
  unit,
  clinic,
  ResponseError,
  pricing,
  startDate,
  endDate
) {
  let message = null;

  let now = new Date();
  startDate = `${now.getFullYear()}-${now.getMonth() + 1}`;
  if (now.getMonth() == 11) {
    let current = new Date(now.getFullYear() + 1, 0, 1);
    endDate = `${current.getFullYear()}-${current.getMonth() + 1}`;
  } else {
    let current = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    endDate = `${current.getFullYear()}-${current.getMonth() + 1}`;
  }

  const response = await reqFunction(
    token,
    location,
    unit,
    clinic,
    startDate,
    endDate,
    pricing
  );
  try {
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
    return response;
  } catch (err) {
    switch (err?.response?.status) {
      case 400:
        message = "Error, Fetching Database";
        break;
      case 401:
        message = "Unauthorized";
        break;
      case 404:
        message = "Database is empty";
        break;
      case 500:
        message = " error, connecting to server";
        break;
      default:
        return { message, err };
    }
    return { message, err };
  }
}
export async function getSales(
  token,
  location,
  pharmacyUnit,
  clinic,
  startDate,
  endDate,
  pricing = "All"
) {
  const response = await fetch(
    `/api/productsales/search?pricing=${pricing}&location=${location}&unit=${pharmacyUnit}&clinic=${clinic}&end_date=${endDate}&start_date=${startDate}`,
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
export async function getFilterSales(token, filterObject) {
  const keys = Object.keys(filterObject);
  const filterString = keys
    .map((key) => {
      return `${key}=${filterObject[key]}`;
    })
    .join("&");
  const response = await fetch(`/api/productsales/search?${filterString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}
export async function addSale(token, data) {
  const response = await fetch("/api/productsales", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });
  return response;
}
export async function editSaleRequest(token, id, body) {
  const response = await fetch(`/api/productsales/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });

  return response;
}
export async function deleteSaleRequest(token, id) {
  const response = await fetch(`/api/productsales/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

export const calculateReorderLevelRequest = async (token, body) => {
  const response = await fetch("/api/sales-reorderlevel", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
};
