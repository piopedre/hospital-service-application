import React, { Fragment } from "react";
import Button from "../../UI/Button/Button";
import SentMessage from "../SentMessage/SentMessage";
import classes from "./MiniChatBox.module.css";
import avatar from "../../../assets/images/avatar.png";
import Typing from "../../UI/Typing/Typing";
import SmallSpinner from "../../UI/SmallSpinner/SmallSpinner";
import Modal from "../../Modal/Modal";
const miniChatBox = React.memo((props) => {
  let dateWatcher = "";
  const dateNotify = props.messages.reduce((acc, message, i) => {
    let date = Intl.DateTimeFormat("en-GB", { day: "numeric" }).format(
      Date.parse(message.createdAt)
    );
    if (date !== dateWatcher) {
      dateWatcher = date;
      const data = {
        date: message.createdAt,
        index: i,
      };
      acc.push(data);
    }
    return acc;
  }, []);
  // active User
  const activeUser = [...props.state.chat.users].find(
    (user) => user._id !== props.mainUser._id
  );

  return (
    <div
      className={classes.chats}
      style={{
        display: props.mainUser ? "block" : "none",
      }}
    >
      <div>
        <div className={classes.convoCtn}>
          {props.mainUser ? (
            <div className={classes.convoHeader}>
              <Button
                config={{
                  className: [classes.backBtn, classes.confirm].join(" "),
                }}
                changed={() => props.goBackToChats(props.token, props.setState)}
              >
                ←
              </Button>
              <div
                // onclick
                // image plus name and change name
                // number of users
                // users info

                onClick={() => {
                  if (props.state.chat.isGroupChat) {
                    props.setState((prevState) => {
                      return {
                        ...prevState,
                        profile: true,
                      };
                    });
                  } else {
                    return;
                  }
                }}
                style={{
                  cursor: "pointer",
                }}
              >
                <img
                  className={classes.profileImage}
                  src={
                    props.state.chat.isGroupChat
                      ? avatar
                      : activeUser?.avatar || avatar
                  }
                  loading='lazy'
                />
                <div
                  style={{
                    fontSize: "11.5px",
                  }}
                >
                  {props.state.chat.isGroupChat
                    ? `${props?.state?.chat?.name}`
                    : `${activeUser?.firstName} ${activeUser?.lastName}`}
                </div>
              </div>
              {/* Dont Delete This */}
              <div></div>
            </div>
          ) : null}
          {props.mainUser ? (
            <div className={classes.messages}>
              {props.messages.map((message, i) => {
                const notification = dateNotify.find(
                  (date) => date.index === i
                );
                if (notification) {
                  return (
                    <Fragment key={message._id}>
                      <div className={classes.dateNotification}>
                        {Intl.DateTimeFormat("en-GB", {
                          dateStyle: "full",
                        }).format(Date.parse(message.createdAt))}
                      </div>
                      <SentMessage
                        user={message.sender._id === props.mainUser._id}
                        message={message}
                      />
                    </Fragment>
                  );
                } else {
                  return (
                    <SentMessage
                      key={message._id}
                      user={message.sender._id === props.mainUser._id}
                      message={message}
                    />
                  );
                }
              })}
              <div ref={props.messageRef} />
              {props.messageLoading && <SmallSpinner />}
              {props.state.isTyping && <Typing />}
            </div>
          ) : null}
        </div>
        <div className={classes.messageCtn}>
          <div className={classes.sendMessage}>
            <input
              className={classes.input}
              placeholder='...Message'
              value={props.state.message}
              autoFocus
              onChange={(e) => {
                props.setState((prevState) => {
                  return {
                    ...prevState,
                    message: e.target.value,
                  };
                });
                if (!props.mainSocket) {
                  return;
                }
                if (!props.state.typing && e.target.value.trim()) {
                  props.setState((prevState) => {
                    return {
                      ...prevState,
                      typing: true,
                    };
                  });
                  props.socket.emit("typing", props.state.chat._id);
                }
                if (!e.target.value.trim()) {
                  props.socket.emit("stop typing", props.state.chat._id);
                  props.setState((prevState) => {
                    return {
                      ...prevState,
                      typing: false,
                    };
                  });
                }
              }}
            />
          </div>
          <Button
            config={{
              className: classes.hold,
              style: {
                margin: "0px",
              },
            }}
            changed={() =>
              props.sendMessage(
                props.token,
                props.setState,
                props.state,
                props.socket
              )
            }
          >
            SEND
          </Button>
        </div>
      </div>
    </div>
  );
});

export default miniChatBox;
