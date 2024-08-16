import React, { useEffect, useCallback, useState } from "react";
import RenderContainer from "../../../components/RenderContainer/RenderContainer";
import Message from "../../../components/UI/Message/Message";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import Inventory from "../../../components/Inventory/Inventory";
import { Navigate } from "react-router-dom";
import classes from "./ProductInventory.module.css";
import {
  initProductDatabase,
  filteredProducts,
  clearProductDatabaseError,
  initProductLog,
  sendMessage,
  clearMessage,
} from "../../../store/index";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Modal from "../../../components/Modal/Modal";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const ProductInventory = (props) => {
  const [inventory, setInventory] = useState(false);
  const [productName, setProductName] = useState("");
  const [selectedInventory, setSelectedInventory] = useState("");
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");
  const [skip, setSkip] = useState(0);
  const [finished, setFinished] = useState(false);
  const [productId, setProductId] = useState(null);
  const dispatch = useDispatch();
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const products = useSelector((state) => state.editProduct.renderedProducts);
  const productLogs = useSelector((state) => state.productLog.productLog);
  const loading = useSelector((state) => state.productLog.loading);
  const mainMessage = useSelector((state) => state.messenger.message);
  const initProductDatabaseHandler = useCallback(
    (token, location, unit, clinic) =>
      dispatch(initProductDatabase(token, location, unit, clinic)),
    [dispatch]
  );
  const clearProductDatabaseErrorHandler = useCallback(
    () => dispatch(clearProductDatabaseError()),
    [dispatch]
  );
  const filteredProductsHandler = useCallback(
    (event, products) => dispatch(filteredProducts(event, products)),
    [dispatch]
  );
  const initProductLogHandler = useCallback(
    (id, token, object, setFinished) =>
      dispatch(initProductLog(id, token, object, setFinished)),
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
  const productDatabase = useSelector(
    (state) => state.general.products.database
  );
  const productDatabaseError = useSelector(
    (state) => state.general.products.error
  );
  const produtDatabaseLoader = useSelector(
    (state) => state.general.products.loading
  );
  useEffect(() => {
    initProductDatabaseHandler(token, $location, unit, clinic);
  }, [initProductDatabaseHandler, token, $location, unit, clinic]);
  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);
  useEffect(() => {
    if (productId) {
      initProductLogHandler(productId, token, { skip }, setFinished);
    }
  }, [productId, skip]);
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
          setSearch("");
          setInventory(true);
          setProductId(product._id);
          setProductName(product.name);
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
  let renderProductLogs = null;
  if (loading) {
    renderProductLogs = <Spinner />;
  } else {
    renderProductLogs = productLogs.map((log) => {
      const parsedDate = Date.parse(`${log.createdAt}`);
      const date = Intl.DateTimeFormat("en-GB", {
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
      }).format(parsedDate);
      const time = Intl.DateTimeFormat("en-GB", {
        timeStyle: "short",
      }).format(parsedDate);
      return (
        <div
          className={classes.inventoryStructure}
          key={log._id}
          style={{
            backgroundColor: log.received
              ? "#2bf712"
              : log.issued
              ? "#c41a1a"
              : "#e8f1fb",
          }}
          onClick={() => {
            setSelectedInventory(log);
            setModal(true);
          }}
        >
          <div>
            <div>{date}</div>
            <div>{time}</div>
          </div>
          <div>{log.movement}</div>
          <div>{log.received || log.issued || 0}</div>
          <div>{log.balance}</div>
          <div className={classes.desktopOnly}>
            {log?.signature?.lastName || "Pharmacist"}
          </div>
        </div>
      );
    });
  }

  return (
    <div className={classes.container}>
      {!isAuthenticated && !token && (
        <Navigate
          to='/pharma-app/log-out'
          replace={true}
        />
      )}
      <ChatMessenger message={mainMessage} />
      <Modal
        show={modal}
        modalClosed={() => {
          setModal(false);
        }}
      >
        {selectedInventory ? (
          <div className={classes.selectedInventory}>
            <h5>{productName}</h5>
            <div>
              <div>Date</div>
              <div>
                <div>
                  {Intl.DateTimeFormat("en-GB", {
                    year: "2-digit",
                    month: "2-digit",
                    day: "2-digit",
                  }).format(Date.parse(`${selectedInventory.createdAt}`))}
                </div>
                <div>
                  {Intl.DateTimeFormat("en-GB", {
                    timeStyle: "short",
                  }).format(Date.parse(`${selectedInventory.createdAt}`))}
                </div>
              </div>
            </div>
            <div>
              <div>Movement</div>
              <div>{selectedInventory.movement}</div>
            </div>
            <div>
              <div>Quantity Issued or Received</div>
              <div>
                {selectedInventory.received || selectedInventory.issued || 0}
              </div>
            </div>
            <div>
              <div>Balance</div>
              <div> {selectedInventory.balance}</div>
            </div>
            <div>
              <div>Signature</div>
              <div>
                {selectedInventory?.signature?.lastName
                  ? `${selectedInventory?.signature?.lastName} ${selectedInventory?.signature?.firstName}`
                  : "Pharmacist"}
              </div>
            </div>
          </div>
        ) : null}
      </Modal>
      <Message
        message={message}
        error={errorMessage}
      />
      <h4
        style={{
          textAlign: "center",
        }}
        className={classes.title}
      >
        PRODUCT INVENTORY
      </h4>
      {productDatabaseError.message && (
        <ErrorHandler
          error={productDatabaseError.message}
          status={productDatabaseError.status}
          clearError={clearProductDatabaseErrorHandler}
        />
      )}
      {inventory ? (
        <div className={classes.form}>
          <Inventory
            title={productName}
            skip={skip}
            setSkip={setSkip}
            finished={finished}
          >
            {renderProductLogs}
          </Inventory>
          <button
            className={classes.removeBtn}
            onClick={() => {
              setInventory(false);
              setProductId(null);
              setSkip(0);
              setFinished(false);
            }}
          >
            <span className={classes.cancelStick}></span>
            <span className={classes.cancelStick}></span>
          </button>
        </div>
      ) : produtDatabaseLoader ? (
        <Spinner />
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
};

export default ProductInventory;
