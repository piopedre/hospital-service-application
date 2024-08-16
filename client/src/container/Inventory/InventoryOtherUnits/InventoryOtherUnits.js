import React, { Fragment, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  clearMessage,
  clearProductDatabaseError,
  initProductDatabase,
  filteredProducts,
  getOtherUnitsInventoryAction,
} from "../../../store";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import Message from "../../../components/UI/Message/Message";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import { Navigate } from "react-router-dom";
import RenderContainer from "../../../components/RenderContainer/RenderContainer";
import Spinner from "../../../components/UI/Spinner/Spinner";
import classes from "./InventoryOtherUnits.module.css";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const InventoryOtherUnits = memo((props) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [inventory, setInventory] = useState(false);
  const [state, setState] = useState({
    loading: false,
    productList: [],
    productName: "",
  });
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const unit = JSON.parse(sessionStorage.getItem("unit"));
  const clinic = JSON.parse(sessionStorage.getItem("clinic"));
  const mainMessage = useSelector((state) => state.messenger.message);
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const products = useSelector((state) => state.editProduct.renderedProducts);
  const productDatabase = useSelector(
    (state) => state.general.products.database
  );
  const productDatabaseError = useSelector(
    (state) => state.general.products.error
  );

  const productDatabaseLoader = useSelector(
    (state) => state.general.products.loading
  );
  const filteredProductsHandler = useCallback(
    (event, products) => dispatch(filteredProducts(event, products)),
    [dispatch]
  );
  const initProductDatabaseHandler = useCallback(
    (token, location, unit, clinic) =>
      dispatch(initProductDatabase(token, location, unit, clinic)),
    [dispatch]
  );
  const getOtherUnitsInventoryActionHandler = useCallback(
    (token, productId, setState, productName) =>
      dispatch(
        getOtherUnitsInventoryAction(token, productId, setState, productName)
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
  useEffect(() => {
    initProductDatabaseHandler(token, $location?.id, unit?.id, clinic?.id);
  }, []);
  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);
  const renderedProducts = products.map((product) => {
    const parsedDate = Date.parse(`${product.expiryDate}`);
    const expiryDate = Intl.DateTimeFormat("en-GB", {
      year: "2-digit",
      month: "2-digit",
    }).format(parsedDate);
    return (
      <div
        key={product._id}
        className={[classes.productStructure, classes.productItem].join(" ")}
        onClick={() => {
          // new action
          setSearch("");
          setInventory(true);
          getOtherUnitsInventoryActionHandler(
            token,
            product._id,
            setState,
            product.name
          );
        }}
      >
        <div>{product.name}</div>
        <div>{product.quantity}</div>
        <div className={classes.desktopOnly}>
          {product.productCategory?.category}
        </div>
        <div>{expiryDate}</div>
      </div>
    );
  });
  return (
    <div className={classes.container}>
      <ChatMessenger message={mainMessage} />
      <Message
        message={message}
        error={errorMessage}
      />
      {!isAuthenticated && !token && (
        <Navigate
          replace={true}
          to='/pharma-app/log-out'
        />
      )}
      {productDatabaseError.message && (
        <ErrorHandler
          error={productDatabaseError.message}
          status={productDatabaseError.status}
          clearError={clearProductDatabaseErrorHandler}
        />
      )}
      <h4 className={classes.title}>INVENTORY OF OTHER UNITS</h4>
      {productDatabaseLoader || state.loading ? (
        <Spinner />
      ) : inventory ? (
        <div className={classes.productCtn}>
          <button
            className={classes.removeBtn}
            onClick={() => {
              setInventory(false);
              setState((prevState) => {
                return {
                  ...prevState,
                  productList: [],
                  productName: "",
                };
              });
            }}
          >
            <span className={classes.cancelStick}></span>
            <span className={classes.cancelStick}></span>
          </button>
          <h4>{state.productName}</h4>
          <div>
            <div
              className={[classes.productHeadings, classes.structure].join(" ")}
            >
              <div>LOCATION</div>
              <div>UNIT</div>
              <div>CLINIC</div>
              <div>QTY</div>
            </div>
            <div className={classes.productList}>
              {state.productList.length ? (
                state.productList.map((item) => (
                  <div
                    key={item._id}
                    className={[classes.item, classes.structure].join(" ")}
                  >
                    <div>{item.location?.name}</div>
                    <div>{item.unit?.name}</div>
                    <div>{item.clinic?.name}</div>
                    <div>{item.quantity}</div>
                  </div>
                ))
              ) : (
                <div className={classes.empty}>
                  NO PRODUCT NOT AVAILABLE IN OTHER UNITS
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <RenderContainer
          database={productDatabase}
          search={search}
          filteredProductsHandler={filteredProductsHandler}
          setSearch={setSearch}
        >
          {renderedProducts || null}
        </RenderContainer>
      )}
    </div>
  );
});

export default InventoryOtherUnits;
