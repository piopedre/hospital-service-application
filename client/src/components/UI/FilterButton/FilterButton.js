import React from "react";
import classes from "./FilterButton.module.css";
const filterButton = React.memo((props) => {
  return (
    <button
      className={classes.filter}
      onClick={props.changed}
      {...props.config}
    >
      <span className={classes.filterItem}></span>
      <span className={classes.filterItem}></span>
      <span className={classes.filterItem}></span>
    </button>
  );
});

export default filterButton;
