import classes from "./SalesItem.module.css";
import React, { Fragment } from "react";
const salesItem = React.memo((props) => {
  const { exchange, supply, exchangeSumToTal, supplySumTotal } = [
    ...props.sales,
  ].reduce(
    (acc, cur) => {
      if (cur.exchange) {
        const sumTotal = cur.products.reduce(
          (acc, cur) => (acc += cur.qtyPrice),
          0
        );
        acc.exchange += 1;
        acc.exchangeSumToTal += sumTotal;
      } else {
        const sumTotal = cur.products.reduce(
          (acc, cur) => (acc += cur.qtyPrice),
          0
        );
        acc.supply += 1;
        acc.supplySumTotal += sumTotal;
      }
      return acc;
    },
    {
      exchange: 0,
      exchangeSumToTal: 0,
      supply: 0,
      supplySumTotal: 0,
    }
  );

  return (
    <Fragment>
      <div
        className={[classes.salesHeadings, classes.salesStructure].join(" ")}
      >
        <div>DATE</div>
        <div>SUPPLIER</div>
        <div className={classes.desktopOnly}>AMOUNT</div>
        <div>TYPE</div>
      </div>
      <div className={classes.salesItemList}>
        {props.sales.length ? (
          props.sales.map((sale) => (
            <div
              className={classes.salesItem}
              key={sale._id}
              onClick={() =>
                props.checkDetails(sale._id, props.setState, props.state)
              }
            >
              <div className={classes.salesStructure}>
                <div className={classes.date}>
                  <div>
                    {Intl.DateTimeFormat("en-GB", { dateStyle: "full" }).format(
                      Date.parse(sale.createdAt)
                    )}
                  </div>
                  <div>
                    {Intl.DateTimeFormat("en-GB", {
                      hour: "2-digit",
                      minute: "2-digit",
                    }).format(Date.parse(sale.createdAt))}
                  </div>
                </div>
                <div>
                  {sale.supplier?.name
                    ? sale.supplier.name
                    : `DELETED SUPPLIER`}
                </div>
                <div className={classes.desktopOnly}>
                  {Intl.NumberFormat("en-GB").format(
                    sale.products.reduce((acc, cur) => (acc += cur.qtyPrice), 0)
                  )}
                </div>
                <div>
                  {sale.exchange ? (
                    <div className={classes.exchange}>EXCHANGE</div>
                  ) : (
                    <div className={classes.supply}>SUPPLY</div>
                  )}
                </div>
              </div>
              <div
                style={{
                  fontWeight: "bold",
                  marginTop: "10px",
                  textTransform: "uppercase",
                }}
              >
                APPROVED BY :
                {sale.pharmacist?.lastName
                  ? ` ${sale.pharmacist?.lastName} ${sale.pharmacist.firstName}`
                  : sale.assessment?.lastName}
              </div>
            </div>
          ))
        ) : (
          <div className={classes.empty}>NO SUPPLY AVAILABLE</div>
        )}
      </div>
      <div className={classes.interactionBar}>
        <div>EXCHANGES</div>
        <div> {exchange}</div>
        <div>EXCHANGE SUM TOTAL</div>
        <div>
          ₦ {Intl.NumberFormat("en-GB").format(exchangeSumToTal.toFixed(2))}
        </div>
        <div>SUPPLIES</div>
        <div> {supply}</div>
        <div>SUPPLIES SUM TOTAL</div>
        <div>
          ₦ {Intl.NumberFormat("en-GB").format(supplySumTotal.toFixed(2))}
        </div>
      </div>
    </Fragment>
  );
});

export default salesItem;
