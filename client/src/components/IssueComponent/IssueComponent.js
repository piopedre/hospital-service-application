import React from "react";
import classes from "./IssueComponent.module.css";
import Button from "../UI/Button/Button";
import Modal from "../Modal/Modal";
import Input from "../UI/Input/Input";
const issueComponent = React.memo((props) => {
  const { numberProducts, sumTotal } = [...props.requistion.products].reduce(
    (acc, cur, _, arr) => {
      acc.numberProducts = arr.length;
      acc.sumTotal += +cur.approvedQty * +cur.costPrice;
      return acc;
    },
    {
      sumTotal: 0,
      numberProducts: 0,
    }
  );

  return (
    <div className={classes.mainContainer}>
      <Modal
        show={props.show}
        modalClosed={() =>
          props.setState((prevState) => {
            return {
              ...prevState,
              modalPreview: false,
            };
          })
        }
      >
        <h4 className={classes.title}>SET STORE PRODUCT</h4>
        <Input
          config={{
            placeholder: "SEARCH THE NAME OF THE PRODUCT",
          }}
          changed={(e) =>
            props.searchStoreProduct(e, props.setState, props.database)
          }
        />
        <div className={classes.modalProductHeading}>
          <div>PRODUCT NAME</div>
        </div>
        <div className={classes.modalProductCtn}>
          {props.store.map((pr) => (
            <div
              className={classes.modalProductItem}
              onClick={() => props.updateStoreProduct(pr, props.setState)}
              key={pr._id}
            >
              <div>{pr.name}</div>
            </div>
          ))}
        </div>
      </Modal>
      <div className={classes.issueComponentCtn}>
        <div
          className={classes.removeBtn}
          onClick={() => {
            props.setState((prevState) => {
              return {
                ...prevState,
                requistionComponent: false,
              };
            });
          }}
        >
          ✕
        </div>
        <div
          style={{
            fontWeight: "bold",
          }}
        >
          REQUISTION FROM {props.requistion.unit?.name},{" "}
          {props.requistion.location?.name},{props.requistion.clinic?.name}, SIV
          : {props.requistion.siv}
        </div>
      </div>
      <div>
        <div className={classes.issueProductsHeadings}>
          <div>PRODUCT NAME</div>
          <div>QTY PACKSIZE</div>
          <div>PRICE</div>
          <div>QTY PRICE</div>
        </div>
        <div className={classes.issueProductsList}>
          {props.requistion.products.map((product) => (
            <div
              className={classes.requistionItem}
              key={product.id}
            >
              <div className={classes.requistionProductInformation}>
                <div>{product?.name}</div>
                <input
                  value={+product?.approvedQty}
                  min={1}
                  autoFocus={true}
                  onChange={(e) =>
                    props.updateStockRequired(e, product.id, props.setState)
                  }
                />
                <input
                  value={product?.costPrice}
                  min={1}
                  onChange={(e) =>
                    props.updateCostPrice(e, product.id, props.setState)
                  }
                />
                <div>
                  {Intl.NumberFormat("en-GB").format(
                    product?.approvedQty * product.costPrice
                  )}
                </div>
              </div>

              <div className={classes.requistionInformation}>
                <div>
                  <div> ON-HAND-QTY:</div>
                  <div>{product.onHandQuantity}</div>
                </div>
                <div>
                  REQUIRED : {product.stockRequired} ✕ {product.packSize}
                </div>
              </div>
              {product?.storeProduct?.name ? (
                <div
                  className={classes.storeProductInformation}
                  onClick={() => {
                    props.setState((prevState) => {
                      return {
                        ...prevState,
                        modalPreview: true,
                        selectedRequistionProduct: product.id,
                      };
                    });
                  }}
                >
                  <div>STORE</div>
                  <div>{product?.storeProduct?.name}</div>
                  <div>
                    <div> ON HAND QTY : </div>
                    <div>
                      {product?.storeProduct.quantity} ✕
                      {product?.storeProduct.packSize}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => {
                    props.setState((prevState) => {
                      return {
                        ...prevState,
                        modalPreview: true,
                        selectedRequistionProduct: product.id,
                      };
                    });
                  }}
                >
                  No store Product found
                </div>
              )}
            </div>
          ))}
        </div>
        <div className={classes.interactionBar}>
          <div>NUMBER OF PRODUCTS</div>
          <div>{numberProducts}</div>
          <div> TOTAL</div>
          <div>₦ {Intl.NumberFormat("en-GB").format(sumTotal.toFixed(2))}</div>
        </div>
        <Button
          config={{
            className: classes.confirm,
          }}
          changed={() => props.validateIssue(props.state, props.setState)}
        >
          PREVIEW
        </Button>
        {props.checkRequistion(props.requistion._id) ? (
          <Button
            config={{
              className: classes.retrieve,
            }}
            changed={() =>
              props.retrieveRequistion(
                props.setState,
                props.requistion._id,
                props.token,
                props.location,
                props.unit,
                props.clinic
              )
            }
          >
            RETRIEVE
          </Button>
        ) : (
          <Button
            config={{
              className: classes.hold,
            }}
            changed={() => props.holdIssue(props.requistion, props.setState)}
          >
            HOLD
          </Button>
        )}
      </div>
    </div>
  );
});

export default issueComponent;
