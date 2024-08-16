import React from "react";
import classes from "./PatientProfile.module.css";
const patientProfile = React.memo((props) => {
  return (
    <div className={classes.container}>
      <div className={classes.section}>
        <div className={classes.sectionTitle}>General Information</div>
        <div className={classes.generalInformationContainer}>
          <div>
            <div>DATE OF BIRTH</div>
            <div></div>
          </div>
          <div>
            <div>SEX</div>
            <div></div>
          </div>
          <div>
            <div>REFFERED LANGUAGE</div>
            <div></div>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
      <div className={classes.section}>
        <div className={classes.sectionTitle}>CONTACT Information</div>
        <div className={classes.generalInformationContainer}>
          <div>
            <div>PHONE NUMBER</div>
            <div></div>
          </div>
          <div>
            <div>SEX</div>
            <div></div>
          </div>
          <div>
            <div>REFFERED LANGUAGE</div>
            <div></div>
          </div>
          <div></div>
          <div></div>
        </div>
      </div>
    </div>
  );
});
export default patientProfile;
