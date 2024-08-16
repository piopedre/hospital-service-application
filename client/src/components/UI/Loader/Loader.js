import classes from "./Loader.module.css";
import React from "react";
const loader = () => {
  return (
    <div className={classes.Loader_Container}>
      <span className={classes.Loader}></span>
      <span className={classes.Loader}></span>
      <span className={classes.Loader}></span>
    </div>
  );
};

export default React.memo(loader);
