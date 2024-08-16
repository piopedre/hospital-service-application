import React, {
  Fragment,
  useEffect,
  useState,
  useCallback,
  useRef,
} from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import classes from "./MessageApp.module.css";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import Message from "../../components/UI/Message/Message";
import ChatMessenger from "../../components/UI/ChatMessenger/ChatMessenger";
import Spinner from "../../components/UI/Spinner/Spinner";
import avatar from "./../../assets/images/avatar.png";
import ChatBox from "../../components/Chat/ChatBox/ChatBox";
import Chat from "../../components/Chat/Chat";
import GroupChat from "../../components/Chat/GroupChat/GroupChat";
import ChatProfile from "../../components/Chat/ChatProfile/ChatProfile";
import notification from "../../assets/images/NavigationImages/notification.png";
import {
  searchUsers,
  fetchChats,
  setChat,
  sendMessageMethod,
  getUsersRequest,
  createGroupChat,
  getChatsMethod,
  sendMessage,
  clearMessage,
  editChat,
  deleteChat,
} from "../../store";
import MiniChatBox from "../../components/Chat/MiniChatBox/MiniChatBox";
import { messageAppNotification } from "../../Utility/general/general";

const MessageApp = (props) => {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const mainMessage = useSelector((state) => state.messenger.message);
  const token = JSON.parse(sessionStorage.getItem("token"));
  // const notificationArray = useSelector(
  //   (state) => state.navigation.authenticatedLinks[1].notification
  // );
  const [state, setState] = useState({
    addChat: false,
    loading: false,
    chatLoading: false,
    messageLoading: false,
    groupChatLoading: false,
    addSearch: "",
    users: [],
    chats: [],
    chat: null,
    chatBox: false,
    mainUser: null,
    messages: [],
    message: "",
    isTyping: false,
    typing: false,
    userSearch: [],
    // Group Chat
    groupUserSearch: "",
    groupChatName: "",
    addGroupUsers: [],
    createGroupChat: false,
    // Profile
    profile: false,
    editGroupChat: false,
    deleteModal: false,
  });
  const messageEndRef = useRef(null);

  const searchUsersHandler = useCallback(
    (token, state, setState) => dispatch(searchUsers(token, state, setState)),
    [dispatch]
  );
  const fetchChatsHandler = useCallback(
    (token, setState, socket) => dispatch(fetchChats(token, setState, socket)),
    [dispatch]
  );
  const getUsersHandler = useCallback(
    (token, state, setState) =>
      dispatch(getUsersRequest(token, state, setState)),
    [dispatch]
  );
  const createGroupChatHandler = useCallback(
    (token, state, setState) =>
      dispatch(createGroupChat(token, state, setState)),
    [dispatch]
  );
  const setChatHandler = useCallback(
    (setState, token, socket, chat, user) =>
      dispatch(setChat(setState, token, socket, chat, user)),
    [dispatch]
  );
  const editChatHandler = useCallback(
    (token, state, setState) => dispatch(editChat(token, state, setState)),
    [dispatch]
  );
  const sendMessageHandler = useCallback(
    (token, setState, state, socket) =>
      dispatch(sendMessageMethod(token, setState, state, socket)),
    [dispatch]
  );
  const mainMessageHandler = useCallback(
    (message) => dispatch(sendMessage(message)),
    [dispatch]
  );
  const clearMessageHandler = useCallback(
    () => dispatch(clearMessage()),
    [dispatch]
  );
  const deleteChatHandler = useCallback(
    (token, state, setState) => dispatch(deleteChat(token, state, setState)),
    [dispatch]
  );
  const getChatsMethodHandler = useCallback(
    (token, setState) => dispatch(getChatsMethod(token, setState)),
    [dispatch]
  );
  const scrollToBottom = () => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  const { chat, groupUserSearch, messages, isTyping, typing } = state;
  useEffect(() => {
    fetchChatsHandler(token, setState, props.socket);
  }, []);
  const messageLength = messages.length;
  useEffect(() => {
    if (messageLength > 1) {
      scrollToBottom();
    }
  }, [messageLength]);
  useEffect(() => {
    props.socket.on("typing", () => {
      setState((prevState) => {
        return {
          ...prevState,
          isTyping: true,
        };
      });
    });
    props.socket.on("stop typing", () => {
      setState((prevState) => {
        return {
          ...prevState,
          isTyping: false,
        };
      });
    });
    return () => {
      props.socket.off("typing");
      props.socket.off("stop typing");
    };
  }, [props.socket, isTyping, typing]);
  useEffect(() => {
    messageAppNotification(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);
  useEffect(() => {
    props.socket.on("message received", (newMessageReceived) => {
      if (!chat || !chat._id === newMessageReceived.chat._id) {
        setTimeout(() => {
          clearMessageHandler();
        }, 4000);
        if (!newMessageReceived.chat.isGroupChat) {
          mainMessageHandler(
            `New Message from ${newMessageReceived.sender.firstName} ${newMessageReceived.sender.lastName}`
          );
        } else {
          mainMessageHandler(
            `Message from ${newMessageReceived.sender.firstName} ${newMessageReceived.sender.lastName} in ${newMessageReceived.chat.name}`
          );
        }
      } else {
        setState((prevState) => {
          return {
            ...prevState,
            messages: [...prevState.messages, newMessageReceived],
          };
        });
      }
    });
    return () => {
      props.socket.off("message received");
      props.socket.off("requistion_message");
    };
  }, [props.socket]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (groupUserSearch === inputRef?.current?.value) {
        // send getUsers Request //
        getUsersHandler(token, state, setState);
      } else {
        clearTimeout(timer);
      }
    }, 500);
  }, [groupUserSearch, inputRef]);
  return (
    <div className={classes.container}>
      <Message
        error={errorMessage}
        message={message}
      />
      <ChatMessenger message={mainMessage} />
      <GroupChat
        state={state}
        setState={setState}
        inputRef={inputRef}
        createGroupChat={createGroupChatHandler}
        editGroupChat={editChatHandler}
        token={token}
      />
      {state.chat ? (
        <ChatProfile
          state={state}
          setState={setState}
          deleteGroupChat={deleteChatHandler}
          token={token}
        />
      ) : null}

      {!isAuthenticated && !token && (
        <Navigate
          replace={true}
          to='/pharma-app/log-out'
        />
      )}

      <div className={classes.messageApp}>
        {state.addChat ? (
          <div className={classes.users}>
            <div className={classes.addUserSearch}>
              <Button
                config={{
                  className: classes.goBack,
                }}
                changed={() =>
                  setState((prevState) => {
                    return {
                      ...prevState,
                      addChat: false,
                    };
                  })
                }
              >
                ←
              </Button>
              <div className={classes.searchInput}>
                <Input
                  config={{
                    placeholder: "Search user",
                    value: state.addSearch,
                  }}
                  changed={(e) =>
                    setState((prevState) => {
                      return {
                        ...prevState,
                        addSearch: e.target.value,
                      };
                    })
                  }
                />
              </div>
              <Button
                config={{
                  className: classes.confirm,
                }}
                changed={() => searchUsersHandler(token, state, setState)}
              >
                GO
              </Button>
            </div>

            <div className={classes.searchedChats}>
              {state.loading ? (
                <Spinner />
              ) : (
                state.userSearch.map((user) => (
                  <div
                    className={classes.searchedChat}
                    key={user._id}
                    onClick={() =>
                      setChatHandler(setState, token, props.socket, "", user)
                    }
                  >
                    <img src={user.avatar || avatar} />
                    <div>
                      {user.lastName} {user.firstName}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : state.chatBox ? (
          <MiniChatBox
            messages={state.messages}
            messageRef={messageEndRef}
            mainUser={state.mainUser}
            messageLoading={state.messageLoading}
            token={token}
            setState={setState}
            sendMessage={sendMessageHandler}
            goBackToChats={getChatsMethodHandler}
            state={state}
            socket={props.socket}
            mainSocket={props.stateSocket}
          />
        ) : (
          <div className={classes.users}>
            <div className={classes.chatMinCtn}>
              <div className={classes.chatHeading}>Chats</div>
              <Button
                config={{
                  className: classes.confirm,
                }}
                changed={() =>
                  setState((prevState) => {
                    return {
                      ...prevState,
                      createGroupChat: true,
                    };
                  })
                }
              >
                + Create Group Chat
              </Button>
            </div>

            <div className={classes.searchInput}>
              <Input
                config={{
                  placeholder: "Search Chat",
                  autoFocus: true,
                }}
              />
            </div>

            {/* Render  All Chats */}
            <div className={classes.chatContainer}>
              <Button
                config={{
                  className: [classes.confirm, classes.addChatBtn].join(" "),
                }}
                changed={() => {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      addChat: true,
                    };
                  });
                }}
              >
                Add +
              </Button>
              {state.chatLoading ? (
                <Spinner />
              ) : (
                state.chats.map((chat) => (
                  <Chat
                    key={chat._id}
                    chat={chat}
                    mainUser={state.mainUser}
                    setState={setState}
                    token={token}
                    setChat={setChatHandler}
                    state={state}
                    socket={props.socket}
                  />
                ))
              )}
            </div>
          </div>
        )}
        {window.innerWidth > 640 ? (
          <ChatBox
            messages={state.messages}
            messageRef={messageEndRef}
            mainUser={state.mainUser}
            messageLoading={state.messageLoading}
            token={token}
            setState={setState}
            sendMessage={sendMessageHandler}
            state={state}
            socket={props.socket}
            mainSocket={props.stateSocket}
          />
        ) : null}
      </div>
    </div>
  );
};
export default MessageApp;
