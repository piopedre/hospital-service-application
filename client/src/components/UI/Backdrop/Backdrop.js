import classes from "./Backdrop.module.css";
import React from "react";
const backdrop = React.memo((props) =>
  props.show ? (
    <div
      onClick={props.closed}
      className={classes.Backdrop}
    ></div>
  ) : null
);

export default backdrop;
