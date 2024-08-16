import React from "react";
import classes from "./ErrorComponent.module.css";
import { Link } from "react-router-dom";
const errorComponent = React.memo(() => {
  return (
    <div className={classes.container}>
      <div className={classes.errorComponent}>
        <div className={classes.errorTitle}>
          <div className={classes.title}>Wrong route </div>
          <div
            style={{ fontSize: "30px" }}
            className={classes.title}
          >
            ⚠️
          </div>
        </div>
        <div className={classes.description}>
          The route you are trying to access doesn't exist. Please kindly go
          back to the main page
        </div>

        <div>
          <Link
            className={classes.link}
            to={"/institution"}
            replace={true}
          >
            GO BACK TO MAIN PAGE
          </Link>
        </div>
      </div>
    </div>
  );
});
export default errorComponent;
