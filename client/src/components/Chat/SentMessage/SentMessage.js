import React, { Fragment } from "react";
import classes from "./SentMessage.module.css";
const sentMessage = React.memo((props) => {
  const date = Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());
  return (
    <Fragment>
      <div className={props.user ? classes.right : null}>
        <div
          className={[
            props.user ? classes.sender : classes.receiver,
            classes.message,
          ].join(" ")}
          key={props.message._id}
        >
          <div className={classes.messageUser}>
            {!props.user ? `${props.message.sender.lastName}` : null}
          </div>
          <div className={classes.messageContent}>{props.message.content}</div>
          <div
            style={{
              fontSize: "8.5px",
              textAlign: "right",
            }}
          >
            <span className={classes.date}>
              {Intl.DateTimeFormat("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
              }).format(Date.parse(props.message.createdAt))}
            </span>
          </div>
        </div>
      </div>
    </Fragment>
  );
});

export default sentMessage;
