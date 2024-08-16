import React, { Fragment, memo } from "react";
import classes from "./SalesItems.module.css";
const salesItems = memo((props) => {
  return (
    <Fragment>
      <div
        className={[classes.salesStructure, classes.salesHeadings].join(" ")}
      >
        <div>DATE</div>
        <div className={classes.props}>
          <div>PATIENT TYPE</div>
          <div>PRICING TYPE</div>
        </div>
        <div className={[classes.desktopOnly, classes.props].join(" ")}>
          <div>PAYMENT</div>
          <div>STATUS</div>
        </div>
        <div>RECEIPT</div>
      </div>
      <div className={classes.salesItemList}>
        {props.sales.length ? (
          props.sales.map((sale) => (
            <div
              className={[classes.salesStructure, classes.item].join(" ")}
              key={sale._id}
              onClick={() =>
                props.checkDetails(sale._id, props.setState, props.sales)
              }
            >
              <div className={classes.props}>
                <div>
                  {Intl.DateTimeFormat("en-GB", {
                    dateStyle: "full",
                  }).format(Date.parse(sale.createdAt))}
                </div>
                <div>
                  {Intl.DateTimeFormat("en-GB", {
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(Date.parse(sale.createdAt))}
                </div>
              </div>
              <div className={classes.props}>
                <div>{sale.patientType}</div>
                <div>{sale.pricing}</div>
              </div>
              <div className={[classes.desktopOnly, classes.props].join(" ")}>
                {/* Part Remaining money */}
                <div
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  ₦
                  {Intl.NumberFormat("en-GB", {
                    compactDisplay: "long",
                  }).format(sale.totalPrice)}
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                  }}
                >
                  {sale.patientType === "OUT-PATIENT" &&
                  (sale.pricing === "NHIA" ||
                    sale.pricing === "FUCC" ||
                    sale.pricing === "NNPC") ? (
                    <div className={classes.deficit}>
                      ₦
                      {Intl.NumberFormat("en-GB", {
                        compactDisplay: "long",
                      }).format(
                        !sale.receipt
                          ? sale.totalPrice
                          : sale.products.reduce(
                              (acc, cur) =>
                                (acc += cur.hmoPrice * cur.quantity),
                              0
                            )
                      )}
                    </div>
                  ) : (
                    "None"
                  )}
                </div>
              </div>
              <div>
                {sale.receipt ||
                (!sale.receipt && sale.patientType === "REQUISTION") ||
                (sale.patientType === "IN-PATIENT" &&
                  (sale.pricing === "NORMAL" ||
                    sale.pricing === "NHIA" ||
                    sale.pricing === "NNPC" ||
                    sale.pricing === "FUCC")) ? (
                  <div className={classes.paid}>✓ Paid</div>
                ) : (
                  <div className={classes.receipt}> + Add a Receipt</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className={classes.empty}>NO REPORT AVAILABLE</div>
        )}
      </div>
    </Fragment>
  );
});

export default salesItems;
