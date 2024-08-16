import React from "react";
import classes from "./Typing.module.css";
const typing = React.memo(() => (
  <div className='typing'>
    <div className={classes.typingDot}></div>
    <div className={classes.typingDot}></div>
    <div className={classes.typingDot}></div>
  </div>
));

export default typing;
