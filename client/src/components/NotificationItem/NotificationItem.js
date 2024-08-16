import React from "react";
import Moment from "react-moment";
import classes from "./NotificationItem.module.css";
import transferPic from "../../assets/images/transfer.png";
import requistionPic from "../../assets/images/requistion.png";
import expiriesPic from "../../assets/images/expiries.png";
import issuancePic from "../../assets/images/issuance.png";

import { Navigate, Link } from "react-router-dom";
import Button from "../UI/Button/Button";
const notificationItem = React.memo((props) => {
  return (
    <div className={classes.notificationItem}>
      <div className={classes.imgElement}>
        <img
          src={
            props.type === "transfer"
              ? transferPic
              : props.type === "issueRequistion"
              ? issuancePic
              : props.type === "expiries" || props.type === "potentialExpiries"
              ? expiriesPic
              : requistionPic
          }
          className={classes.img}
        />
      </div>
      <div className={classes.notificationInformation}>
        <div className={classes.details}>{props.message}</div>
        <div className={classes.timeStamp}>
          <span>
            {" "}
            <Moment fromNow>{props.time}</Moment>
          </span>
          <div className={classes.circle}></div>

          <Link
            className={classes.redirect}
            to={
              props.type === "transfer"
                ? "/pharma-app/transfer-products"
                : props.type === "issueRequistion"
                ? "/pharma-app/requistion"
                : props.type === "expiries"
                ? "/pharma-app/add-expiries"
                : props.type === "potentialExpiries"
                ? null
                : "/pharma-app/issue-products"
            }
          >
            {props.type === "transfer"
              ? " Redirect to Transfers"
              : props.type === "issueRequistion"
              ? " Redirect to Requistion"
              : props.type === "expiries"
              ? "Redirect to Expiries"
              : props.type === "potentialExpiries"
              ? "Please take note"
              : "Redirect to Issue Requistion"}
          </Link>
        </div>
      </div>
      <div className={[classes.markAsRead, classes.desktopOnly].join(" ")}>
        {props.notifications.find((notify) => notify === props.id) ? (
          <Button
            config={{ className: classes.marked }}
            changed={() =>
              props.setState((prevState) => {
                return {
                  ...prevState,

                  notifications: [...prevState.notifications].filter(
                    (notify) => notify !== props.id
                  ),
                };
              })
            }
          >
            unMark
          </Button>
        ) : (
          <Button
            config={{ className: classes.unMarked }}
            changed={() =>
              props.setState((prevState) => {
                return {
                  ...prevState,
                  notifications: [...prevState.notifications, props.id],
                };
              })
            }
          >
            Mark as Read
          </Button>
        )}
      </div>
    </div>
  );
});
export default notificationItem;
