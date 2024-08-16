import React from "react";
import classes from "./MainPreview.module.css";
import Button from "../UI/Button/Button";
import Modal from "../Modal/Modal";
const mainPreview = React.memo((props) => {
  return (
    <div className={classes.mainPreview}>
      <Button
        config={{
          className: classes.goBack,
        }}
        changed={(e) => {
          e.preventDefault();
          props.setState((prevState) => {
            return {
              ...prevState,
              preview: false,
            };
          });
        }}
      >
        ✕
      </Button>
      <Modal
        show={props.state.submitModal}
        modalClosed={() =>
          props.setState((prevState) => {
            return {
              ...prevState,
              submitModal: false,
            };
          })
        }
      >
        <h5
          style={{
            textTransform: "uppercase",
          }}
          className={classes.modalTitle}
        >
          are you sure, you want to continue
        </h5>
        <Button
          config={{
            className: classes.cancel,
          }}
          changed={(e) => {
            e.preventDefault();
            props.setState((prevState) => {
              return {
                ...prevState,
                submitModal: false,
              };
            });
          }}
        >
          NO
        </Button>
        <Button
          config={{
            className: classes.confirm,
          }}
          changed={() =>
            props.addMethod(
              props.token,
              props.state,
              props.setState,
              props.location,
              props.unit,
              props.clinic
            )
          }
        >
          YES
        </Button>
      </Modal>
      <h4 className={classes.title}>PRODUCT LIST </h4>
      <div
        className={[classes.productStructure, classes.productHeadings].join(
          " "
        )}
      >
        <div>PRODUCT NAME</div>
        <div className={classes.desktopOnly}>ON HAND QTY</div>
        <div>REQUIRED QTY</div>
        <div>EXPIRY DATE</div>
      </div>
      <div className={classes.productList}>
        {props.productList.map((product) => (
          <div
            className={[classes.productStructure, classes.productItem].join(
              " "
            )}
            key={product.get("id")}
          >
            <div>{product.get("name")}</div>
            <div className={classes.desktopOnly}>
              {product.get("onHandQuantity")}
            </div>
            <div>{product.get("quantity")}</div>
            <div>
              {Intl.DateTimeFormat("en-GB", {
                month: "2-digit",
                year: "2-digit",
              }).format(Date.parse(product.get("expiryDate")))}
            </div>
          </div>
        ))}
      </div>
      <div className={classes.interaction}>
        <div>NUMBER OF PRODUCTS</div>
        <div>{props.productList.length}</div>
        <div>TOTAL SUM</div>
        <div>
          ₦
          {Intl.NumberFormat("en-GB").format(
            props.productList.reduce(
              (acc, cur) => (acc += cur.get("totalPrice")),
              0
            )
          )}
        </div>
      </div>
      <Button
        config={{
          className: classes.confirm,
        }}
        changed={() =>
          props.setState((prevState) => {
            return {
              ...prevState,
              submitModal: true,
            };
          })
        }
      >
        SUBMIT
      </Button>
    </div>
  );
});

export default mainPreview;
