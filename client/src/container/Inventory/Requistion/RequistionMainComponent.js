import React, { useState, useCallback, useEffect } from "react";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import Spinner from "../../../components/UI/Spinner/Spinner";
import PreviewComponent from "../../../components/UI/PreviewComponent/PreviewComponent";
import RequistionComponent from "../../../components/RequistionComponent/RequistionComponent";
import { filteredSearch } from "../../../Utility/inventory/requistion";
import { useDispatch, useSelector } from "react-redux";
import classes from "./Requistion.module.css";
import {
  initProductDatabase,
  clearProductDatabaseError,
  validateRequistion,
  clearRequistionModal,
  clearMessage,
  sendMessage,
  sendRequistion,
} from "../../../store";
import {
  addRequistionItemHandler,
  updateRequistionItemHandler,
  deleteRequistionItemHandler,
  addPotentialRequisteHandler,
} from "../../../Utility/inventory/requistion";
import { storeNotificationMessenger } from "../../../Utility/general/general";

const RequistionMainComponent = React.memo((props) => {
  const dispatch = useDispatch();
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const unit = JSON.parse(sessionStorage.getItem("unit"));
  const clinic = JSON.parse(sessionStorage.getItem("clinic"));
  const [search, setSearch] = useState("");
  const [searchRender, setSearchRender] = useState(false);
  const [filteredProducts, setfilteredProducts] = useState([]);
  const [requistion, setRequistion] = useState([]);
  const [numberOfProducts, setNumberOfProducts] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const productDatabase = useSelector(
    (state) => state.general.products.database
  );
  const productDatabaseError = useSelector(
    (state) => state.general.products.error
  );
  const produtDatabaseLoader = useSelector(
    (state) => state.general.products.loading
  );
  const requistionLoader = useSelector((state) => state.requistion.loading);

  const requistionModal = useSelector((state) => state.requistion.modal);

  const initProductDatabaseHandler = useCallback(
    (token, location, unit, clinic) =>
      dispatch(initProductDatabase(token, location, unit, clinic)),
    [dispatch]
  );
  const clearProductDatabaseErrorHandler = useCallback(
    () => dispatch(clearProductDatabaseError()),
    [dispatch]
  );
  const clearRequistionModalHandler = useCallback(
    () => dispatch(clearRequistionModal()),
    [dispatch]
  );
  const requistionValidationHandler = useCallback(
    (requistion) => dispatch(validateRequistion(requistion)),
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
  const sendRequistionHandler = useCallback(
    (
      requistion,
      token,
      location,
      unit,
      numberOfProducts,
      totalPrice,
      setRequistion,
      setNumber,
      setPrice,
      clinic,
      socket,
      setRequistionComponent
    ) =>
      dispatch(
        sendRequistion(
          requistion,
          token,
          location,
          unit,
          numberOfProducts,
          totalPrice,
          setRequistion,
          setNumber,
          setPrice,
          clinic,
          socket,
          setRequistionComponent
        )
      ),
    [dispatch]
  );
  const length = productDatabase.length;
  useEffect(() => {
    initProductDatabaseHandler(token, $location?.id, unit?.id, clinic?.id);
  }, []);
  useEffect(() => {
    if (productDatabase.length) {
      addPotentialRequisteHandler(
        productDatabase,
        setRequistion,
        setSearchRender,
        setTotalPrice,
        setNumberOfProducts
      );
    }
  }, [length]);

  return (
    <React.Fragment>
      {productDatabaseError.message && (
        <ErrorHandler
          error={productDatabaseError.message}
          status={productDatabaseError.status}
          clearError={clearProductDatabaseErrorHandler}
        />
      )}
      <h4 className={classes.title}>PRODUCT REQUISTION</h4>
      {produtDatabaseLoader ? (
        <Spinner />
      ) : requistionModal ? (
        <PreviewComponent
          requistion={requistion}
          unit={unit}
          location={$location}
          clinic={clinic}
          token={token}
          totalPrice={totalPrice}
          numberOfProducts={numberOfProducts}
          sendRequistion={sendRequistionHandler}
          removeModal={clearRequistionModalHandler}
          setSearch={setSearch}
          setRequistion={setRequistion}
          setNumber={setNumberOfProducts}
          setPrice={setTotalPrice}
          requistionLoader={requistionLoader}
          socket={props.socket}
          setState={props.setState}
        />
      ) : (
        <RequistionComponent
          search={search}
          setSearch={setSearch}
          searchRender={searchRender}
          setSearchRender={setSearchRender}
          filteredSearch={filteredSearch}
          filteredProducts={filteredProducts}
          setfilteredProducts={setfilteredProducts}
          products={productDatabase}
          addRequistionItem={addRequistionItemHandler}
          setRequistion={setRequistion}
          requistion={requistion}
          updateRequistionItem={updateRequistionItemHandler}
          deleteRequistionItem={deleteRequistionItemHandler}
          numberOfProducts={numberOfProducts}
          totalPrice={totalPrice}
          setNumberProducts={setNumberOfProducts}
          setTotalPrice={setTotalPrice}
          validateRequistion={requistionValidationHandler}
          setState={props.setState}
        />
      )}
    </React.Fragment>
  );
});

export default RequistionMainComponent;
