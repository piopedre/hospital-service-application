import React from "react";
import classes from "./NavigationLogo.module.css";
const navigationLogo = React.memo((props) => {
  return (
    <div className={classes.Logo}>
      <img
        src={props.image}
        alt={props.alt}
        loading='lazy'
      />
      {props.notification && props.notification.length ? (
        <p className={classes.notification}>{props.notification.length}</p>
      ) : null}
      <p className={classes.Logo_Description}>{props.description}</p>
    </div>
  );
});

export default navigationLogo;
