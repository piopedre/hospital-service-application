import React from "react";
import Input from "../UI/Input/Input";
import classes from "./ProductContainer.module.css";
import Button from "../UI/Button/Button";
const productContainer = React.memo((props) => {
  return (
    <div>
      <div
        className={classes.searchContainer}
        onClick={() =>
          props.setState((prevState) => {
            return {
              ...prevState,
              searchModal: false,
            };
          })
        }
      >
        <div className={classes.searchInput}>
          <Input
            config={{
              type: "search",
              placeholder: "SEARCH PRODUCT NAME",
              autoFocus: true,
              value: props.state.search,
            }}
            changed={(e) => {
              props.filterMethod(e, props.products);
              props.setState((prevState) => {
                return {
                  ...prevState,
                  search: e.target.value,
                  searchModal: true,
                };
              });
            }}
          />
        </div>

        {props.searchModal ? (
          <div className={classes.searchRenderContainer}>
            <div className={classes.searchRenderStructure}>
              <div>PRODUCT NAME</div>
              <div>QTY</div>
              <div className={classes.desktopOnly}>CATEGORY</div>
              <div>EXPIRY DATE</div>
            </div>
            <div className={classes.searchedProducts}>
              {props.filteredProducts.map((product) => (
                <div
                  className={[
                    classes.searchRenderStructure,
                    classes.searchItem,
                  ].join(" ")}
                  key={product._id}
                  onClick={() => {
                    props.addToProductList(
                      product._id,
                      props.products,
                      props.state,
                      props.setState
                    );
                  }}
                >
                  <div>{product.name}</div>
                  <div>{product.quantity}</div>
                  <div className={classes.desktopOnly}>
                    {product.productCategory?.category}
                  </div>
                  <div>
                    {Intl.DateTimeFormat("en-GB", {
                      month: "2-digit",
                      year: "2-digit",
                    }).format(Date.parse(product.expiryDate))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
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
          {props.state.productList.map((product) => (
            <div
              className={[classes.productStructure, classes.productItem].join(
                " "
              )}
              key={product.get("id")}
            >
              <div>{product.get("name")}</div>
              <div>{product.get("onHandQuantity")}</div>
              <div>
                <input
                  type='number'
                  value={product.get("quantity")}
                  min='0'
                  autoFocus={true}
                  style={{
                    padding: "10px",
                    border: "none",
                    outline: "none",
                    textAlign: "center",
                    width: "80px",
                  }}
                  onChange={(e) =>
                    props.updateProductItem(
                      e,
                      props.setState,
                      product.get("id")
                    )
                  }
                />
              </div>
              <div className={classes.desktopOnly}>
                {Intl.DateTimeFormat("en-GB", {
                  month: "2-digit",
                  year: "2-digit",
                }).format(Date.parse(product.get("expiryDate")))}
              </div>
              <div
                className={classes.cancel}
                onClick={() =>
                  props.deleteItem(props.setState, product.get("id"))
                }
              >
                ✕
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

        {props.transfers && (
          <Button
            config={{
              className: classes.cancel,
            }}
            changed={() =>
              props.setRequistionState((prevState) => {
                return {
                  ...prevState,
                  transferComponent: false,
                };
              })
            }
          >
            ← GO BACK
          </Button>
        )}
        <Button
          config={{
            className: classes.confirm,
          }}
          changed={() => props.validateTransfer(props.state, props.setState)}
        >
          SUBMIT
        </Button>
      </div>
    </div>
  );
});

export default productContainer;
