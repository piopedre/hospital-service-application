import React, { Fragment } from "react";
import Backdrop from "../../components/UI/Backdrop/Backdrop";
import classes from "./Modal.module.css";
import pharmacy from "../../assets/images/pharmacy.avif";
const modal = (props) => {
  return (
    <Fragment>
      <Backdrop
        show={props.show}
        closed={props.modalClosed}
      />
      <div
        className={classes.Modal}
        style={{
          transform: props.show ? "translateY(-50px)" : "translateY(-100vh)",
          opacity: props.show ? "1" : "0",
          backgroundImage: `linear-gradient(#e8f1fbbf, #eaf3fa84),
    url(${pharmacy})`,
        }}
      >
        {props.children}
      </div>
    </Fragment>
  );
};
export default React.memo(
  modal,
  (prevProps, nextProps) =>
    nextProps.show === prevProps.show &&
    nextProps.children === prevProps.children
);
