import React from "react";
import Input from "../UI/Input/Input";
import classes from "./RequistionComponent.module.css";
import Button from "../UI/Button/Button";
const requistionComponent = React.memo((props) => {
  const searchedProducts = props.filteredProducts.map((product) => (
    <div
      className={[classes.searchRenderItem, classes.renderStructure].join(" ")}
      key={product._id}
      onClick={() => {
        props.setSearch("");
        props.addRequistionItem(
          product._id,
          props.setRequistion,
          props.products,
          props.setSearchRender,
          props.setTotalPrice,
          props.setNumberProducts
        );
      }}
    >
      <div>{product.name}</div>
      <div>{product.quantity}</div>
      <div>{product.minimumQuantity}</div>
      <div className={classes.desktopOnly}>
        {product.productCategory?.category}
      </div>
      <div>
        {Intl.DateTimeFormat("en-GB", {
          year: "2-digit",
          month: "2-digit",
        }).format(Date.parse(`${product.createdAt}`))}
      </div>
    </div>
  ));
  const requistionList = props.requistion.map((requiste) => (
    <div
      className={[classes.requistionItem, classes.requistionStructure].join(
        " "
      )}
      key={requiste.get("id")}
    >
      <div>{requiste.get("name")}</div>
      <div>{requiste.get("onHandQuantity")}</div>
      <div>
        <input
          type='number'
          style={{
            width: "70px",
            border: "none",
            outline: "none",
            padding: "10px",
            backgroundColor: "#6c9cd4",
            textAlign: "center",
            color: "white",
            fontWeight: "bold",
          }}
          onChange={(e) => {
            props.updateRequistionItem(
              e,
              requiste.get("id"),
              props.setRequistion,
              props.setTotalPrice,
              props.setNumberProducts
            );
          }}
          value={requiste.get("stockRequired")}
        />
      </div>
      <div className={classes.desktopOnly}>{requiste.get("costPrice")}</div>
      <div>
        {Intl.NumberFormat("en-GB").format(requiste.get("quantityPrice"))}
      </div>
      <div
        onClick={() => {
          props.deleteRequistionItem(
            requiste.get("id"),
            props.setRequistion,
            props.setTotalPrice,
            props.setNumberProducts
          );
        }}
        className={classes.deleteBtn}
      >
        <span className={classes.cancelStick}></span>
        <span className={classes.cancelStick}></span>
      </div>
    </div>
  ));
  return (
    <div className={classes.requistion}>
      <Input
        config={{
          type: "search",
          value: props.search,
          placeholder: "SEARCH PRODUCT NAME",
          autoFocus: true,
        }}
        changed={(e) => {
          props.setSearch(e.target.value);
          props.filteredSearch(
            e,
            props.setSearchRender,
            props.setfilteredProducts,
            props.products
          );
        }}
      />
      {props.searchRender ? (
        <div className={classes.searchRenderContainer}>
          <div
            className={[
              classes.searchRenderHeadings,
              classes.renderStructure,
            ].join(" ")}
          >
            <div>PRODUCT NAME</div>
            <div>ON HAND QTY</div>
            <div>MIN QTY</div>
            <div className={classes.desktopOnly}>CATEGORY</div>
            <div>EXPIRY DATE</div>
          </div>
          <div className={classes.searchRenderList}>
            {searchedProducts || null}
          </div>
        </div>
      ) : null}
      <div
        className={[
          classes.requistionHeadings,
          classes.requistionStructure,
        ].join(" ")}
      >
        <div>PRODUCT NAME</div>
        <div>
          <div>ON HAND</div>
          <div>QUANTITY</div>
        </div>
        <div>
          <div>QTY</div>
          <div>PACKSIZE</div>
        </div>
        <div className={classes.desktopOnly}>PRICE</div>
        <div>SUM TOTAL</div>
        <div></div>
      </div>
      <div className={classes.requistionList}>{requistionList || null}</div>
      <div className={classes.interaction}>
        <div className={classes.requistionInformation}>
          <div>Number of Products</div>
          <div>{props.numberOfProducts}</div>
        </div>
        <div className={classes.requistionInformation}>
          <div>TOTAL</div>
          <div>{Intl.NumberFormat("en-GB").format(props.totalPrice)}</div>
        </div>
      </div>

      <Button
        config={{
          className: classes.cancelBtn,
        }}
        changed={() =>
          props.setState((prevState) => {
            return {
              ...prevState,
              requistionComponent: false,
            };
          })
        }
      >
        ← GO BACK
      </Button>
      <Button
        config={{
          className: classes.send,
        }}
        changed={() => props.validateRequistion(props.requistion)}
      >
        PREVIEW
      </Button>
    </div>
  );
});

export default requistionComponent;
