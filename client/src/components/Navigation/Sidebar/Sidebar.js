import NavigationItems from "../NavigationItems/NavigationItems";
import Backdrop from "../../UI/Backdrop/Backdrop";
import classes from "./Sidebar.module.css";
import React, { Fragment } from "react";
const sidebar = React.memo((props) => {
  return (
    <Fragment>
      <Backdrop
        show={props.showBackdrop}
        closed={props.closedNav}
      />
      <div
        className={[
          classes.Sidebar,
          props.showBackdrop ? classes.Open : classes.Close,
        ].join(" ")}
      >
        <nav className={classes.navigationContainer}>
          <NavigationItems closeSideDrawer={props.closedNav} />
        </nav>
      </div>
    </Fragment>
  );
});

export default sidebar;
