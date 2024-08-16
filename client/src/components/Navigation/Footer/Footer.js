import React from "react";
import { Link } from "react-router-dom";
import classes from "./Footer.module.css";
import PharmacyLogo from "../../PharmacyLogo/PharmacyLogo";
const footer = React.memo((props) => {
  return (
    <div className={classes.Footer}>
      <div className={classes.Footer_Information}>
        <div>
          <a href='mailto:patredepio@protonmail.com'>Contact Us</a>
        </div>
        <div>
          <Link href='/pharma-app/about'>About Us</Link>
        </div>
        <div>
          <Link href='/pharma-app/privacy-policy'>Privacy Policy</Link>
        </div>
        <div>
          <a href='/pharma-app#services'>Our Services</a>
        </div>
        <div>
          <Link href='/pharma-app/terms-and-conditions'>
            Terms and Conditions
          </Link>
        </div>
      </div>
      <div className={classes.studio}>Powered by Padres Studio</div>
      <div>
        Copyright © {props.year}
        <PharmacyLogo name={props.name} />- All rights reserved
      </div>
    </div>
  );
});

export default footer;
