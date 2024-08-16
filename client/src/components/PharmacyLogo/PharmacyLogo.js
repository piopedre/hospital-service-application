import React from "react";
import classes from "./PharmacyLogo.module.css";
import { Link } from "react-router-dom";
const pharmacyLogo = React.memo((props) => (
  <Link
    to='/pharma-app/login'
    className={classes.PharmacyLogo}
  >
    {props.name?.toUpperCase() || "Institution"}
  </Link>
));

export default pharmacyLogo;
