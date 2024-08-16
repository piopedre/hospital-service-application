import PharmaLogo from "../../PharmacyLogo/PharmacyLogo";
import NavigationItems from "../NavigationItems/NavigationItems";
import ToggleButton from "../../UI/ToggleButton/ToggleButton";
import classes from "./Navbar.module.css";
import React from "react";
const navbar = React.memo((props) => {
  return (
    <div className={classes.Navigation_Container}>
      <ToggleButton
        checked={props.checked}
        sideDrawerState={props.sideDrawerState}
      />
      <PharmaLogo
        name={JSON.parse(sessionStorage.getItem("institution"))?.username}
      />
      <nav className={classes.Desktop_Only}>
        <NavigationItems />
      </nav>
    </div>
  );
});

export default navbar;
