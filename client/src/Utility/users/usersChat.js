// User Role
export const addUserRole = async (token, body) => {
  const response = await fetch("/api/user-role", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
};

export const getUserRole = async (token) => {
  const response = await fetch(`/api/user-role`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};
export const getUsers = async (token, search) => {
  const response = await fetch(`/api/users?search=${search}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};
export const getUsersInstitution = async (token, search) => {
  const response = await fetch(`/api/users-institution?search=${search}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};
// GET PRESENT ADMIN
export const getUser = async (token) => {
  const response = await fetch("/api/user/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};
// UPDATE USER
export const updateUser = async (token, id, body) => {
  const response = await fetch(`/api/users/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
};
// ACTIVATE USER
export const activateUser = async (token, id) => {
  const response = await fetch(`/api/users/activate/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};
// DEACTIVATE
export const deactivateUser = async (token, id) => {
  const response = await fetch(`/api/users/deactivate/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};
// DELETE USER
export const deleteUserMethod = async (token, id) => {
  const response = await fetch(`/api/delete-user/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};
//Chats
export const accessChats = async (token, body) => {
  const response = await fetch("/api/access-chats", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
};
// Check Users available Chats
// when init
export const getChats = async (token) => {
  const response = await fetch("/api/fetch-chats", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};

// create Group Chat
export const createGroupChatRequest = async (token, body) => {
  const response = await fetch("/api/createGroupChat", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
};
export const renameGroupChatRequest = async (token, id, body) => {
  const response = await fetch(`/api/renameGroupChat/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
};
export const editGroupChatUsersRequest = async (token, id, body) => {
  const response = await fetch(`/api/editGroupChat//${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
};

export const deleteGroupChatRequest = async (token, id) => {
  const response = await fetch(`/api/deleteGroupChat/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};
// Get messages
export const getMessages = async (token, id) => {
  const response = await fetch(`/api/messages/${id}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};

// send Messages
export const sendMessageRequest = async (token, body) => {
  const response = await fetch("/api/message", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
};

export const setLatestMessage = async (token, body, id) => {
  const response = await fetch(`/api/chats/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
};
// notification
export const addNotificationRequest = async (token, body) => {
  const response = await fetch("/api/notification", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body,
  });
  return response;
};
export const getNotificationRequest = async (token, object) => {
  const queryString = Object.keys(object)
    .map((key) => `${[key]}=${object[key]}`)
    .join("&");
  const response = await fetch(`/api/notification?${queryString}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};
export const getNotificationMessageRequest = async (token) => {
  const response = await fetch("/api/notification/message", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });
  return response;
};
export const setNotificationRequest = async (token, id) => {
  const response = await fetch(`/api/notification/${id}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
  });

  return response;
};
