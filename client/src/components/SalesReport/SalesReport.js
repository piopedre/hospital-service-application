import React, { Fragment } from "react";
import Modal from "../Modal/Modal";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import classes from "./SalesReport.module.css";

import FilterButton from "../UI/FilterButton/FilterButton";
const salesReport = React.memo((props) => {
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const database = [...props.database];
  const productDispensed = database.flatMap((pr) => pr.products).length;
  const { prescriptionNumber, totalPrice, patientNumber } =
    props.getAnalysisData([...props.database]);
  const reports = props.database.map((data, i) => (
    <div
      className={[classes.productSalesStructure, classes.productSaleItem].join(
        " "
      )}
      key={data._id}
      onClick={() =>
        props.setProductDispensed(data._id, database, props.setState)
      }
    >
      <div>{i + 1}</div>
      <div>
        {Intl.DateTimeFormat("en-GB").format(Date.parse(data.createdAt))}
      </div>
      <div>
        {data.patient ? (
          <div>
            <div className={classes.patient}>{data.patient?.firstName}</div>
            <div className={classes.patient}>{data.patient?.lastName}</div>
          </div>
        ) : (
          "UNREGISTERED"
        )}
      </div>
      <div className={classes.desktopOnly}>{data.serviceClinic}</div>
      <div>₦{Intl.NumberFormat("en-GB").format(data.totalPrice)}</div>
    </div>
  ));

  const products = database.map((sale) => sale.products).flat();
  const productAnalysed = Object.values(
    products.reduce((acc, cur) => {
      if (acc[cur.id]) {
        acc[cur.id].quantity = acc[cur.id].quantity += +cur.quantity;
        acc[cur.id].amount = acc[cur.id].amount += +cur.quantityPrice;
      } else {
        acc[cur.id] = {
          name: cur.name,
          quantity: +cur.quantity,
          amount: +cur.quantityPrice,
          id: cur.id,
        };
      }
      return acc;
    }, [])
  );
  return (
    <div className={classes.reportCtn}>
      <Fragment>
        <div className={classes.filter}>
          <FilterButton
            changed={() =>
              props.setState((prevState) => {
                return {
                  ...prevState,
                  salesForm: !prevState.salesForm,
                };
              })
            }
          />
        </div>

        {props.state.salesForm && (
          <form
            className={classes.salesForm}
            onSubmit={(e) => {
              e.preventDefault();
              props.setState((prevState) => {
                return {
                  ...prevState,
                  salesForm: false,
                };
              });
              props.filterSales(e, token, $location, unit, clinic);
            }}
          >
            <h5>FILTER SALES DATA</h5>
            <div className={classes.filterComps}>
              <Input
                inputType='select'
                options={["All", "NORMAL", "NHIA", "NNPC", "FUCC", "COMMUNITY"]}
                title='PRICING'
                config={{
                  name: "pricing",
                  required: true,
                }}
              />
              <Input
                inputType='select'
                options={["All", "OUT-PATIENT", "IN-PATIENT", "REQUISTION"]}
                title='SERVICE TYPE'
                config={{
                  name: "patientType",
                  required: true,
                }}
              />
            </div>

            <Input
              inputType='select'
              options={["All", "GENERAL MEDICAL SERVICES", "PSYCHIATRY"]}
              title='CLINIC TYPE'
              config={{
                name: "serviceClinic",
                required: true,
              }}
            />
            <Input
              config={{
                type: "datetime-local",
                name: "start_date",
                required: true,
              }}
              label='START DATE'
            />
            <Input
              config={{
                type: "datetime-local",
                name: "end_date",
                required: true,
              }}
              label='END DATE'
            />
            <Button
              config={{
                className: classes.cancel,
              }}
              changed={() => {
                props.setState((prevState) => {
                  return {
                    ...prevState,
                    salesForm: false,
                  };
                });
              }}
            >
              CANCEL
            </Button>
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
        {/* <Button
            config={{
              className: classes.hold,
            }}
            changed={() =>
              props.setState((prevState) => {
                return {
                  ...prevState,
                  salesForm: true,
                };
              })
            }
          >
            FILTER SALES DATA
          </Button> */}
      </Fragment>

      {props.state.salesReport ? (
        <Fragment>
          <Modal
            show={props.state.modal}
            modalClosed={() => {
              props.setState((prevState) => {
                return {
                  ...prevState,
                  modal: false,
                  productsDispensed: [],
                };
              });
            }}
          >
            {/* Start styling the page with border box and box shadow and highlight on elements */}
            <h4>Products Dispensed</h4>
            <div
              style={{
                fontWeight: "bold",
              }}
              className={classes.productDispensedStructure}
            >
              <div>S/N</div>
              <div>PRODUCT </div>
              <div>QTY</div>
            </div>
            <div className={classes.productDispensedContainer}>
              {props.state.productsDispensed.map((product, i) => (
                <div
                  className={classes.productDispensedStructure}
                  key={i}
                >
                  <div>{i + 1}</div>
                  <div>{product.name}</div>
                  <div>{product.quantity}</div>
                </div>
              ))}
            </div>
          </Modal>
          <div className={classes.report}>
            <div className={classes.filterReport}>
              <h3>SALES REPORT</h3>
              <Button
                config={{
                  className: classes.confirm,
                }}
                changed={() =>
                  props.setState((prevState) => {
                    return {
                      ...prevState,
                      salesReport: !prevState.salesReport,
                    };
                  })
                }
              >
                SWITCH TO
                {props.state.salesReport ? " PRODUCT BASED" : " SALES BASED"}
              </Button>
            </div>

            <div
              className={[
                classes.productSalesHeadings,
                classes.productSalesStructure,
              ].join(" ")}
            >
              <div>S/N</div>
              <div>DATE</div>
              <div>PATIENT</div>
              <div className={classes.desktopOnly}>CLINIC</div>
              <div>AMOUNT</div>
            </div>

            <div className={classes.salesReport}>{reports}</div>
          </div>
        </Fragment>
      ) : (
        <Fragment>
          <div className={classes.productAnalysisReportContainer}>
            <div className={classes.filterReport}>
              <h3>PRODUCTS REPORT</h3>
              <Button
                config={{
                  className: classes.confirm,
                }}
                changed={() =>
                  props.setState((prevState) => {
                    return {
                      ...prevState,
                      salesReport: !prevState.salesReport,
                    };
                  })
                }
              >
                SWITCH TO
                {props.state.salesReport ? " PRODUCT BASED" : " SALES BASED"}
              </Button>
            </div>
            <div
              className={[
                classes.productBasedSalesHeadings,
                classes.productBasedSalesStructure,
              ].join(" ")}
            >
              <div>S/N</div>
              <div>PRODUCT NAME</div>
              <div>QTY</div>
              <div>AMOUNT</div>
            </div>
            <div className={classes.salesReport}>
              {productAnalysed.map((product, i) => (
                <div
                  className={[
                    classes.productBasedSalesStructure,
                    classes.productBasedSaleItem,
                  ].join(" ")}
                  key={product.id}
                >
                  <div>{i + 1}</div>
                  <div>{product.name}</div>
                  <div>
                    {Intl.NumberFormat("en-GB").format(product.quantity)}
                  </div>
                  <div>
                    ₦{Intl.NumberFormat("en-GB").format(product.amount)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Fragment>
      )}
      {props.state.salesForm ? null : (
        <div className={classes.analysis}>
          <div> Patients Seen</div>
          <div>{patientNumber}</div>
          <div> Number of Prescriptions</div>
          <div>{prescriptionNumber}</div>
          <div>Number of Items dispensed</div>
          <div>{productDispensed}</div>
          <div>cost of Items dispensed</div>
          <div>₦{Intl.NumberFormat("en-GB").format(totalPrice)}</div>
        </div>
      )}
    </div>
  );
});
export default salesReport;
