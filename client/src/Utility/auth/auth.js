export async function loginUser(data) {
  const response = await fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: data,
  });
  return response;
}
export async function registerUserReq(token, data) {
  const response = await fetch("/api/users/registration", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });
  return response;
}
export class ResponseError extends Error {
  constructor(message, res) {
    super(message);
    this.response = res;
  }
}

export async function logoutRequest(token) {
  const response = await fetch("/api/user/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
}
// AUTH GET LOGIN
export async function getUsername(body) {
  const response = await fetch("/api/users/getUser", {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body,
  });
  return response;
}
