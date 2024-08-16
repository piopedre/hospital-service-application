import React from "react";
import classes from "./DrugTherapyProblemItem.module.css";
const drugTherapyProblemItem = React.memo((props) => {
  return (
    <div
      className={classes.container}
      onClick={() =>
        props.setState((prevState) => {
          return {
            ...prevState,
            view: props.dtp,
          };
        })
      }
    >
      <div
        style={{
          borderRight: "1px solid #d3d2d2",
          color: "#f9a260",
        }}
      >
        <div>
          {Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(
            Date.parse(props.dtp.createdAt || new Date())
          )}
        </div>
        <div
          style={{
            fontSize: "x-large",
          }}
        >
          {Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(
            Date.parse(props.dtp.createdAt || new Date())
          )}
        </div>
      </div>

      <div> {props.dtp.drugTherapyProblem}</div>
      <div
        className={classes.desktopOnly}
      >{`${props.dtp.patient?.lastName} ${props.dtp.patient?.firstName}`}</div>
      <div
        style={{ textTransform: "uppercase" }}
      >{`${props.dtp.pharmacist?.lastName} ${props.dtp.pharmacist?.firstName}`}</div>
    </div>
  );
});

export default drugTherapyProblemItem;
