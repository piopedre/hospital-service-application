import React from "react";
import Input from "../UI/Input/Input";
import classes from "./RenderContainer.module.css";
const renderContainer = (props) => {
  return (
    <div className={classes.Container}>
      <Input
        config={{
          autoFocus: true,
          type: "search",
          placeholder: "search the name of product",
          value: props.search,
        }}
        changed={(event) => {
          props.filteredProductsHandler(event, props.database);
          props.setSearch(event.target.value);
        }}
      />
      <div className={classes.renderContainer}>
        <div className={classes.productStructure}>
          <div>Product Name</div>
          <div>Quantity</div>
          <div className={classes.desktopOnly}>Category</div>
          <div>
            <div>Expiry</div>
            <div>DATE</div>
          </div>
        </div>
        <div>{props.children}</div>
      </div>
    </div>
  );
};
export default React.memo(renderContainer);
