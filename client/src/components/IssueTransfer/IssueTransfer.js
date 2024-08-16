import React from "react";
import Button from "../UI/Button/Button";
import classes from "./IssueTransfer.module.css";
import Modal from "../Modal/Modal";
import Input from "../UI/Input/Input";
const issueTransfer = React.memo((props) => {
  const sumTotal = props.state.selectedTransfer.products.reduce(
    (acc, cur) => (acc += cur.totalPrice),
    0
  );
  const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
  return (
    <div className={classes.issueTransfer}>
      <Modal
        show={props.state.changedModal}
        modalClosed={() =>
          props.setState((prevState) => {
            return {
              ...prevState,
              changedModal: false,
            };
          })
        }
      >
        <h6>SEARCH LOCATION PRODUCT</h6>
        <Input
          config={{
            type: "search",
            autoFocus: true,
            placeholder: "SEARCH PRODUCT NAME",
          }}
          changed={(e) => props.filteredProducts(e, props.database)}
        />

        <div className={classes.searchedList}>
          {props.searchedProducts.map((product) => (
            <div
              className={classes.searchedProduct}
              key={product._id}
              onClick={() =>
                props.setLocationProduct(
                  props.setState,
                  props.database,
                  product._id
                )
              }
            >
              {product.name}
            </div>
          ))}
        </div>
      </Modal>
      <h4 className={classes.title}>
        {" "}
        TRANSFER FROM {props.state.selectedTransfer.location?.name},{" "}
        {props.state.selectedTransfer.clinic?.name} {"  "}
        {props.state.selectedTransfer.unit?.name}
      </h4>

      <div
        className={[classes.productStructure, classes.productHeadings].join(
          " "
        )}
      >
        <div>PRODUCT NAME</div>
        <div>QUANTITY</div>
        <div>EXPIRY DATE</div>
      </div>
      <div className={classes.productList}>
        {props.state.selectedTransfer.products.map((product) => (
          <div
            className={classes.mainProduct}
            key={product.id}
          >
            <div
              className={[classes.productItem, classes.productStructure].join(
                " "
              )}
            >
              <div>{product.name}</div>
              <div>
                {unitName === "STORE"
                  ? `${product.quantity / product.packSize} ✕ ${
                      product.packSize
                    }`
                  : `${product.quantity}`}
              </div>
              <div>
                {Intl.DateTimeFormat("en-GB", {
                  month: "2-digit",
                  year: "2-digit",
                }).format(Date.parse(product.expiryDate))}
              </div>
            </div>
            <div
              style={{
                fontWeight: "bolder",
                fontSize: "10.5px",
              }}
            >
              LOCATION PRODUCT
            </div>
            <div
              className={[
                classes.productItem,
                classes.productStructure,
                classes.locationProduct,
              ].join(" ")}
              onClick={() =>
                props.setState((prevState) => {
                  return {
                    ...prevState,
                    changedModal: true,
                    selectedProduct: product.id,
                  };
                })
              }
            >
              <div>{product.locationProduct?.name}</div>
              <div>{product.locationProduct?.quantity}</div>
              <div>
                {Intl.DateTimeFormat("en-GB", {
                  month: "2-digit",
                  year: "2-digit",
                }).format(
                  Date.parse(product?.locationProduct?.expiryDate) || new Date()
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={classes.interactionBar}>
        <div>NUMBER OF PRODUCTS</div>
        <div>{props.state.selectedTransfer.products?.length}</div>
        <div> TOTAL</div>
        <div>
          ₦ {Intl.NumberFormat("en-GB").format(sumTotal.toFixed(2) || 0)}
        </div>
      </div>
      <Button
        config={{
          className: classes.hold,
        }}
        changed={() =>
          props.validateReceiveTransfer(props.state, props.setState)
        }
      >
        PREVIEW
      </Button>
    </div>
  );
});

export default issueTransfer;
