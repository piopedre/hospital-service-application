import React from "react";
import classes from "./PatientContainer.module.css";
import avatar from "../../assets/images/avatar.png";
const patientContainer = React.memo(() => {
  return (
    <div className={classes.mainContainer}>
      <div className={[classes.container, classes.flex].join(" ")}>
        <div className={classes.avatar}>
          <img
            className={classes.avatarImage}
            src={avatar}
            loading='lazy'
          />
        </div>
        <div className={classes.details}>
          <div className={[classes.detail, classes.name].join(" ")}>
            LASTNAME FIRSTNAME
          </div>
          <div className={classes.detail}>Medical Number: 59303</div>
          <div className={classes.detail}>Diagnosis: Schizophernia</div>
        </div>
        <div className={classes.dropDownList}>...</div>
      </div>
      <div className={[classes.container, classes.noteContainer].join(" ")}>
        <div className={classes.header}>
          <div className={classes.noteHeader}>Notes</div>
          <div className={classes.list}>...</div>
        </div>
        <div className={classes.noteList}>
          <div className={classes.note}>Patient does poorly on altadone</div>
          <div className={classes.note}>Patient allergic to sulphur drugs</div>
          <div className={classes.note}>Patient does poorly on altadone</div>
          <div className={classes.note}>Patient does poorly on altadone</div>
        </div>
      </div>
    </div>
  );
});
export default patientContainer;
