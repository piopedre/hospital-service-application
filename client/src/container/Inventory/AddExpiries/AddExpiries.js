import React, { Fragment, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ProductContainer from "../../../components/ProductContainer/ProductContainer";
import Message from "../../../components/UI/Message/Message";
import { Navigate } from "react-router-dom";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import {
  clearProductDatabaseError,
  initProductDatabase,
  filteredProducts,
  validateAddExpiries,
  addExpiriesMethod,
  sendMessage,
  clearMessage,
} from "../../../store";
import {
  addToProductListHandler,
  updateProductItem,
  deleteProductItem,
  addExpiredProductsToList,
} from "../../../Utility/inventory/transferProducts";
import Spinner from "../../../components/UI/Spinner/Spinner";
import MainPreview from "../../../components/MainPreview/MainPreview";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import { storeNotificationMessenger } from "../../../Utility/general/general";

const AddExpiries = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    search: "",
    searchModal: false,
    productList: [],
    preview: false,
    loading: false,
    submitModal: false,
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
  const validateAddExpiriesHandler = useCallback(
    (state, setState) => dispatch(validateAddExpiries(state, setState)),
    [dispatch]
  );
  const addExpiriesHandler = useCallback(
    (token, state, setState, location, unit, clinic) =>
      dispatch(
        addExpiriesMethod(token, state, setState, location, unit, clinic)
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
  const length = productDatabase.length;
  useEffect(() => {
    initProductDatabaseHandler(token, $location, unit, clinic);
  }, []);
  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);
  useEffect(() => {
    if (productDatabase.length) {
      setState((prevState) => {
        return {
          ...prevState,
          productList: [],
        };
      });
      addExpiredProductsToList(productDatabase, state, setState);
    }
  }, [length]);
  return (
    <div style={{ minHeight: "600px" }}>
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
      {productDatabaseLoader || state.loading ? (
        <Spinner />
      ) : state.preview ? (
        <MainPreview
          state={state}
          productList={state.productList}
          setState={setState}
          token={token}
          location={$location}
          unit={unit}
          clinic={clinic}
          addMethod={addExpiriesHandler}
        />
      ) : (
        <ProductContainer
          state={state}
          setState={setState}
          productList={state.productList}
          filterMethod={filteredProductsHandler}
          products={productDatabase}
          filteredProducts={products}
          searchModal={state.searchModal}
          addToProductList={addToProductListHandler}
          updateProductItem={updateProductItem}
          deleteItem={deleteProductItem}
          validateTransfer={validateAddExpiriesHandler}
        />
      )}
    </div>
  );
};

export default AddExpiries;
