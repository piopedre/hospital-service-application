import React, { Fragment } from "react";
import Button from "../UI/Button/Button";
import Input from "../UI/Input/Input";
import classes from "./PrescriptionPreview.module.css";
import Modal from "../Modal/Modal";
import Spinner from "../UI/Spinner/Spinner";
const prescriptionPreview = React.memo((props) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  return props.loader ? (
    <Spinner />
  ) : (
    <div
      className={classes.prescriptionPreview}
      onClick={() =>
        props.setPrescriptionPreview((prevState) => {
          return {
            ...prevState,
            previewSearchRender: false,
          };
        })
      }
    >
      <Modal
        show={props.prescriptionPreview.addPatientModal}
        modalClosed={() => {
          props.setPrescriptionPreview((prevState) => {
            return {
              ...prevState,
              addPatientModal: false,
            };
          });
        }}
      >
        {props.loader ? (
          <Spinner />
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              props.addWard(e, token, props.setPrescriptionPreview);
            }}
          >
            <h4>ADD NEW WARD INFORMATION</h4>
            <Input
              config={{
                placeholder: "WARD NAME",
                required: true,
                name: "name",
                autoFocus: true,
                autoComplete: "on",
              }}
              label='WARD NAME'
            />
            <Button
              config={{
                className: classes.confirm,
                type: "submit",
              }}
            >
              SUBMIT
            </Button>
          </form>
        )}
      </Modal>
      <Modal
        show={props.prescriptionPreview.addDrugDeposit}
        modalClosed={() => {
          props.setPrescriptionPreview((prevState) => {
            return {
              ...prevState,
              addDrugDeposit: false,
            };
          });
        }}
      >
        {props.loader ? (
          <Spinner />
        ) : (
          <form
            onSubmit={(e) => {
              props.addDrugDeposit(
                e,
                props.prescriptionPreview,
                props.setPrescriptionPreview,
                token
              );
            }}
          >
            <h4>ADD DRUG DEPOSIT</h4>
            <Input
              label='RECEIPT NUMBER'
              config={{
                required: true,
                name: "receipt",
                placeholder: "INPUT LAST 6 DIGITS",
                autoFocus: true,
              }}
            />
            <Input
              label='RECEIPT AMOUNT'
              config={{
                required: true,
                name: "amount",
                placeholder: "ENTER AMOUNT",
                type: "number",
              }}
            />
            <Button
              config={{
                className: classes.confirm,
              }}
            >
              SUBMIT
            </Button>
          </form>
        )}
      </Modal>
      <div className={classes.patientContainer}>
        {!props.prescriptionPreview.changedReceipent ? (
          <React.Fragment>
            <Button
              config={{ className: classes.cancel }}
              changed={() => {
                props.setPrescriptionPreview((prevState) => {
                  return {
                    ...prevState,
                    openPreview: false,
                  };
                });
              }}
            >
              ← GO BACK
            </Button>
            {props.format.serviceType === "REQUISTION" ? null : (
              <Button
                config={{
                  className: classes.confirm,
                }}
                changed={() =>
                  props.dtp((prevState) => {
                    return {
                      ...prevState,
                      show: true,
                    };
                  })
                }
              >
                ADD DTP
              </Button>
            )}
            <Button
              config={{
                className: classes.confirm,
              }}
              changed={() => {
                props.setPrescriptionPreview((prevState) => {
                  return {
                    ...prevState,
                    changedReceipent: true,
                  };
                });
              }}
            >
              CHANGE RECEIPENT
            </Button>
          </React.Fragment>
        ) : null}
        {props.prescriptionPreview.changedReceipent ? (
          <div>
            <div className={classes.previewSearch}>
              {props.format.serviceType === "REQUISTION" ? (
                <Input
                  config={{
                    type: "search",
                    placeholder: "SEARCH NAME OF WARD",
                    autoFocus: true,
                  }}
                  changed={(e) =>
                    // check if it is requistion or patient
                    props.receipentSearch(
                      e,
                      props.setPrescriptionPreview,

                      props.wardDatabase
                    )
                  }
                />
              ) : (
                <Input
                  config={{
                    ref: props.patientRef,
                    value: props.prescriptionPreview.patientSearch,
                    type: "search",
                    placeholder:
                      "SEARCH FIRST NAME OR LAST NAME OR FILE NUMBER",
                    autoFocus: true,
                  }}
                  changed={(e) =>
                    props.setPrescriptionPreview((prevState) => {
                      return {
                        ...prevState,
                        patientSearch: e.target.value,
                      };
                    })
                  }
                />
              )}

              <Button
                config={{ className: classes.cancel }}
                changed={() => {
                  props.setPrescriptionPreview((prevState) => {
                    return {
                      ...prevState,
                      changedReceipent: false,
                    };
                  });
                }}
              >
                CANCEL
              </Button>
              {props.format.serviceType === "REQUISTION" ? (
                <Button
                  config={{ className: classes.hold }}
                  changed={() => {
                    props.setPrescriptionPreview((prevState) => {
                      return {
                        ...prevState,
                        addPatientModal: true,
                      };
                    });
                  }}
                >
                  ADD RECEIPENT
                </Button>
              ) : null}
            </div>

            {props.prescriptionPreview.previewSearchRender ? (
              <div className={classes.prescriptionSearchRender}>
                <div
                  className={[
                    classes.searchRenderStructure,
                    classes.heading,
                  ].join(" ")}
                >
                  <div>
                    {props.format.serviceType === "REQUISTION"
                      ? "WARD NAME"
                      : " PATIENT NAME"}
                  </div>
                  <div>
                    {props.format.serviceType === "REQUISTION"
                      ? "WARD LOCATION"
                      : " FILE NUMBER"}
                  </div>
                </div>
                <div className={classes.searchRenderList}>
                  {props.prescriptionPreview.filteredItems.map((item) => {
                    if (props.format.serviceType === "REQUISTION") {
                      return (
                        <div
                          className={[
                            classes.searchRenderStructure,
                            classes.searchRenderItem,
                          ].join(" ")}
                          key={item._id}
                          onClick={() =>
                            props.setReceipent(
                              item._id,
                              props.setPrescriptionPreview,
                              props.wardDatabase
                            )
                          }
                        >
                          <div>{item.name}</div>
                          <div>{item.location?.name}</div>
                        </div>
                      );
                    } else {
                      return (
                        <div
                          className={[
                            classes.searchRenderStructure,
                            classes.searchRenderItem,
                          ].join(" ")}
                          key={item._id}
                          onClick={() =>
                            props.setReceipent(
                              item._id,
                              props.setPrescriptionPreview,
                              props.prescriptionPreview.filteredItems
                            )
                          }
                        >
                          <div>
                            {item.lastName} {item.firstName}
                          </div>
                          <div>{item.fileNumber}</div>
                        </div>
                      );
                    }
                  })}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <div className={classes.detailsContainer}>
            <h4>Receipent Information</h4>
            <div className={classes.details}>
              <div>NAME</div>
              <div>
                {props.prescriptionPreview.selectedReceipent
                  ? props.prescriptionPreview.receipent.name ||
                    `${props.prescriptionPreview.receipent.lastName} ${props.prescriptionPreview.receipent.firstName}`
                  : "UNREGISTERED"}
              </div>
            </div>
            <div className={classes.details}>
              <div>
                {props.format.serviceType === "REQUISTION"
                  ? "LOCATION"
                  : "FILE NUMBER"}
              </div>
              <div>
                {props.prescriptionPreview.selectedReceipent
                  ? props.prescriptionPreview.receipent.location?.name ||
                    props.prescriptionPreview.receipent.fileNumber
                  : "UNREGISTERED"}
              </div>
            </div>
            {props.format.serviceType === "IN-PATIENT" ? (
              <div className={classes.details}>
                <div>BALANCE</div>
                <div
                  style={{
                    letterSpacing: "3px",
                    color:
                      props.prescriptionPreview.receipent?.balance <= 0
                        ? "#ff1f1f"
                        : "#02a523",
                  }}
                >
                  {props.prescriptionPreview.receipent?.balance.toFixed(2) || 0}
                </div>
              </div>
            ) : null}
            {props.prescriptionPreview.selectedReceipent ? (
              <div>
                <Button
                  config={{ className: classes.cancel }}
                  changed={() =>
                    props.removeReceipent(props.setPrescriptionPreview)
                  }
                >
                  REMOVE RECEIPENT
                </Button>
                {props.format.serviceType === "IN-PATIENT" ? (
                  <Button
                    config={{ className: classes.confirm }}
                    changed={() => {
                      props.setPrescriptionPreview((prevState) => {
                        return {
                          ...prevState,
                          addDrugDeposit: true,
                        };
                      });
                    }}
                  >
                    ADD DEPOSIT
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        )}
      </div>
      <div className={classes.productContainer}>
        <h4>
          {JSON.parse(sessionStorage.getItem("institution"))?.name} ,{" "}
          {JSON.parse(sessionStorage.getItem("location"))?.name}
        </h4>
        <h5>
          {JSON.parse(sessionStorage.getItem("clinic"))?.name}{" "}
          {JSON.parse(sessionStorage.getItem("unit"))?.name} PHARMACY
        </h5>
        <div
          className={[classes.productHeadings, classes.productStructure].join(
            " "
          )}
        >
          <div>PRODUCT NAME</div>
          <div>QTY</div>
          <div>SUM TOTAL</div>
        </div>
        {props.prescription.map((product) => (
          <div
            className={[classes.productStructure, classes.productItem].join(
              " "
            )}
            key={product.get("id")}
          >
            <div>{product.get("name")}</div>
            <div>{product.get("quantity")}</div>
            <div>
              {Intl.NumberFormat("en-GB").format(product.get("quantityPrice"))}
            </div>
          </div>
        ))}
        <div className={classes.productTotal}>
          <div style={{ marginRight: "10px" }}>TOTAL : </div>
          <div>
            ₦
            {Intl.NumberFormat("en-GB").format(
              Math.ceil((props.totalPrice + props.extraCharge) / 50) * 50
            )}
          </div>
        </div>
      </div>

      {props.format.serviceType === "OUT-PATIENT" &&
      props.format.pricingType !== "FUCC" &&
      props.format.serviceType === "OUT-PATIENT" &&
      props.format.pricingType !== "NNPC" ? (
        <form
          className={classes.receiptContainer}
          onSubmit={(e) => {
            props.productSaleHandler(
              e,
              props.format,
              props.prescription,
              $location,
              unit,
              token,
              props.prescriptionPreview,
              props.setPrescription,
              props.setPrescriptionPreview,
              props.setTotalPrice,
              props.setNumberProducts,
              props.setExtraCharge,
              props.clinic,
              props.extraCharge,
              props.totalPrice
            );
          }}
        >
          <Input
            label='RECEIPT NUMBER'
            config={{
              required: true,
              name: "receipt",
              placeholder: "INPUT LAST 6 DIGITS",
              autoFocus: true,
            }}
          />

          <Input
            label='RECEIPT AMOUNT'
            config={{
              required: true,
              name: "amount",
              placeholder: "ENTER AMOUNT",
              readOnly: true,
              value:
                Math.ceil((props.totalPrice + props.extraCharge) / 50) * 50,
            }}
          />

          <Button config={{ className: classes.confirm }}>SUBMIT</Button>
        </form>
      ) : props.format.serviceType === "IN-PATIENT" ? (
        <Fragment>
          <div className={classes.collector}>
            <Input
              label='COLLECTOR'
              config={{
                required: true,
                name: "collector",
                placeholder: "ENTER NAME OF COLLECTOR",
                autoFocus: true,
              }}
              changed={(e) =>
                props.setPrescriptionPreview((prevState) => {
                  return {
                    ...prevState,
                    collector: e.target.value,
                  };
                })
              }
            />
          </div>

          <Button
            config={{ className: classes.confirm }}
            changed={() => {
              props.inPatientProductSale(
                props.format,
                props.prescription,
                $location,
                unit,
                token,
                props.prescriptionPreview,
                props.totalPrice,
                props.setPrescription,
                props.setPrescriptionPreview,
                props.setTotalPrice,
                props.setNumberProducts,
                props.setExtraCharge,
                props.clinic
              );
            }}
          >
            SUBMIT
          </Button>
        </Fragment>
      ) : (props.format.pricingType === "FUCC" &&
          props.format.serviceType !== "REQUISTION") ||
        (props.format.pricingType === "NNPC" &&
          props.format.serviceType !== "REQUISTION") ? (
        <form
          onSubmit={(e) => {
            props.fuccProductSale(
              e,
              props.format,
              props.prescription,
              $location,
              unit,
              token,
              props.prescriptionPreview,
              props.setPrescription,
              props.setPrescriptionPreview,
              props.setTotalPrice,
              props.setNumberProducts,
              props.setExtraCharge,
              props.totalPrice,
              props.clinic
            );
          }}
          className={classes.submitPrescription}
        >
          <Input
            label='COLLECTOR'
            config={{
              required: true,
              name: "collector",
              placeholder: "ENTER NAME OF COLLECTOR",
              value: props.prescriptionPreview.collector,
              autoFocus: true,
            }}
            changed={(e) =>
              props.setPrescriptionPreview((prevState) => {
                return {
                  ...prevState,
                  collector: e.target.value,
                };
              })
            }
          />

          <Button config={{ className: classes.confirm }}>SUBMIT</Button>
        </form>
      ) : (
        <form
          onSubmit={(e) => {
            props.requistionProductSale(
              e,
              props.format,
              props.prescription,
              $location,
              unit,
              token,
              props.prescriptionPreview,
              props.setPrescription,
              props.setPrescriptionPreview,
              props.setTotalPrice,
              props.setNumberProducts,
              props.setExtraCharge,
              props.totalPrice,
              props.clinic
            );
          }}
          className={classes.submitPrescription}
        >
          <Input
            label='COLLECTOR'
            config={{
              required: true,
              name: "collector",
              placeholder: "ENTER NAME OF COLLECTOR",
              autoFocus: true,
            }}
            changed={(e) =>
              props.setPrescriptionPreview((prevState) => {
                return {
                  ...prevState,
                  collector: e.target.value,
                };
              })
            }
          />

          <Button config={{ className: classes.confirm }}>SUBMIT</Button>
        </form>
      )}
    </div>
  );
});

export default prescriptionPreview;
