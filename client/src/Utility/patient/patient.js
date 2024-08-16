export async function getAllPatients(token, search) {
  const response = await fetch(`/api/patients?search=${search}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

export async function addPatientRequest(token, data) {
  const response = await fetch("/api/patients", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });
  return response;
}

export async function updatePatientBalance(token, id, data) {
  const response = await fetch(`/api/update-patient/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });
  return response;
}
export async function updateDepositBalance(token, id, data) {
  const response = await fetch(`/api/update-patient-balance/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });
  return response;
}
