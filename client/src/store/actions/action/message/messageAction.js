import {
  getUsers,
  getChats,
  getUser,
  getMessages,
  sendMessageRequest,
  accessChats,
  setLatestMessage,
  createGroupChatRequest,
  deleteGroupChatRequest,
  editGroupChatUsersRequest,
  renameGroupChatRequest,
  getUsersInstitution,
  addNotificationRequest,
  getNotificationRequest,
  getNotificationMessageRequest,
  setNotificationRequest,
} from "../../../../Utility/users/usersChat";
import {
  resetProductMessenger,
  sendProductMessenger,
} from "../inventory/addProductAction";
import { clearAuthentication } from "../auth/loginAction";
import {
  MESSENGER,
  CLEAR_MESSENGER,
  SET_NOTIFICATION,
  ADD_NOTIFICATION,
} from "../../actionTypes/actionTypes";
import {
  clearNotification,
  getNotificationFailedAction,
} from "../navigation/navigationAction";

export const sendMessage = (message) => {
  return {
    type: MESSENGER,
    message,
  };
};

export const setNotification = (index) => {
  return {
    type: SET_NOTIFICATION,
    index,
  };
};

export const addNotification = (notification) => {
  return {
    type: ADD_NOTIFICATION,
    notification,
  };
};

export const clearMessage = () => {
  return {
    type: CLEAR_MESSENGER,
  };
};
export const addNotificationMethod = (notification) => {
  return (dispatch) => {
    dispatch(addNotification(notification));
  };
};

export const filterNotificationMethod = (index) => {
  return (dispatch) => {
    dispatch(setNotification(index));
  };
};
export const searchUsers = (token, state, setState) => {
  return async (dispatch) => {
    if (state.addSearch.trim()) {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      try {
        const response = await getUsers(token, state.addSearch);
        if (response.ok) {
          const data = await response.json();
          setState((prevState) => {
            return {
              ...prevState,
              userSearch: [...data],
              addSearch: "",
            };
          });
        } else {
          throw {
            message: response.statusText,
            status: response.status,
          };
        }
      } catch (error) {
        if (error.status === 401) {
          dispatch(clearAuthentication(error.status));
        } else {
          dispatch(sendProductMessenger("No Users Present", true));
          setTimeout(() => {
            dispatch(resetProductMessenger());
          }, 3000);
        }
      }
    } else {
      return;
    }
    setState((prevState) => {
      return {
        ...prevState,
        loading: false,
      };
    });
  };
};
export const fetchChats = (token, setState, socket) => {
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        chatLoading: true,
      };
    });
    try {
      const response = await getChats(token);
      const responseUser = await getUser(token);
      if (responseUser?.ok) {
        const mainUser = await responseUser.json();
        setState((prevState) => {
          return {
            ...prevState,
            mainUser,
            chatLoading: false,
          };
        });
      } else {
        throw {
          status: responseUser.status,
          message: responseUser.statusText,
        };
      }
      if (response?.ok) {
        const chats = await response.json();
        setState((prevState) => {
          return {
            ...prevState,
            chats,
            chatLoading: false,
          };
        });
      } else {
        throw {
          status: response.status,
          message: response.statusText,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
        return;
      }
      setState((prevState) => {
        return {
          ...prevState,
          chatLoading: false,
        };
      });
    }
  };
};
export const miniChats = (token, setState) => {
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        chatLoading: true,
      };
    });
    try {
      const response = await getChats(token);
      if (response?.ok) {
        const chats = await response.json();
        setState((prevState) => {
          return {
            ...prevState,
            chats,
            chatLoading: false,
          };
        });
      } else {
        throw {
          status: response.status,
          message: response.statusText,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
        return;
      }
      setState((prevState) => {
        return {
          ...prevState,
          chatLoading: false,
        };
      });
    }
  };
};

