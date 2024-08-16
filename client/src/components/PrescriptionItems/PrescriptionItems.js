import React from "react";
import Button from "../UI/Button/Button";
import classes from "./PrescriptionItems.module.css";
const prescriptionItems = React.memo((props) => {
  return props.prescription.length
    ? props.prescription.map((product) => (
        <div
          className={props.classes.prescriptionItem}
          key={product.get("id")}
        >
          <div className={props.classes.productStructure}>
            <div>{product.get("name")}</div>
            <div>
              <input
                className={classes.prescriptionInput}
                type='number'
                value={product.get("quantity")}
                autoFocus={true}
                style={{
                  width: "70px",
                  height: "30px",
                  backgroundColor: "transparent",
                  border: "none",
                  outline: "none",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
                onChange={(e) =>
                  props.updatePrescriptionQuantity(
                    e,
                    product.get("id"),
                    props.setPrescription,
                    props.setTotalPrice,
                    props.setNumberProducts,
                    props.pricing
                  )
                }
              />
            </div>
            <div>{product.get("price")}</div>
            <div>
              {Intl.NumberFormat("en-GB").format(product.get("quantityPrice"))}
            </div>
          </div>
          <div className={props.classes.productInformation}>
            <div>
              <span>ON HAND QTY: </span>
              <span>{product.get("onHandQuantity")}</span>
            </div>
            <div>
              <span>EXPIRY DATE: </span>
              <span>{product.get("expiryDate")}</span>
            </div>
            <Button
              config={{
                className: props.classes.removeBtn,
              }}
              changed={() =>
                props.deleteProductItem(
                  product.get("id"),
                  props.setPrescription,
                  props.setNumberProducts,
                  props.setTotalPrice
                )
              }
            >
              DELETE
            </Button>
          </div>
        </div>
      ))
    : null;
});

export default prescriptionItems;
