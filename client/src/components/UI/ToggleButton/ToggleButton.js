import React from "react";
// Css import
import classes from "./ToggleButton.module.css";
const toggleButton = React.memo((props) => (
  <div className={classes.Toggle}>
    <input
      type='checkbox'
      onChange={props.checked}
      checked={props.sideDrawerState}
    />
    <div>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
));
export default toggleButton;
