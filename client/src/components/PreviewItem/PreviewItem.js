import React from "react";
import classes from "./PreviewItem.module.css";
import Button from "../UI/Button/Button";
import Modal from "../Modal/Modal";
import Input from "../UI/Input/Input";
const previewItem = React.memo((props) => {
  const sumTotal = props.products.reduce(
    (acc, cur) => (acc += +cur.qtyPrice),
    0
  );

  return (
    <div className={classes.previewContainer}>
      <Modal
        show={props.deleteModal}
        modalClosed={() =>
          props.setState((prevState) => {
            return {
              ...prevState,
              deleteModal: false,
            };
          })
        }
      >
        <h5 className={classes.deleteInformation}>Do you want to continue?</h5>
        <Button
          config={{
            className: classes.cancel,
          }}
          changed={() => {
            props.setState((prevState) => {
              return {
                ...prevState,
                deleteModal: false,
              };
            });
          }}
        >
          NO
        </Button>
        <Button
          config={{ className: classes.hold }}
          changed={() => {
            props.setState((prevState) => {
              return {
                ...prevState,
                deleteModal: false,
              };
            });
            props.deleteItem(
              props.token,
              props.id,
              props.setState,
              props.mainLocation?.id,
              props.mainUnit?.id,
              props.clinic?.id,
              props.products
            );
          }}
        >
          YES
        </Button>
      </Modal>
      <div className={classes.previewControl}>
        <div
          className={classes.goBack}
          onClick={() =>
            props.setState((prevState) => {
              return {
                ...prevState,
                preview: false,
              };
            })
          }
        >
          ✕
        </div>
        <div className={classes.title}>
          <h4>
            {props.location.name}, {props.unit.name} PHARMACY
          </h4>
          {props.supplies ? (
            <h5>
              {props.supplies ? props.supplier?.name : `DELETED SUPPLIER`}
            </h5>
          ) : null}
        </div>
      </div>
      <div className={classes.salesInformation}>
        <div>
          <div>{props.productSales ? "NAME" : "SUPPLIER NAME"}</div>
          <div>
            {props.productSales
              ? props.sale.patientType === "REQUISTION"
                ? `${props.sale.ward?.name}`
                : props.sale.patient?.firstName
                ? `${props.sale.patient?.lastName} ${props.sale.patient?.firstName} `
                : "UNREGISTERED"
              : props.supplier?.name
              ? `${props.supplier?.name}`
              : `DELETED SUPPLIER`}
          </div>
        </div>
        <div>
          <div>{props.productSales ? "FILE NUMBER" : "TELEPHONE"}</div>
          <div>
            {props.productSales
              ? props.sale.patient?.firstName
                ? props.sale?.patient?.fileNumber
                : "UNREGISTERED"
              : props.supplier?.contact}
          </div>
        </div>
        {props.sale?.collector ? (
          <div>
            <div>COLLECTOR</div>
            <div>{props.sale?.collector}</div>
          </div>
        ) : null}
      </div>
      <div>
        <div className={classes.previewHeadings}>
          <div>PRODUCT NAME</div>
          <div>QTY</div>
          <div className={classes.desktopOnly}>QTY PRICE</div>
          <div>EXPIRY DATE</div>
        </div>
        <div className={classes.list}>
          {props.products.map((product) => (
            <div
              className={classes.previewItem}
              key={product.id}
            >
              <div>{product.name}</div>
              <div>{product.quantity}</div>
              <div className={classes.desktopOnly}>
                {props.productSales
                  ? Intl.NumberFormat("en-GB").format(+product.quantityPrice)
                  : Intl.NumberFormat("en-GB").format(
                      +product?.price || +product.costPrice
                    )}
              </div>
              <div>
                {Intl.DateTimeFormat("en-GB", {
                  month: "2-digit",
                  year: "numeric",
                }).format(Date.parse(product.expiryDate))}
              </div>
            </div>
          ))}
        </div>
        {props.productSales
          ? // inverted
            !(
              props.sale.receipt ||
              (!props.sale.receipt &&
                props.sale.patientType === "REQUISTION") ||
              (props.sale.patientType === "IN-PATIENT" &&
                (props.sale.pricing === "NORMAL" ||
                  props.sale.pricing === "NHIA" ||
                  props.sale.pricing === "NNPC" ||
                  props.sale.pricing === "FUCC"))
            ) && (
              <form
                className={classes.addReceipt}
                onSubmit={(e) =>
                  props.addReceipt(
                    e,
                    props.token,
                    props.setState,
                    props.sale._id,
                    props.mainLocation?.id,
                    props.mainUnit?.id,
                    props.clinic?.id
                  )
                }
              >
                <h4>ADD RECEIPT</h4>
                <Input
                  config={{
                    placeholder: "ENTER LAST SIX DIGITS",
                    required: true,
                    name: "receipt",
                  }}
                  label='RECEIPT NUMBER'
                />
                <Input
                  config={{
                    placeholder: "AMOUNT PAID",
                    required: true,
                    name: "amount",
                    value: props.sale.totalPrice,
                    readOnly: true,
                  }}
                  label='RECEIPT AMOUNT'
                />
                <Button
                  config={{
                    className: classes.hold,
                    type: "submit",
                  }}
                >
                  SUBMIT
                </Button>
              </form>
            )
          : null}
        <div className={classes.interactionBar}>
          <div>NUMBER OF PRODUCTS</div>
          <div> {props.products.length}</div>
          <div>SUM TOTAL</div>
          <div>
            ₦{" "}
            {Intl.NumberFormat("en-GB").format(
              props.productSales
                ? Math.round(props.sale.totalPrice)
                : Math.round(sumTotal)
            )}
          </div>
        </div>
        <Button
          config={{ className: classes.cancel }}
          changed={() =>
            props.setState((prevState) => {
              return {
                ...prevState,
                deleteModal: true,
              };
            })
          }
        >
          {props.productSales ? "DELETE SALE" : "DELETE SUPPLY"}
        </Button>
      </div>
    </div>
  );
});

export default previewItem;
