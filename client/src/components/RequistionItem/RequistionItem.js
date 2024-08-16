import React, { Fragment } from "react";
import classes from "./RequistionItem.module.css";
import Button from "../UI/Button/Button";

const requistionItem = React.memo((props) => {
  const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
  const $locationName = JSON.parse(sessionStorage.getItem("location"))?.name;
  const clinicName = JSON.parse(sessionStorage.getItem("clinic"))?.name;
  return (
    <div className={classes.mainContainer}>
      <h4 className={classes.title}>REQUISTION LIST</h4>
      <div className={classes.addRequistionBtn}>
        {props.requistions ||
        (unitName === "STORE" &&
          $locationName === "USELU" &&
          clinicName === "PSYCHIATRY") ? null : (
          <div className={classes.addRequistion}>
            <Button
              config={{
                className: classes.confirm,
              }}
              changed={() =>
                props.setState((prevState) => {
                  return {
                    ...prevState,
                    requistionComponent: true,
                  };
                })
              }
            >
              ADD REQUISTION
            </Button>
          </div>
        )}
      </div>

      <div className={classes.requistionList}>
        {props.state.requistions.length ? (
          props.state.requistions.map((requistion) => (
            <div
              className={[
                classes.requistion,
                requistion.reception && requistion.issuance
                  ? null
                  : classes.onGoing,
              ].join(" ")}
              key={requistion._id}
              onClick={() =>
                props.setState((prevState) => {
                  return {
                    ...prevState,
                    selectedRequistion: requistion,
                    previewComponent: true,
                  };
                })
              }
            >
              <div className={classes.requistionLocation}>
                <div>{requistion.location?.name}</div>
                <div>{requistion.unit?.name} PHARMACY</div>
              </div>
              {requistion.issuance && requistion.reception ? null : (
                <div className={classes.label}>PENDING</div>
              )}

              <div className={classes.requistionInformation}>
                <div> PRODUCTS : {requistion.numberOfProducts}</div>
                <div>SIV : {requistion.siv}</div>
                <div>
                  {Intl.DateTimeFormat("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(Date.parse(requistion.createdAt))}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className={classes.emptyRequistion}>
            There is no current requistion
          </div>
        )}
      </div>
    </div>
  );
});
export default requistionItem;
