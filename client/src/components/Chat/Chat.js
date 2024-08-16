import React from "react";
import avatar from "./../../assets/images/avatar.png";
import classes from "./Chat.module.css";
import NotificationIcon from "./NotificationIcon/NotificationIcon";
const chat = React.memo((props) => {
  const user = [...props.chat.users].find(
    (user) => user._id !== props.mainUser._id
  );
  return (
    <div
      className={classes.chatComponent}
      onClick={() =>
        props.setChat(props.setState, props.token, props.socket, props.chat)
      }
    >
      <img
        src={props.avatar || avatar}
        className={classes.avatar}
        loading='lazy'
      />
      <div className={classes.notification}>
        <div className={classes.user}>
          {props.chat.isGroupChat
            ? `${props.chat.name}`
            : `${user?.firstName} ${user?.lastName}`}
        </div>
        <div className={classes.latestMessage}>
          {props.chat?.latestMessage?.content}
        </div>
      </div>
      <div className={classes.notify}>
        <div className={classes.latestMessage}>
          {Intl.DateTimeFormat("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          }).format(
            Date.parse(props.chat?.latestMessage?.createdAt || new Date())
          )}
        </div>
        <div>{/* <NotificationIcon /> */}</div>
      </div>
    </div>
  );
});

export default chat;
