import { Fragment, useState, useCallback, useEffect } from "react";
import TransferItem from "../../../components/TransferItem/TransferItem";
import IssueTransfer from "../../../components/IssueTransfer/IssueTransfer";
import TransferPreviewItem from "../../../components/TransferPreviewItem/TransferPreviewItem";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProductDatabaseError,
  initProductDatabase,
  getTransfersMethod,
  filteredProducts,
  validateReceiveTransfer,
  receiveTransferProducts,
  sendMessage,
  clearMessage,
} from "../../../store";
import { Navigate } from "react-router-dom";
import Message from "../../../components/UI/Message/Message";
import Spinner from "../../../components/UI/Spinner/Spinner";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import {
  selectTransfer,
  setLocationProduct,
} from "../../../Utility/inventory/receiveTransferProducts";
import classes from "./ReceiveTransferProducts.module.css";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import { storeNotificationMessenger } from "../../../Utility/general/general";
import TransferProductsComponent from "../TransferProducts/TransferProductsComponent";
const ReceiveTransferProducts = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
    transfers: [],
    selectedTransfer: null,
    selectedProduct: "",
    transferModal: false,
    issueTransfer: false,
    preview: false,
    changedModal: false,
    transferComponent: false,
  });
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;

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
  const validateReceiveTransferHandler = useCallback(
    (state, setState) => dispatch(validateReceiveTransfer(state, setState)),
    [dispatch]
  );
  const getTransfersMethodHandler = useCallback(
    (token, setState, location, unit, clinic) =>
      dispatch(getTransfersMethod(token, setState, location, unit, clinic)),
    [dispatch]
  );
  const receiveTransferProductsHandler = useCallback(
    (token, setState, state, location, unit, clinic) =>
      dispatch(
        receiveTransferProducts(token, setState, state, location, unit, clinic)
      ),
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
    getTransfersMethodHandler(token, setState, $location, unit, clinic);
  }, []);
  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch,
      setState
    );
  }, [props.socket]);
  return (
    <div className={classes.container}>
      <Message
        message={message}
        error={errorMessage}
      />
      <ChatMessenger message={mainMessage} />
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
      {/* Adjust */}
      <h4 className={classes.title}>RECEIVE TRANSFER</h4>
      {state.loading || productDatabaseLoader ? (
        <Spinner />
      ) : state.issueTransfer ? (
        <IssueTransfer
          state={state}
          setState={setState}
          database={productDatabase}
          filteredProducts={filteredProductsHandler}
          searchedProducts={products}
          setLocationProduct={setLocationProduct}
          validateReceiveTransfer={validateReceiveTransferHandler}
        />
      ) : state.preview ? (
        <TransferPreviewItem
          state={state}
          setState={setState}
          productList={state.selectedTransfer.products}
          receiveProducts={receiveTransferProductsHandler}
          clinic={clinic}
          unit={unit}
          token={token}
          location={$location}
          receive
        />
      ) : state.transferComponent ? (
        <TransferProductsComponent
          setRequistionState={setState}
          socket={props.socket}
        />
      ) : (
        <TransferItem
          transfers={state.transfers}
          setState={setState}
          selectTransfer={selectTransfer}
          database={productDatabase}
        />
      )}
    </div>
  );
};
// update for store and add notification with props.socket

export default ReceiveTransferProducts;
