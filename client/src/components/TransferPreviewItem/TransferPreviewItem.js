import React from "react";
import Button from "../UI/Button/Button";
import classes from "./TransferPreviewItem.module.css";
import Modal from "../Modal/Modal";
import Input from "../UI/Input/Input";
const transferPreviewItem = React.memo((props) => {
  const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
  return (
    <div className={classes.previewContainer}>
      <form
        className={classes.header}
        onSubmit={(e) => {
          e.preventDefault();
          !props.receive
            ? props.submitTransfer(
                e,
                props.state,
                props.setState,
                props.token,
                props.location,
                props.unit,
                props.clinic,
                props.setRequistionState,
                props.socket
              )
            : props.receiveProducts(
                props.token,
                props.setState,
                props.state,
                props.location,
                props.unit,
                props.clinic
              );
        }}
      >
        <Modal
          show={props.state.transferModal}
          modalClosed={() =>
            props.setState((prevState) => {
              return {
                ...prevState,
                transferModal: false,
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
                  transferModal: false,
                };
              });
            }}
          >
            NO
          </Button>
          <Button
            config={{
              className: classes.confirm,
              type: "submit",
            }}
          >
            YES
          </Button>
        </Modal>
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
        {props.receive ? null : (
          <div>
            <h5>SET UNIT AND LOCATION</h5>

            <div className={classes.locationUnit}>
              <Input
                inputType='select'
                options={[...props.state.locations].map((loc) => loc.name)}
                title='LOCATION'
                config={{
                  name: "location",
                }}
              />

              <Input
                inputType='select'
                options={[...props.state.clinics].map((clinic) => clinic.name)}
                title='CLINIC'
                config={{
                  name: "clinic",
                }}
              />
              <Input
                inputType='select'
                options={[...props.state.units].map((unit) => unit.name)}
                title='UNIT'
                config={{
                  name: "unit",
                }}
              />
            </div>
          </div>
        )}

        <div>
          <div
            className={[classes.productStructure, classes.productHeadings].join(
              " "
            )}
          >
            <div>PRODUCT NAME</div>
            <div>ON HAND QTY</div>
            <div> REQUIRED QTY</div>
            <div className={classes.desktopOnly}>EXPIRY DATE</div>
          </div>
          <div className={classes.productList}>
            {props.productList.map((product) => (
              <div
                className={[
                  [classes.productStructure, classes.productItem].join(" "),
                ]}
                key={!props.receive ? product.get("id") : product.id}
              >
                <div>
                  {!props.receive
                    ? product.get("name")
                    : product.locationProduct?.name}
                </div>
                <div>
                  {!props.receive
                    ? product.get("onHandQuantity")
                    : product.locationProduct?.quantity}
                </div>
                <div>
                  {!props.receive
                    ? product.get("quantity")
                    : unitName === "STORE"
                    ? `${product.quantity / product.packSize} ✕ ${
                        product.packSize
                      }`
                    : product.quantity}
                </div>
                <div className={classes.desktopOnly}>
                  {Intl.DateTimeFormat("en-GB").format(
                    Date.parse(
                      !props.receive
                        ? product.get("expiryDate")
                        : product.expiryDate
                    )
                  )}
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
                !props.receive
                  ? props.productList.reduce(
                      (acc, cur) => (acc += cur.get("totalPrice")),
                      0
                    )
                  : props.productList.reduce(
                      (acc, cur) => (acc += cur.totalPrice),
                      0
                    )
              )}
            </div>
          </div>
          <Button
            config={{
              className: classes.confirm,
            }}
            changed={(e) => {
              e.preventDefault();
              props.setState((prevState) => {
                return {
                  ...prevState,
                  transferModal: true,
                };
              });
            }}
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
});

export default transferPreviewItem;
