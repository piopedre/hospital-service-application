import classes from "./Message.module.css";
import React from "react";
const message = (props) => (
  <div
    className={classes.MessageContainer}
    style={{
      transform: props.message ? "translateY(0)" : "translateY(-100vh)",
      opacity: props.message ? "1" : "0",
    }}
  >
    <p
      className={classes.Message}
      style={{
        backgroundColor: props.error ? "#c41a1a" : "#51c878",
      }}
    >
      {props.message}
    </p>
  </div>
);

export default React.memo(message);
