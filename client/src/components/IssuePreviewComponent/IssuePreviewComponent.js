import React from "react";
import Modal from "../Modal/Modal";
import classes from "./IssuePreviewComponent.module.css";
import Button from "../UI/Button/Button";
const issuePreviewComponent = React.memo((props) => {
  let sumTotal = 0;
  if (props.products.length > 0) {
    sumTotal = [...props.products].reduce((acc, cur) => {
      return (acc += +cur.quantityPrice);
    }, 0);
  }

  return (
    <div className={classes.mainPreview}>
      <Modal
        show={props.show}
        modalClosed={() => {
          props.setState((prevState) => {
            return {
              ...prevState,
              modalPreview: false,
            };
          });
        }}
      >
        <div className={classes.modalPreview}>
          <h5> do you want continue?</h5>
          <div>
            <Button
              config={{
                className: classes.cancel,
              }}
              changed={() =>
                props.setState((prevState) => {
                  return {
                    ...prevState,
                    modalPreview: false,
                  };
                })
              }
            >
              NO
            </Button>
            <Button
              config={{
                className: classes.confirm,
              }}
              changed={() =>
                props.issueRequistion(
                  props.token,
                  props.setState,
                  props.state,
                  props.mainLocation?.id,
                  props.mainUnit?.id,
                  props.clinic?.id,
                  props.socket
                )
              }
            >
              YES
            </Button>
          </div>
        </div>
      </Modal>
      <h4 className={classes.institutionName}>
        {JSON.parse(sessionStorage.getItem("institution")).name},
        {props.location?.name}
      </h4>
      <span className={classes.location}>
        {props.unit?.name} DEPARTMENT, {props.location?.name} REQUISTION, SIV{" "}
        {props.siv}
      </span>
      <div
        className={[classes.previewHeadings, classes.previewStructure].join(
          " "
        )}
      >
        <div>PRODUCT NAME</div>
        <div className={classes.desktopOnly}>QTY REQUIRED</div>
        <div>QTY APPROVED</div>

        <div className={classes.desktopOnly}>PRICE</div>
        <div>QTY PRICE</div>
      </div>
      <div className={classes.previewRequistionList}>
        {props.products.map((product) => (
          <div
            className={classes.previewStructure}
            key={product.id}
          >
            <div>{product.name}</div>
            <div className={classes.desktopOnly}>
              {+product.stockRequired} ✕ {product.packSize}
            </div>
            <div>
              {+product.approvedQty} ✕ {product.packSize}
            </div>

            <div className={classes.desktopOnly}>
              {Intl.NumberFormat("en-GB").format(product.costPrice)}
            </div>
            <div style={{ fontWeight: "bold" }}>
              {Intl.NumberFormat("en-GB").format(product.quantityPrice)}
            </div>
          </div>
        ))}
      </div>

      <div className={classes.interactionBar}>
        <div>NUMBER OF PRODUCTS</div>
        <div>{props.products.length}</div>
        <div> TOTAL</div>
        <div>
          ₦ {Intl.NumberFormat("en-GB").format(sumTotal.toFixed(2) || 0)}
        </div>
      </div>
      <Button
        config={{
          className: classes.cancel,
        }}
        changed={() =>
          props.setState((prevState) => {
            return {
              ...prevState,
              previewComponent: false,
              requistionComponent: true,
            };
          })
        }
      >
        ← GO BACK
      </Button>
      {props.requistionsRoute ? null : (
        <Button
          config={{
            className: classes.hold,
          }}
          changed={() =>
            props.setState((prevState) => {
              return {
                ...prevState,
                modalPreview: true,
              };
            })
          }
        >
          {props.receive ? "RECEIVE " : "ISSUE "}
          REQUISTION
        </Button>
      )}
    </div>
  );
});

export default issuePreviewComponent;
