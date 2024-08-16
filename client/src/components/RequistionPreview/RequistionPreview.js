import React from "react";
import classes from "./RequistionPreview.module.css";
const requistionPreview = React.memo((props) => {
  return (
    <div className={classes.requistionPreview}>
      <div className={classes.requistionPreviewHeader}>
        <div
          className={classes.cancel}
          onClick={() =>
            props.setState((prevState) => {
              return {
                ...prevState,
                preview: false,
              };
            })
          }
        >
          <span></span>
          <span></span>
        </div>
        <div
          style={{
            fontWeight: "bold",
          }}
        >
          {props.requistion.location?.name},{props.requistion.clinic?.name}{" "}
          {props.requistion.unit?.name} PHARMACY, SIV {props.requistion.siv}
        </div>
      </div>
      <div
        style={{
          color:
            !props.requistion.reception && props.requistion.issuance
              ? "#ff1f75"
              : "#02a523",
          padding: "10px",
          width: "20%",
          margin: "auto",
          fontWeight: "bold",
        }}
      >
        {props.requistion.reception && props.requistion.issuance
          ? "DONE"
          : "ONGOING"}
      </div>
      <div
        className={[
          classes.requistionPreviewStructure,
          classes.requistionPreviewHeadings,
        ].join(" ")}
      >
        <div>PRODUCT NAME</div>
        <div className={classes.desktopOnly}>COST PRICE</div>
        <div>QTY</div>
        <div>QTYPRICE</div>
      </div>
      <div className={classes.requistionPreviewList}>
        {props.requistion.products.map((product) => (
          <div
            className={[
              classes.requistionPreviewStructure,
              classes.requistionPreviewItem,
            ].join(" ")}
            key={product.id}
          >
            <div>{product.name}</div>
            <div className={classes.desktopOnly}>{product.costPrice}</div>
            <div>
              {product.approvedQty} ✕ {product.packSize}
            </div>
            <div>
              {Intl.NumberFormat("en-GB").format(product.quantityPrice)}
            </div>
          </div>
        ))}
      </div>
      <div className={classes.interactionBar}>
        <div>PRODUCTS</div>
        <div>{props.requistion.products.length}</div>
        <div> TOTAL</div>
        <div>
          ₦
          {Intl.NumberFormat("en-GB").format(
            props.requistion.products
              .reduce((acc, cur) => (acc += cur.quantityPrice), 0)
              .toFixed(2)
          )}
        </div>
      </div>
    </div>
  );
});

export default requistionPreview;
