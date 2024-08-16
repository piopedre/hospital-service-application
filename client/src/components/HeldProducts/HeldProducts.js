import React from "react";
import classes from "./HeldProducts.module.css";
const heldProducts = React.memo((props) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  return (
    <div>
      <h5 className={classes.title}>HELD PRESCRIPTIONS</h5>
      <div className={classes.prescriptionContainer}>
        {props.heldProducts.map((prescription, i) => {
          return (
            <div
              className={classes.heldProducts}
              key={i}
              onClick={() =>
                props.uploadPrescription(
                  i,
                  token,
                  $location,
                  unit,
                  props.setProducts,
                  props.setTotalPrice,
                  props.setNumberProducts,
                  props.setPreview,
                  props.setFormat,
                  props.setExtraCharge
                )
              }
            >
              <div>
                {prescription.receipent?.lastName
                  ? `${prescription.receipent?.lastName} ${prescription.receipent?.firstName}`
                  : prescription.receipent?.name
                  ? prescription.receipent?.name
                  : "UNREGISTERED"}
              </div>
              <div>
                ₦
                {Intl.NumberFormat("en-GB").format(
                  prescription.totalPrice || 0
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default heldProducts;