export const setChat = (setState, token, socket, chat, user) => {
  return async (dispatch) => {
    try {
      // if no chat
      if (!chat) {
        const accesChatResponse = await accessChats(
          token,
          JSON.stringify({ userId: user._id })
        );
        if (accesChatResponse?.ok) {
          chat = await accesChatResponse.json();
        } else {
          throw {
            message: accesChatResponse.statusText,
            status: accesChatResponse.status,
          };
        }
      }
      // selectedChatId
      if (window.innerWidth < 640) {
        setState((prevState) => {
          return {
            ...prevState,
            addChat: false,
            chatBox: true,
            messageLoading: true,
            chat,
          };
        });
      } else {
        setState((prevState) => {
          return {
            ...prevState,
            addChat: false,
            chatBox: false,
            messageLoading: true,
            chat,
          };
        });
      }
      const messageResponse = await getMessages(token, chat._id);
      if (messageResponse?.ok) {
        const messages = await messageResponse.json();
        setState((prevState) => {
          return {
            ...prevState,
            messages,
            messageLoading: false,
          };
        });
        // socket join chat with another user
        socket.emit("join chat", chat._id);
        dispatch(miniChats(token, setState));
      } else {
        throw {
          message: messageResponse.statusText,
          status: messageResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
        return;
      }
      setState((prevState) => {
        return {
          ...prevState,
          messageLoading: false,
          messages: [],
        };
      });
    }
  };
};

export const sendMessageMethod = (token, setState, state, socket) => {
  return async (dispatch) => {
    try {
      if (state.message.trim()) {
        socket.emit("stop typing", state.chat._id);
        setState((prevState) => {
          return {
            ...prevState,
            messageLoading: true,
            message: "",
          };
        });
        const messageResponse = await sendMessageRequest(
          token,
          JSON.stringify({
            content: state.message,
            chat: state.chat._id,
            sender: state.mainUser._id,
          })
        );
        if (messageResponse?.ok) {
          const message = await messageResponse.json();
          // Set Latest Message
          const latestMessageResponse = await setLatestMessage(
            token,
            JSON.stringify({ messageId: message._id }),
            state.chat._id
          );
          if (latestMessageResponse?.ok) {
            const notificationResponse = await addNotificationRequest(
              token,
              JSON.stringify({
                type: "message",
                message: message.content,
                sender: message.sender._id,
                chat: state.chat._id,
              })
            );

            if (notificationResponse?.ok) {
              const notification = await notificationResponse.json();
              socket.emit("notification", notification);
              socket.emit("new message", message);
              setState((prevState) => {
                return {
                  ...prevState,
                  messages: [...prevState.messages, message],
                  messageLoading: false,
                  message: "",
                };
              });
            }
          } else {
            throw {
              message: latestMessageResponse.statusText,
              status: latestMessageResponse.status,
            };
          }
        } else {
          throw {
            message: messageResponse.statusText,
            status: messageResponse.status,
          };
        }
      } else {
        return;
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
        return;
      }
      setState((prevState) => {
        return {
          ...prevState,
          messageLoading: false,
        };
      });
    }
  };
};
export const getUsersRequest = (token, state, setState) => {
  return async (dispatch) => {
    try {
      if (state.groupUserSearch.trim()) {
        setState((prevState) => {
          return {
            ...prevState,
            groupChatLoading: true,
          };
        });
        const usersResponse = await getUsers(token, state.groupUserSearch);
        if (usersResponse?.ok) {
          const users = await usersResponse.json();
          setState((prevState) => {
            return {
              ...prevState,
              groupChatLoading: false,
              users,
            };
          });
        } else {
          throw {
            message: usersResponse.statusText,
            status: usersResponse.status,
          };
        }
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
        return;
      }
      setState((prevState) => {
        return {
          ...prevState,
          groupChatLoading: false,
          users: [],
        };
      });
    }
  };
};
export const getUsersInstitutionRequest = (token, state, setState) => {
  return async (dispatch) => {
    try {
      if (state.search.trim()) {
        setState((prevState) => {
          return {
            ...prevState,
            loading: true,
          };
        });
        const usersResponse = await getUsersInstitution(token, state.search);
        if (usersResponse?.ok) {
          const users = await usersResponse.json();
          setState((prevState) => {
            return {
              ...prevState,
              loading: false,
              users,
            };
          });
        } else {
          throw {
            message: usersResponse.statusText,
            status: usersResponse.status,
          };
        }
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
        return;
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
          users: [],
        };
      });
    }
  };
};
export const createGroupChat = (token, state, setState) => {
  return async (dispatch) => {
    if (state.addGroupUsers.length >= 2 && state.groupChatName.trim()) {
      try {
        setState((prevState) => {
          return {
            ...prevState,
            createGroupChat: false,
            chatLoading: true,
          };
        });
        const createGroupChatResponse = await createGroupChatRequest(
          token,
          JSON.stringify({
            name: state.groupChatName,
            users: [...state.addGroupUsers].map((user) => user._id),
          })
        );
        if (createGroupChatResponse?.ok) {
          const groupChat = await createGroupChatResponse.json();
          setState((prevState) => {
            return {
              ...prevState,
              chatLoading: false,
              chat: groupChat,
              addGroupUsers: [],
              groupUserSearch: "",
              groupChatName: "",
              users: [],
            };
          });
          dispatch(miniChats(token, setState));
        } else {
          throw {
            message: createGroupChatResponse.statusText,
            status: createGroupChatResponse.status,
          };
        }
      } catch (error) {
        if (error.status === 401) {
          dispatch(clearAuthentication(error.status));
          return;
        }
        setState((prevState) => {
          return {
            ...prevState,
            chatLoading: false,
          };
        });
      }
    } else {
      return;
    }
  };
};
// for notification
export const addNotificationAction = (notification) => {
  return (dispatch) => {
    dispatch(addNotification(notification));
  };
};

