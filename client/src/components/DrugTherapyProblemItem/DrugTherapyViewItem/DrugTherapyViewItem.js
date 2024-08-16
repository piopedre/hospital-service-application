import classes from "./DrugTherapyViewItem.module.css";
import React from "react";
import Button from "../../UI/Button/Button";
const DrugTherapyViewItem = React.memo((props) => {
  return (
    <div className={classes.container}>
      <div className={classes.heading}>
        <h4>Drug Therapy Problem</h4>
      </div>
      <div className={classes.dtpContainer}>
        <div className={classes.dtpComponent}>
          <div>NAME</div>
          <div>{`${props.dtp?.patient?.lastName} ${props.dtp.patient?.firstName}`}</div>
        </div>
        <div className={classes.dtpComponent}>
          <div>DRUG THERAPY PROBLEM</div>
          <div className={classes.dtp}>{props.dtp.drugTherapyProblem}</div>
        </div>
        <div className={classes.dtpComponent}>
          <div>INTERVENTION</div>
          <div
            style={{
              color: "#02a523",
            }}
          >
            {props.dtp.intervention}
          </div>
        </div>
        <div className={classes.dtpComponent}>
          <div>PHARMACIST</div>
          <div
            style={{
              textTransform: "uppercase",
            }}
          >{`${props.dtp?.pharmacist?.lastName} ${props.dtp?.pharmacist?.firstName}`}</div>
        </div>
      </div>
      <Button
        config={{
          className: classes.hold,
        }}
        changed={() =>
          props.setState((prevState) => {
            return {
              ...prevState,
              view: null,
            };
          })
        }
      >
        CLOSE
      </Button>
    </div>
  );
});

export default DrugTherapyViewItem;
