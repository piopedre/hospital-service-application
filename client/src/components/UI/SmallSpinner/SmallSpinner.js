import React from "react";
import classes from "./SmallSpinner.module.css";
const smallSpinner = React.memo(() => <span className={classes.loader}></span>);

export default smallSpinner;
