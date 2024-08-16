import React, { useEffect, useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import Input from "../../../components/UI/Input/Input";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import Message from "../../../components/UI/Message/Message";
import Modal from "../../../components/Modal/Modal";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import {
  clearProductDatabaseError,
  initProductDatabase,
  filteredProducts,
  deleteProduct,
  clearMessage,
  sendMessage,
} from "../../../store/index";
import classes from "./DeleteProduct.module.css";
import { useDispatch, useSelector } from "react-redux";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const DeleteProduct = (props) => {
  const dispatch = useDispatch();
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [id, setId] = useState("");
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const productDatabase = useSelector(
    (state) => state.general.products.database
  );
  const productDatabaseError = useSelector(
    (state) => state.general.products.error
  );
  const produtDatabaseLoader = useSelector(
    (state) => state.general.products.loading
  );
  const products = useSelector((state) => state.editProduct.renderedProducts);
  const deleteLoading = useSelector((state) => state.deleteProduct.loading);
  const mainMessage = useSelector((state) => state.messenger.message);
  const clearProductDatabaseErrorHandler = useCallback(
    () => dispatch(clearProductDatabaseError()),
    [dispatch]
  );
  const initProductDatabaseHandler = useCallback(
    (token, location, unit, clinic) =>
      dispatch(initProductDatabase(token, location, unit, clinic)),
    [dispatch]
  );
  const filteredProductsHandler = useCallback(
    (event, products) => dispatch(filteredProducts(event, products)),
    [dispatch]
  );
  const deleteProductHandler = useCallback(
    (id, token, $location, clinic, unit) =>
      dispatch(deleteProduct(id, token, $location, clinic, unit)),
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
    initProductDatabaseHandler(token, $location, unit, clinic);
  }, [initProductDatabaseHandler]);
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
    const expiryDate = Intl.DateTimeFormat("en-gb", {
      year: "2-digit",
      month: "2-digit",
    }).format(parsedDate);
    return (
      <div
        key={product._id}
        className={[classes.deleteStructure, classes.productItem].join(" ")}
      >
        <div>{product.name}</div>
        <div>{product.quantity}</div>
        <div className={classes.desktopOnly}>
          {product.productCategory?.category}
        </div>
        <div>{expiryDate}</div>
        <div>
          <button
            className={classes.removeBtn}
            onClick={() => {
              setModal(true);
              setId(product._id);
            }}
          >
            ✕
          </button>
        </div>
      </div>
    );
  });
  return (
    <div className={classes.container}>
      <ChatMessenger message={mainMessage} />
      <h4
        style={{
          textAlign: "center",
        }}
      >
        DELETE PRODUCT
      </h4>
      <Modal
        show={modal}
        modalClosed={() => {
          setModal(false);
        }}
      >
        <div className={classes.interaction}>
          <div>
            <div>This product will be deleted permanently.</div>
            <div>Want to continue?</div>
          </div>
          <div>
            <Button
              changed={() => {
                setModal(false);
              }}
              config={{
                className: [classes.reject, classes.button].join(" "),
              }}
            >
              No
            </Button>
            <Button
              changed={() => {
                setModal(false);
                setSearch("");
                deleteProductHandler(id, token, $location, clinic, unit);
              }}
              config={{
                className: [classes.confirm, classes.button].join(" "),
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
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
      {(produtDatabaseLoader && <Spinner />) || (
        <div className={classes.deleteContainer}>
          {productDatabaseError.message && (
            <ErrorHandler
              error={productDatabaseError.message}
              status={productDatabaseError.status}
              clearError={clearProductDatabaseErrorHandler}
            />
          )}
          <div className={classes.productSearch}>
            <Input
              config={{
                autoFocus: true,
                type: "search",
                value: search,
                placeholder: "Search The Name of Product",
              }}
              changed={(event) => {
                filteredProductsHandler(event, productDatabase);
                setSearch(event.target.value);
              }}
            />
          </div>

          <div className={classes.deleteStructure}>
            <div>PRODUCT NAME</div>
            <div>QUANTITY</div>
            <div className={classes.desktopOnly}>CATEGORY</div>
            <div>EXPIRY DATE</div>
            <div></div>
          </div>
          <div className={classes.deleteProducts}>
            {(deleteLoading && <Spinner />) || renderedProducts || null}
          </div>
        </div>
      )}
    </div>
  );
};

export default DeleteProduct;
