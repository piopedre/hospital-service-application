import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  initProductDatabase,
  clearProductDatabaseError,
  addSupplier,
  getSuppliersMethod,
  receiveProductsMethod,
  clearMessage,
  sendMessage,
  exchangeProductsMethod,
  holdReceiveProducts,
  uploadReceivedItem,
} from "../../../store";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import Modal from "../../../components/Modal/Modal";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import classes from "./ReceiveProducts.module.css";
import HoldComponent from "../../../components/HoldComponent/HoldComponent";
import {
  addToReceivedList,
  filteredProducts,
  updateReceivedListPrice,
  removeReceivedListItem,
  updateReceivedListExpiryDate,
  updateReceivedListQuantity,
} from "../../../Utility/receivedProducts/receivedProducts";

import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Message from "../../../components/UI/Message/Message";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const ReceiveProducts = (props) => {
  const dispatch = useDispatch();
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const mainMessage = useSelector((state) => state.messenger.message);
  const [state, setState] = useState({
    search: "",
    addModal: false,
    searchRender: false,
    filteredProducts: [],
    receivedItems: [],
    receiveProductsLoading: false,
    addSupplierLoading: false,
    addSupplier: false,
    suppliers: [],
    selectedSupplier: null,
    hold: false,
    heldProducts: [],
  });

  const productDatabase = useSelector(
    (state) => state.general.products.database
  );
  const productDatabaseError = useSelector(
    (state) => state.general.products.error
  );
  const productDatabaseLoader = useSelector(
    (state) => state.general.products.loading
  );
  const initProductDatabaseHandler = useCallback(
    (token, location, unit, clinic) =>
      dispatch(initProductDatabase(token, location, unit, clinic)),
    [dispatch]
  );
  const addSupplierHandler = useCallback(
    (event, token, setState) => dispatch(addSupplier(event, token, setState)),
    [dispatch]
  );
  const getSuppliersHandler = useCallback(
    (token, setState) => dispatch(getSuppliersMethod(token, setState)),
    [dispatch]
  );
  const receiveProductsHandler = useCallback(
    (token, setState, state, unit, location, clinic) =>
      dispatch(
        receiveProductsMethod(token, setState, state, unit, location, clinic)
      ),
    [dispatch]
  );
  const holdReceiveProductsHandler = useCallback(
    (e, state, setState) => dispatch(holdReceiveProducts(e, state, setState)),
    [dispatch]
  );
  const uploadReceivedItemHandler = useCallback(
    (index, token, location, unit, clinic, setState) =>
      dispatch(
        uploadReceivedItem(index, token, location, unit, clinic, setState)
      ),
    [dispatch]
  );
  const exchangeProductsMethodHandler = useCallback(
    (token, setState, state, unit, location, clinic) =>
      dispatch(
        exchangeProductsMethod(token, setState, state, unit, location, clinic)
      ),
    [dispatch]
  );
  const clearProductDatabaseErrorHandler = useCallback(
    () => dispatch(clearProductDatabaseError()),
    [dispatch]
  );
  const mainMessageHandler = useCallback(
    (message) => dispatch(sendMessage(message)),
    [dispatch]
  );
  const clearMessageHandler = useCallback(
    () => dispatch(clearMessage()),
    [dispatch]
  );
  const { numberProducts, sumTotal } = [...state.receivedItems].reduce(
    (acc, cur, _, arr) => {
      acc.numberProducts = arr.length;
      acc.sumTotal += +cur.get("qtyPrice");
      return acc;
    },
    { numberProducts: 0, sumTotal: 0 }
  );

  useEffect(() => {
    initProductDatabaseHandler(token, $location, unit, clinic);
    getSuppliersHandler(token, setState);
  }, []);
  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);
  return (
    <div className={classes.container}>
      {productDatabaseError.message && (
        <ErrorHandler
          error={productDatabaseError.message}
          status={productDatabaseError.status}
          clearError={clearProductDatabaseErrorHandler}
        />
      )}
      {!isAuthenticated && !token && (
        <Navigate
          replace={true}
          to='/pharma-app/log-out'
        />
      )}
      <ChatMessenger message={mainMessage} />
      <Modal
        show={state.hold}
        modalClosed={() =>
          setState((prevState) => {
            return {
              ...prevState,
              hold: false,
            };
          })
        }
      >
        <HoldComponent
          item={state.heldProducts}
          component='Received Products'
          retrieve={uploadReceivedItemHandler}
          token={token}
          location={$location}
          unit={unit}
          clinic={clinic}
          setState={setState}
        />
      </Modal>
      <Modal
        show={state.addModal}
        modalClosed={() =>
          setState((prevState) => {
            return {
              ...prevState,
              addModal: false,
            };
          })
        }
      >
        <div>
          <h5 className={classes.addModal}>are you sure, you want continue?</h5>
          <Button
            config={{
              className: classes.cancel,
            }}
            changed={() =>
              setState((prevState) => {
                return {
                  ...prevState,
                  addModal: false,
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
              props.exchange
                ? exchangeProductsMethodHandler(
                    token,
                    setState,
                    state,
                    unit,
                    $location,
                    clinic
                  )
                : receiveProductsHandler(
                    token,
                    setState,
                    state,
                    unit,
                    $location,
                    clinic
                  )
            }
          >
            YES
          </Button>
        </div>
      </Modal>
      <Modal
        show={state.addSupplier}
        modalClosed={() =>
          setState((prevState) => {
            return {
              ...prevState,
              addSupplier: false,
            };
          })
        }
      >
        {state.addSupplierLoading ? (
          <Spinner />
        ) : (
          <form
            className={classes.addSupplierForm}
            onSubmit={(e) => addSupplierHandler(e, token, setState)}
          >
            <h3>ADD SUPPLIER FORM</h3>
            <Input
              label='SUPPLIER NAME'
              config={{
                name: "name",
                placeholder: "SUPPLIER NAME",
                required: true,
              }}
            />
            <Input
              label='SUPPLIER CONTACT'
              config={{
                name: "contact",
                placeholder: "SUPPLIER CONTACT",
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
      <Message
        message={message}
        error={errorMessage}
      />
      <h4 className={classes.title}>
        {props.exchange ? "EXCHANGE PRODUCTS" : "RECEIVE PRODUCTS"}
      </h4>
      {productDatabaseLoader ? (
        <Spinner />
      ) : state.receiveProductsLoading ? (
        <Spinner />
      ) : (
        <div className={classes.mainContainer}>
          <div className={classes.inputs}>
            <div className={classes.inputContainer}>
              <Input
                config={{
                  placeholder: "SEARCH THE NAME OF THE PRODUCT",
                  value: state.search,
                  autoFocus: true,
                }}
                changed={(e) => {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      search: e.target.value,
                    };
                  });
                  filteredProducts(e, productDatabase, setState);
                }}
              />
              <Input
                inputType='select'
                title='SELECT SUPPLIER'
                options={state.suppliers.map((supplier) => supplier.name)}
                changed={(e) => {
                  const selectedSupplier = state.suppliers.find(
                    (supplier) => supplier.name === e.target.value
                  );

                  setState((prevState) => {
                    return {
                      ...prevState,
                      selectedSupplier: selectedSupplier._id,
                    };
                  });
                }}
              />
            </div>

            {state.searchRender ? (
              <div className={classes.searchRenderContainer}>
                <div className={classes.searchHeadings}>
                  <div>PRODUCT NAME</div>
                  <div>QUANTITY</div>
                  <div className={classes.desktopOnly}>COST PRICE</div>
                  <div>EXPIRY DATE</div>
                </div>
                <div className={classes.searchList}>
                  {state.filteredProducts.map((product) => (
                    <div
                      className={classes.searchItem}
                      key={product._id}
                      onClick={() =>
                        addToReceivedList(
                          setState,
                          state,
                          productDatabase,
                          product._id
                        )
                      }
                    >
                      <div>{product.name}</div>
                      <div>{product.quantity}</div>
                      <div className={classes.desktopOnly}>
                        {Intl.NumberFormat("en-GB").format(product.costPrice)}
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
          <Button
            config={{
              className: classes.confirm,
            }}
            changed={() => {
              setState((prevState) => {
                return {
                  ...prevState,
                  addSupplier: true,
                };
              });
            }}
          >
            ADD NEW SUPPLIER
          </Button>
          <div className={classes.receiveContainer}>
            <div
              className={[
                classes.receiveStructure,
                classes.receiveHeadings,
              ].join(" ")}
            >
              <div>PRODUCT NAME</div>
              <div>QTY PACKSIZE </div>
              <div>PRICE</div>
              <div>QTY PRICE</div>
            </div>

            <div className={classes.receivedItemsList}>
              {state.receivedItems.map((item, i) => (
                <div
                  className={classes.receivedItem}
                  key={item.get("id")}
                >
                  <div className={classes.receiveStructure}>
                    <div>{item.get("name")}</div>
                    <input
                      value={+item.get("quantity")}
                      autoFocus={true}
                      min={1}
                      style={{
                        fontWeight: "bold",
                      }}
                      onChange={(e) =>
                        updateReceivedListQuantity(e, item.get("id"), setState)
                      }
                    />
                    <input
                      value={+item.get("costPrice")}
                      min={1}
                      style={{
                        fontWeight: "bold",
                      }}
                      onChange={(e) =>
                        updateReceivedListPrice(e, item.get("id"), setState)
                      }
                    />
                    <div>
                      {Intl.NumberFormat("en-GB").format(
                        item.get("qtyPrice").toFixed(2)
                      )}
                    </div>
                  </div>
                  <div>
                    <div className={classes.otherProps}>
                      <div
                        style={{
                          textAlign: "left",
                          cursor: "pointer",
                        }}
                      >
                        EXPIRY DATE :
                        <input
                          type='month'
                          value={item.get("expiryDate")}
                          style={{
                            textAlign: "left",
                            cursor: "pointer",
                          }}
                          onChange={(e) =>
                            updateReceivedListExpiryDate(
                              e,
                              item.get("id"),
                              setState
                            )
                          }
                        />
                      </div>
                      <div
                        style={{
                          textAlign: "left",
                        }}
                      >
                        ON-HAND-QTY : {item.get("onHandQty")}
                      </div>
                      <div> CATEGORY: {item.get("category").category}</div>
                      <div
                        className={classes.removeBtn}
                        onClick={() =>
                          removeReceivedListItem(item.get("id"), setState)
                        }
                      >
                        ✕
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className={classes.interactionBar}>
              <div>NUMBER OF PRODUCTS</div>
              <div>{numberProducts}</div>
              <div> TOTAL</div>
              <div>
                ₦ {Intl.NumberFormat("en-GB").format(sumTotal.toFixed(2))}
              </div>
            </div>
          </div>
          <div>
            <Button
              config={{ className: classes.hold }}
              changed={(e) => holdReceiveProductsHandler(e, state, setState)}
            >
              {state.receivedItems.length ? "HOLD" : "HELD"}
            </Button>
            <Button
              config={{
                className: classes.confirm,
              }}
              changed={() =>
                setState((prevState) => {
                  return {
                    ...prevState,
                    addModal: true,
                  };
                })
              }
            >
              SAVE
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReceiveProducts;
