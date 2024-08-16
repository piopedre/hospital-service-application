import React from "react";
import classes from "./PharmacySite.module.css";
const pharmacySite = React.memo((props) => (
  <div className={classes.Pharmacy_Site}>
    <div>SITE : {props.site}</div>
    {props.clinic ? (
      <div className={classes.desktopOnly}>CLINIC : {props.clinic}</div>
    ) : null}
    {props.unit ? <div>UNIT : {props.unit}</div> : null}
    <div>USER : {props.username} </div>
  </div>
));

export default pharmacySite;
