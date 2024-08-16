import React, { Fragment } from "react";
import classes from "./ProductListContainer.module.css";
import FilterButton from "../UI/FilterButton/FilterButton";
import Spinner from "../UI/Spinner/Spinner";

const productListContainer = React.memo((props) => {
  return (
    <div>
      {/* TITLE */}
      <div className={[classes.headings, classes.structure].join(" ")}>
        <div>PRODUCT NAME</div>
        <div>QUANTITY</div>
        <div className={classes.desktopOnly}>
          <div>QUANTITY</div>
          <div>PRICE</div>
        </div>
        <div className={classes.desktopOnly}>CATEGORY</div>
        <div>EXPIRY DATE</div>
      </div>
      {props.state.loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className={classes.searchTitle}>
            <div>{props.state.duration}</div>
            <div className={classes.filterButton}>
              <FilterButton
                changed={() =>
                  props.setState((prevState) => {
                    return {
                      ...prevState,
                      form: !prevState.form,
                    };
                  })
                }
              />
            </div>
          </div>
          <div className={classes.productList}>
            {props.state.productList.length ? (
              props.state.productList.map((pr) => (
                <div
                  key={pr._id}
                  className={[classes.structure, classes.productItem].join(" ")}
                >
                  <div>{pr.name}</div>
                  <div>{pr.quantity}</div>
                  <div className={classes.desktopOnly}>
                    {props.unit === "STORE"
                      ? Intl.NumberFormat("en-GB").format(
                          pr.quantity * pr.costPrice
                        )
                      : Intl.NumberFormat("en-GB").format(
                          pr.quantity * pr.unitCostPrice
                        )}
                  </div>
                  <div className={classes.desktopOnly}>
                    {pr.productCategory?.category}
                  </div>
                  <div>
                    {Intl.DateTimeFormat("en-GB", {
                      month: "2-digit",
                      year: "2-digit",
                    }).format(Date.parse(pr.expiryDate))}
                  </div>
                </div>
              ))
            ) : (
              <div className={classes.empty}>
                No Product will be shortdated within this time frame
              </div>
            )}
          </div>
        </Fragment>
      )}
    </div>
  );
});

export default productListContainer;
