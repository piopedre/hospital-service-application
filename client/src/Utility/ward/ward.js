export async function getAllWards(token) {
  const response = await fetch(`/api/wards`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

export async function addWardRequest(token, data) {
  const response = await fetch("/api/wards", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });
  return response;
}
