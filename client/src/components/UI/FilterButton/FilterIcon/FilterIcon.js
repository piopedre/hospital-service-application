import React from "react";
import classes from "./FilterIcon.module.css";
const filterIcon = React.memo((props) => {
  return (
    <div
      className={classes.filterIcon}
      onClick={props.changed}
    >
      <div className={classes.removeIcon}>✕</div>
      <div>{props.iconName}</div>
    </div>
  );
});

export default filterIcon;
