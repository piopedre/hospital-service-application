import React from "react";
import Button from "../Button/Button";
import classes from "./PreviewComponent.module.css";
import Spinner from "../Spinner/Spinner";
const previewComponent = React.memo((props) => {
  const previewElements = props.requistion.map((requiste) => (
    <div
      className={classes.previewComponent}
      key={requiste.get("id")}
    >
      <div>{requiste.get("name")}</div>
      <div className={classes.desktopOnly}>
        {requiste.get("onHandQuantity")}
      </div>
      <div>
        {requiste.get("stockRequired")} ✕ {requiste.get("packSize")}
      </div>
      <div>
        {Intl.NumberFormat("en-GB").format(requiste.get("quantityPrice"))}
      </div>
    </div>
  ));

  return (
    (props.requistionLoader && <Spinner />) || (
      <div className={classes.mainPreview}>
        <h3 className={classes.title}>
          {JSON.parse(sessionStorage.getItem("institution"))?.name}, {""}
          {props.location?.name}
        </h3>
        <span className={classes.location}>
          {props.clinic?.name}, {props.unit?.name} DEPARTMENT
        </span>
        <div
          className={classes.removeModal}
          onClick={props.removeModal}
        >
          <span className={classes.cancelStick}></span>
          <span className={classes.cancelStick}></span>
        </div>
        <div
          className={[classes.previewComponent, classes.previewHeading].join(
            " "
          )}
        >
          <div>PRODUCT NAME</div>
          <div className={classes.desktopOnly}>ON STOCK</div>
          <div>REQUIRED</div>
          <div>SUM TOTAL</div>
        </div>
        <div className={classes.previewRequistionList}>
          {previewElements || null}
        </div>
        <div className={classes.interactionBar}>
          <div>TOTAL PRICE:</div>
          <div> {Intl.NumberFormat("en-GB").format(props.totalPrice)}</div>
          <div>NUMBER OF PRODUCTS</div>
          <div>{props.numberOfProducts}</div>
        </div>
        <Button
          changed={() => {
            props.setSearch("");
            props.sendRequistion(
              props.requistion,
              props.token,
              props.location?.id,
              props.unit?.id,
              props.numberOfProducts,
              props.totalPrice,
              props.setRequistion,
              props.setNumber,
              props.setPrice,
              props.clinic?.id,
              props.socket,
              props.setState
            );
          }}
          config={{
            className: classes.send,
          }}
        >
          SEND REQUISTION
        </Button>
      </div>
    )
  );
});

export default previewComponent;
