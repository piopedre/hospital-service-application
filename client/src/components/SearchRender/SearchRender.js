import React from "react";
import classes from "./SearchRender.module.css";
const searchRender = React.memo((props) => {
  const searchedProducts = props.filteredProducts.map((product) => (
    <div
      className={[classes.searchRenderItem, classes.renderStructure].join(" ")}
      key={product._id}
      onClick={() => {
        props.addPrescriptionItem(
          product._id,
          props.setPrescription,
          props.products,
          props.setSearchRender,
          props.setTotalPrice,
          props.setNumberProducts,
          props.pricing,
          props.setSearch
        );
      }}
    >
      <div>{product.name}</div>
      <div>{product.quantity}</div>
      <div>{product.sellingPrice}</div>
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
  return (
    <div className={classes.searchRenderContainer}>
      <div
        className={[classes.searchRenderHeadings, classes.renderStructure].join(
          " "
        )}
      >
        <div>PRODUCT NAME</div>
        <div>ON HAND QTY</div>
        <div>PRICE</div>
        <div className={classes.desktopOnly}>CATEGORY</div>
        <div>EXPIRY DATE</div>
      </div>
      <div className={classes.searchRenderList}>{searchedProducts || null}</div>
    </div>
  );
});

export default searchRender;
