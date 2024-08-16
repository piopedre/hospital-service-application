import React from "react";
import classes from "./Inventory.module.css";
import Button from "../UI/Button/Button";
const inventory = React.memo((props) => {
  return (
    <div className={classes.inventory}>
      <h3>{props.title}</h3>
      <div className={classes.inventoryHeadings}>
        <div>DATE</div>
        <div>MOVEMENT</div>
        <div>QTY</div>
        <div>BALANCE</div>
        <div className={classes.desktopOnly}>SIGNATURE</div>
      </div>
      <div className={classes.inventoryList}>{props.children}</div>

      <Button
        config={{
          className: classes.hold,
          disabled: props.skip === 0,
        }}
        changed={() => props.setSkip(props.skip - 20)}
      >
        PREV
      </Button>
      <Button
        config={{
          className: classes.confirm,
          disabled: props.finished,
        }}
        changed={() => props.setSkip(props.skip + 20)}
      >
        NEXT
      </Button>
    </div>
  );
});
export default inventory;
