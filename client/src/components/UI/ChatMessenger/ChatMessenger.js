import React from "react";
import classes from "./ChatMessenger.module.css";
const chatMessenger = React.memo((props) => {
  return (
    <div
      style={{
        transform: props.message ? "translateY(-10px)" : "translateY(-100vh)",
        opacity: props.message ? "1" : "0",
      }}
      className={classes.chatMessage}
    >
      <p className={classes.messenger}>{props.message}</p>
    </div>
  );
});

export default chatMessenger;
