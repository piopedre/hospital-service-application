import React from "react";
import classes from "./HoldComponent.module.css";
const holdComponent = React.memo((props) => {
  return (
    <div>
      <h5 className={classes.title}>HELD {props.component}</h5>
      <div className={classes.prescriptionContainer}>
        {props.item.map(({ supplier, products }, i) => {
          return (
            <div
              className={classes.heldProducts}
              key={i}
              onClick={() =>
                props.retrieve(
                  i,
                  props.token,
                  props.location,
                  props.unit,
                  props.clinic,
                  props.setState
                )
              }
            >
              <div>{supplier.name}</div>
              <div>
                ₦
                {Intl.NumberFormat("en-GB").format(
                  products.reduce((acc, cur) => {
                    acc += cur.qtyPrice;
                    return acc;
                  }, 0)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default holdComponent;
