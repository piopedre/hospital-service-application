import React from "react";
import Modal from "../../Modal/Modal";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import classes from "./GroupChat.module.css";
import avatar from "../../../assets/images/avatar.png";
import Spinner from "../../UI/Spinner/Spinner";
const groupChat = React.memo((props) => (
  <Modal
    show={props.state.createGroupChat}
    modalClosed={() => {
      props.setState((prevState) => {
        return {
          ...prevState,
          editGroupChat: false,
          createGroupChat: false,
          groupChatName: "",
          groupUserSearch: "",
          addGroupUsers: [],
          users: [],
        };
      });
    }}
  >
    <h3>Create Group Chat</h3>
    <Input
      config={{
        placeholder: "NAME OF CHAT",
        value: props.state.groupChatName,
      }}
      changed={(e) =>
        props.setState((prevState) => {
          return {
            ...prevState,
            groupChatName: e.target.value,
          };
        })
      }
    />
    <div>
      <Input
        config={{
          placeholder: "SEARCH USERS NAME",
          value: props.state.groupUserSearch,
          ref: props.inputRef,
        }}
        changed={(e) => {
          props.setState((prevState) => {
            return {
              ...prevState,
              groupUserSearch: e.target.value,
            };
          });
        }}
      />
      <span className={classes.notification}>
        At least 3 users required to create a group chat
      </span>
      <div className={classes.addedUsers}>
        {props.state.addGroupUsers.map((addedUser) => (
          <span
            className={classes.addedUser}
            key={addedUser._id}
            onClick={() =>
              props.setState((prevState) => {
                return {
                  ...prevState,
                  addGroupUsers: [...prevState.addGroupUsers].filter(
                    (user) => user._id !== addedUser._id
                  ),
                };
              })
            }
          >
            ✕ {addedUser.lastName} {addedUser.firstName[0]}.
          </span>
        ))}
      </div>
      <div className={classes.userSearchRender}>
        {props.state.groupChatLoading ? (
          <Spinner />
        ) : (
          props.state.users.map((user) => (
            <div
              className={classes.searchedUser}
              key={user._id}
              onClick={() =>
                props.setState((prevState) => {
                  const invalidEntry = [...prevState.addGroupUsers].find(
                    (u) => u._id === user._id
                  );
                  if (!invalidEntry) {
                    return {
                      ...prevState,
                      addGroupUsers: [...prevState.addGroupUsers, user],
                    };
                  } else {
                    return {
                      ...prevState,
                    };
                  }
                })
              }
            >
              <img
                src={user.avatar || avatar}
                style={{
                  height: "20px",
                  width: "20px",
                }}
              />
              <div>
                {user.firstName} {user.lastName}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
    <Button
      config={{
        className: classes.confirm,
      }}
      changed={() => {
        props.state.editGroupChat
          ? props.editGroupChat(props.token, props.state, props.setState)
          : props.createGroupChat(props.token, props.state, props.setState);
      }}
    >
      {props.state.editGroupChat ? `Edit Chat` : `Create Chat`}
    </Button>
  </Modal>
));

export default groupChat;
