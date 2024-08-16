import React, { Fragment } from "react";
import classes from "./Report.module.css";
import { getDate } from "../../Utility/general/general";
const report = React.memo((props) => {
  const stockValue = props.products.reduce(
    (acc, cur) => (acc += cur.quantity * cur.unitCostPrice),
    0
  );
  const markUpValue = props.products.reduce(
    (acc, cur) => (acc += cur.markUp),
    0
  );
  const meanMarkUpValue = Math.ceil(markUpValue / props.products.length);
  const storestockValue = props.products.reduce(
    (acc, cur) => (acc += cur.quantity * cur.costPrice),
    0
  );
  // STOCK INFLOW
  // REQUISTIONS
  const requistionValue = props.state.requistions.reduce(
    (acc, cur) => (acc += cur.costOfRequistion),
    0
  );
  // TRANSFER
  const transfersValue = props.state.transfers
    .flatMap((tr) => tr.products)
    .reduce((acc, cur) => (acc += cur.totalPrice), 0);
  // Unit Transfers
  const unitTransfersValue = props.state.transfers
    .flatMap((tr) => tr.products)
    .reduce((acc, cur) => (acc += cur.totalPrice), 0);
  // SUPPLIES
  const suppliesValue = props.state.supplies
    .flatMap((su) => su.products)
    .reduce((acc, cur) => (acc += cur.qtyPrice), 0);

  // EXCHANGES
  const exchangesValue = props.state.exchanges
    .flatMap((su) => su.products)
    .reduce((acc, cur) => (acc += cur.qtyPrice), 0);
  // SALES
  const salesValue = props.sales.reduce(
    (acc, cur) => (acc += cur.totalPrice),
    0
  );
  // FOR EXPIRIES
  const expiriesNumber = [...props.state.expiries].length;
  const expiriesValue = [...props.state.expiries]
    .flatMap((pr) => pr.expiries)
    .filter((product) => {
      if (props.state.startDate && props.state.endDate) {
        const startDate = new Date(props.state.startDate);
        const endDate = new Date(props.state.endDate);
        if (
          startDate.getTime() >= new Date(product.expiryDate).getTime() &&
          endDate.getTime() < new Date(product.expiryDate).getTime()
        ) {
          return product;
        }
      } else if (!props.state.startDate || !props.state.endDate) {
        const now = new Date();
        const sDate = getDate(now.setDate(1));
        const eDate = getDate(now.setMonth(now.getMonth() + 1, 1));
        const startDate = new Date(sDate);
        const endDate = new Date(eDate);
        if (
          new Date(product.expiryDate).getTime() >= startDate.getTime() &&
          new Date(product.expiryDate).getTime() < endDate.getTime()
        ) {
          return product;
        }
      }
    })
    .reduce((acc, cur) => {
      const duplicate = acc.find((pr) => pr.name === cur.name);
      const index = acc.findIndex((pr) => pr.name === cur.name);
      if (duplicate) {
        // const element = structuredClone(duplicate);
        const element = JSON.parse(JSON.stringify(duplicate));
        element.quantity += cur.quantity;
        element.totalPrice += cur.totalPrice;
        acc.splice(index, 1, element);
      } else {
        acc.push(cur);
      }
      return acc;
    }, [])
    .reduce((acc, cur) => (acc += cur.totalPrice), 0);

  const nhiaPatients = props.sales.reduce((acc, cur) => {
    if (cur.pricing === "NHIA") {
      acc += 1;
    }
    return acc;
  }, 0);
  const patients = props.sales.reduce((acc, cur) => {
    if (cur.patient) {
      acc += 1;
    } else if (!cur.patient) {
      acc += 1;
    }
    return acc;
  }, 0);
  return (
    <div
      className={classes.report}
      ref={props.reportRef}
    >
      <h3>{JSON.parse(sessionStorage.getItem("institution"))?.name}</h3>
      <div className={classes.unit}>{`${
        JSON.parse(sessionStorage.getItem("location"))?.name
      } ${JSON.parse(sessionStorage.getItem("clinic"))?.name} ${
        JSON.parse(sessionStorage.getItem("unit"))?.name
      }`}</div>
      <div className={classes.unit}>
        {!props.state.startDate || !props.state.endDate
          ? `${Intl.DateTimeFormat("en-GB", { month: "long" }).format(
              new Date()
            )}  ${Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(
              new Date()
            )} `
          : `${Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(
              new Date(props.state.startDate)
            )}
          ${Intl.DateTimeFormat("en-GB", { month: "long" }).format(
            new Date(props.state.startDate)
          )}  ${Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(
              new Date(props.state.startDate)
            )} to ${Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(
              new Date(props.state.endDate)
            )} ${Intl.DateTimeFormat("en-GB", { month: "long" }).format(
              new Date(props.state.endDate)
            )}  ${Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(
              new Date(props.state.endDate)
            )} `}
      </div>

      <div className={classes.reportStructure}>
        <div className={classes.minTitle}>Product Report</div>
        <div className={classes.reportComp}>
          <div>CLOSING STOCK</div>
          <div>
            {Intl.NumberFormat("en-GB").format(
              props.unit === "STORE" ? storestockValue : stockValue
            )}
          </div>
          <div>STOCK INFLOW</div>
          <div>
            {Intl.NumberFormat("en-GB").format(
              props.unit === "STORE"
                ? suppliesValue + transfersValue
                : transfersValue + requistionValue
            )}
          </div>
          {props.unit === "STORE" && (
            <Fragment>
              <div>STOCK OUTFLOW</div>
              <div>
                {Intl.NumberFormat("en-GB").format(
                  requistionValue + exchangesValue
                )}
              </div>
            </Fragment>
          )}
          {props.unit !== "STORE" && (
            <Fragment>
              <div>STOCK OUTFLOW</div>
              <div>{Intl.NumberFormat("en-GB").format(unitTransfersValue)}</div>
            </Fragment>
          )}
          {props.unit === "STORE" ? null : (
            <Fragment>
              <div>MONTHLY SALES</div>
              <div>{Intl.NumberFormat("en-GB").format(salesValue)}</div>
              <div>GROSS PROFITS</div>
              <div>
                {Intl.NumberFormat("en-GB").format(
                  salesValue / meanMarkUpValue
                )}
              </div>
            </Fragment>
          )}
          <div>NO OF EXPIRED PRODUCTS</div>
          <div>{expiriesNumber}</div>
          <div>VALUE OF EXPIRED PRODUCTS</div>
          <div>{Intl.NumberFormat("en-GB").format(expiriesValue)}</div>
          <div>NO OF OUT OF STOCK PRODUCTS</div>
          <div>{props.state.report.length}</div>
          <div>NO OF SHORTDATED PRODUCTS WITHIN A YEAR</div>
          <div>{props.state.productList.length}</div>
        </div>
      </div>
      {props.unit === "STORE" ? null : (
        <Fragment>
          <div className={classes.reportStructure}>
            <div className={classes.minTitle}>Patient Report</div>
            <div className={classes.reportComp}>
              <div>TOTAL NUMBER OF PATIENT SEEN</div>
              <div>{patients}</div>
              <div>NUMBER OF NHIA PATIENTS</div>
              <div>{nhiaPatients}</div>
            </div>
          </div>

          <div className={classes.reportStructure}>
            <div className={classes.minTitle}>Clinical Report</div>
            <div className={classes.reportComp}>
              <div>NO OF DRUG THERAPY PROBLEMS </div>
              <div>{props.state.reports.length}</div>
              <div>NO OF PHARMACOVIGILANCE REPORTS</div>
              <div>{props.state.forms.length}</div>
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
});

export default report;
