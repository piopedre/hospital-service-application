import React from "react";
import classes from "./TransferItem.module.css";
import Button from "../UI/Button/Button";
const transferItem = React.memo((props) => {
  const unitName = JSON.parse(sessionStorage.getItem("unit")).name;
  return (
    <div className={classes.transferCtn}>
      {unitName !== "STORE" && (
        <div className={classes.addTransfer}>
          <Button
            config={{
              className: classes.confirm,
            }}
            changed={() =>
              props.setState((prevState) => {
                return {
                  ...prevState,
                  transferComponent: true,
                };
              })
            }
          >
            ADD TRANSFER
          </Button>
        </div>
      )}
      {props.transfers.length ? (
        <div className={classes.transferList}>
          {props.transfers.map((transfer) => (
            <div
              className={classes.transferItem}
              key={transfer._id}
              onClick={() =>
                props.selectTransfer(
                  props.setState,
                  transfer._id,
                  props.database
                )
              }
            >
              <div className={classes.transferProps}>
                <div>
                  FROM {transfer.location?.name}, {transfer.clinic?.name}{" "}
                  {transfer.unit?.name}
                </div>
                <div>PRODUCTS: {transfer.products?.length}</div>
              </div>
              <div className={classes.transferProps}>
                <div>{transfer.pharmacist?.lastName}</div>
                <div>
                  DATE:{" "}
                  {Intl.DateTimeFormat("en-GB", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "2-digit",
                  }).format(Date.parse(transfer.createdAt))}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className={classes.emptyTransfer}>
          <div>NO TRANSFER AVAILABLE</div>
        </div>
      )}
    </div>
  );
});

export default transferItem;
