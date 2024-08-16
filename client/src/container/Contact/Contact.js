import React, { memo } from "react";
import classes from "./Contact.module.css";
import Button from "../../components/UI/Button/Button";
const Contact = memo(() => {
  return (
    <div className={classes.container}>
      <h3 className={classes.title}>Contact Us</h3>
      <div className={classes.contactContainer}>
        <div className={classes.header}>
          Want regular health updates & information in your inbox?
        </div>
        <div className={classes.emailInformation}>
          <input
            type='email'
            placeholder='ENTER YOUR EMAIL ADDRESS'
          />
          <Button config={{ className: classes.confirm }}>Subscribe Me</Button>
        </div>
        <div className={classes.subTitle}>GET IN TOUCH WITH US</div>
        <div>
          <div className={classes.information}>
            Have a medical question or need to schedule an appointment? Reach
            out to us. Our team is available to assist you promptly.
          </div>
          <div className={classes.contactUs}>
            <a
              href='tel:234-815-837-0392'
              alt='Call +234-815-837-0392'
            >
              Call +234-815-837-0392
            </a>
            <a href='mailto:contactus@fnphbenin.govng'>Email Us</a>
          </div>
        </div>
        <div className={classes.subTitle}>Please write us</div>
        <form className={classes.contactForm}>
          <div className={classes.form}>
            <input
              placeholder='Your Name'
              name='name'
            />
            <input
              placeholder='Your Email Address'
              name='email'
            />
            <input
              placeholder='Your Phone Number'
              name='phoneNumber'
            />
          </div>
          <div className={classes.sendMessage}>
            <input
              type='text'
              placeholder='Enter Your Message'
              name='message'
            />
            <Button config={{ className: classes.confirm }}>
              SEND MESSAGE
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
});

export default Contact;
// TEMPLATE
