export async function addInstitutionRequest(body) {
  const response = await fetch(`/api/institution`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
export async function fetchInstitutionRequest(token) {
  const response = await fetch(`/api/institution`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

export async function loginInstitutionRequest(body) {
  const response = await fetch(`/api/institution/login`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}

export async function logoutInstitutionRequest(token) {
  const response = await fetch(`/api/institution/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}
export async function getInstitutionRequest(token) {
  const response = await fetch(`/api/institution`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}

export async function addDepartmentRequest(token, body) {
  const response = await fetch(`/api/department`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
export async function addLocationRequest(token, body) {
  const response = await fetch(`/api/location`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
export async function addUnitRequest(token, body) {
  const response = await fetch(`/api/unit`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
export async function getUnitRequest(body) {
  const response = await fetch(`/api/units/department`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}

export async function getLocationRequest(body) {
  const response = await fetch(`/api/institution-locations`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}

export async function getClinicalsRequest(body) {
  const response = await fetch("/api/get-clinics", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}

// METHODS
export const editUserValid = (state, user) => {
  return (
    state.firstName === user.firstName &&
    state.lastName === user.lastName &&
    state.userRole === user.role?.name &&
    state.department === user.department.name &&
    state.username === user.username &&
    state.password === ""
  );
};
