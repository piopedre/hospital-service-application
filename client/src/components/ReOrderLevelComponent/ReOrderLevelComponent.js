import React, { Fragment } from "react";
import classes from "./ReOrderLevelComponent.module.css";
import Button from "../UI/Button/Button";
const reOrderLevelComponent = React.memo((props) => {
  return (
    <Fragment>
      <div
        className={classes.componentCtn}
        ref={props.reOrderRef}
      >
        <h3 className={classes.title}>
          {JSON.parse(sessionStorage.getItem("institution"))?.name}
        </h3>
        <h4 className={classes.minTitle}>PRODUCTS ON REORDER LEVEL</h4>
        <div className={[classes.headings, classes.structure].join(" ")}>
          <div>PRODUCT NAME</div>
          <div>QUANTITY</div>
          <div>REORDER LEVEL</div>
          <div className={classes.desktopOnly}>PRICE</div>
          <div className={classes.desktopOnly}>EXPIRY DATE</div>
        </div>
        <div
          style={{
            minHeight: "300px",
          }}
        >
          {props.state.reorderList.length ? (
            props.state.reorderList.map((pr) => (
              <div
                className={[classes.structure, classes.product].join(" ")}
                key={pr._id}
              >
                <div>{pr.name}</div>
                <div>{pr.quantity}</div>
                <div>{pr.minimumQuantity}</div>
                <div className={classes.desktopOnly}>
                  {Intl.NumberFormat("en-GB").format(pr.costPrice)}
                </div>
                <div className={classes.desktopOnly}>
                  {Intl.DateTimeFormat("en-GB", {
                    month: "2-digit",
                    year: "2-digit",
                  }).format(Date.parse(pr.expiryDate))}
                </div>
              </div>
            ))
          ) : (
            <div className={classes.emptyReorderLevel}>
              No Product in ReOrder Level List
            </div>
          )}
        </div>
      </div>
      {props.state.reorderList.length ? (
        <Button
          config={{
            className: classes.hold,
          }}
          changed={() => props.downloadReOrder()}
        >
          DOWNLOAD
        </Button>
      ) : null}
    </Fragment>
  );
});

export default reOrderLevelComponent;
