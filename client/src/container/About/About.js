import React, { memo } from "react";

import classes from "./About.module.css";

const About = memo((props) => {
  return (
    <div className={classes.container}>
      <h3 className={classes.title}>ABOUT US</h3>
      <div className={classes.aboutContainer}>
        <div className={classes.headerCtn}>Mission Statement</div>
        <div className={classes.bodyCtn}>
          To provide friendly, specialized, qualitative psychiatry and
          rehabilitative care for the mentally ill in their social environment
          which is centrally located and delivered by qualified professionals
          using the most modern equipment.
        </div>
      </div>
      <div className={[classes.aboutContainer, classes.right].join(" ")}>
        <div className={classes.headerCtn}>Vision Statement</div>
        <div className={classes.bodyCtn}>
          to develop sub-specialities in geriatric, forensic, community,
          addiction in drugs and alcohol, child and adolescence psychiatry while
          continuing to provide excellent services in psychotherapy, using
          modern equipment and medical technology.
        </div>
      </div>
      <div className={classes.aboutContainer}>
        <div className={classes.headerCtn}>Value Statement</div>
        <div className={classes.bodyCtn}>
          offering excellent services based on Clients' satisfaction inside and
          outside the Hospital.
        </div>
      </div>
    </div>
  );
});

export default About;
// TEMPLATE