export const getNotificationMethod = (token, object) => {
  return async (dispatch) => {
    dispatch(clearNotification());
    try {
      const response = await getNotificationRequest(token, object);
      if (response?.ok) {
        const notifications = await response.json();
        notifications.forEach((notification) => {
          dispatch(addNotificationAction(notification));
        });
      } else {
        throw {
          message: response.statusText,
          status: response.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      dispatch(getNotificationFailedAction());
    }
  };
};

export const setNotificationMethod = (token, id, setState, object) => {
  return async (dispatch) => {
    try {
      const notificationResponse = await setNotificationRequest(token, id);
      if (!notificationResponse?.ok) {
        throw {
          message: notificationResponse.statusText,
          status: notificationResponse.status,
        };
      } else {
        setState((prevState) => {
          return {
            ...prevState,
            notifications: [],
          };
        });
        dispatch(getNotificationMethod(token, object));
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
    }
  };
};
export const getNotificationMessageMethod = (token, setState) => {
  return async (dispatch) => {
    try {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });

      const response = await getNotificationMessageRequest(token);
      if (response?.ok) {
        const notifications = await response.json();
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            notifications,
          };
        });
      } else {
        throw {
          message: response.statusText,
          status: response.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
          notifications: [],
        };
      });
    }
  };
};

export const getChatsMethod = (token, setState) => {
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        chatLoading: true,
      };
    });
    try {
      const response = await getChats(token);

      if (response?.ok) {
        const chats = await response.json();
        setState((prevState) => {
          return {
            ...prevState,
            chats,
            chatLoading: false,
            chatBox: false,
            chat: null,
          };
        });
      } else {
        throw {
          status: response.status,
          message: response.statusText,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
        return;
      }
      setState((prevState) => {
        return {
          ...prevState,
          chatLoading: false,
          chatBox: false,
          chat: null,
        };
      });
    }
  };
};
const editUsersToGroupChat = (token, state, setState) => {
  return async (dispatch) => {
    if (state.addGroupUsers.length < 3) {
      dispatch(sendProductMessenger(`A groupChat needs at least 3 users`));
      dispatch(
        setTimeout(() => {
          resetProductMessenger();
        }, 3000)
      );
      return;
    }
    try {
      const editChatResponse = await editGroupChatUsersRequest(
        token,
        state.chat._id,
        JSON.stringify({ users: state.addGroupUsers.map((user) => user._id) })
      );

      if (editChatResponse?.ok) {
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
        dispatch(miniChats(token, setState));
      } else {
        throw {
          message: editChatResponse.statusText,
          status: editChatResponse.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("unable to edit chat users"));

        dispatch(
          setTimeout(() => {
            resetProductMessenger();
          }, 3000)
        );
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            createGroupChat: true,
          };
        });
      }
    }
  };
};

const changeGroupChatName = (token, state, setState) => {
  return async (dispatch) => {
    try {
      const changeGroupChatResponse = await renameGroupChatRequest(
        token,
        state.chat._id,
        JSON.stringify({ name: state.groupChatName })
      );
      if (changeGroupChatResponse?.ok) {
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
        dispatch(miniChats(token, setState));
      } else {
        throw {
          message: changeGroupChatResponse?.statusText,
          status: changeGroupChatResponse?.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("unable to edit chat name"));

        dispatch(
          setTimeout(() => {
            resetProductMessenger();
          }, 3000)
        );
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            createGroupChat: true,
          };
        });
      }
    }
  };
};
export const editChat = (token, state, setState) => {
  return (dispatch) => {
    if (
      state.chat.users.length === state.addGroupUsers.length &&
      state.chat.name.trim === state.groupChatName
    ) {
      return;
    } else if (
      state.chat.users.length !== state.addGroupUsers.length ||
      state.chat.name !== state.groupChatName
    ) {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
          createGroupChat: false,
        };
      });
      if (state.chat.users.length !== state.addGroupUsers.length) {
        dispatch(editUsersToGroupChat(token, state, setState));
      }
      if (state.chat.name !== state.groupChatName) {
        dispatch(changeGroupChatName(token, state, setState));
      }
    }
  };
};

export const deleteChat = (token, state, setState) => {
  return async (dispatch) => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
        deleteModal: false,
      };
    });
    try {
      const deleteResponse = await deleteGroupChatRequest(
        token,
        state.chat._id
      );
      if (deleteResponse?.ok) {
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            editGroupChat: false,
            groupChatName: "",
            groupUserSearch: "",
            addGroupUsers: [],
            users: [],
          };
        });
        dispatch(miniChats(token, setState));
      } else {
        throw {
          status: deleteResponse.status,
          message: deleteResponse.statusText,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("Unable to delete Chat", true));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            createGroupChat: true,
          };
        });
      }
    }
  };
};
