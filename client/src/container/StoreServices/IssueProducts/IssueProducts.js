import React, { useEffect, useCallback, Fragment, useState } from "react";
import Message from "../../../components/UI/Message/Message";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import classes from "./IssueProducts.module.css";
import IssueComponent from "../../../components/IssueComponent/IssueComponent";
import IssuePreviewComponent from "../../../components/IssuePreviewComponent/IssuePreviewComponent";
import {
  initRequistion,
  clearProductDatabaseError,
  issueRequistionMethod,
  validateIssue,
  sendMessage,
  clearMessage,
  holdIssue,
  sendProductMessenger,
} from "../../../store";
import {
  storeProductHandler,
  updateStockRequiredHandler,
  updateCostPriceHandler,
  updateStoreProductHandler,
  searchStoreProductHandler,
  checkRequistionHeld,
} from "../../../Utility/issueProducts/issueProducts";
import { retrieveRequistion } from "../../../store";
import Spinner from "../../../components/UI/Spinner/Spinner";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const IssuedProducts = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    requistions: [],
    requistionComponent: false,
    selectedRequistion: null,
    selected: false,
    previewComponent: false,
    issueLoading: null,
    modalPreview: false,
    storeProducts: [],
    selectedRequistionProduct: null,
  });

  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const unit = JSON.parse(sessionStorage.getItem("unit"));
  const clinic = JSON.parse(sessionStorage.getItem("clinic"));
  const mainMessage = useSelector((state) => state.messenger.message);
  const productDatabase = useSelector(
    (state) => state.general.products.database
  );
  const productDatabaseError = useSelector(
    (state) => state.general.products.error
  );
  const productDatabaseLoader = useSelector(
    (state) => state.general.products.loading
  );
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  const initRequistionHandler = useCallback(
    (token, setState, location, unit) =>
      dispatch(initRequistion(token, setState, location, unit)),
    [dispatch]
  );

  const issueRequistionHandler = useCallback(
    (token, setState, state, location, unit, clinic, socket) =>
      dispatch(
        issueRequistionMethod(
          token,
          setState,
          state,
          location,
          unit,
          clinic,
          socket
        )
      ),
    [dispatch]
  );
  const retrieveRequistionHandler = useCallback(
    (setState, id, token, location, unit, clinic) =>
      dispatch(retrieveRequistion(setState, id, token, location, unit, clinic)),
    [dispatch]
  );
  const validateIssueHandler = useCallback(
    (state, setState) => dispatch(validateIssue(state, setState)),
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
  const holdIssueHandler = useCallback(
    (state, setState) => dispatch(holdIssue(state, setState)),
    [dispatch]
  );
  useEffect(() => {
    initRequistionHandler(token, setState, $location?.id, unit?.id);
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
      <ChatMessenger message={mainMessage} />
      {productDatabaseError.message && (
        <ErrorHandler
          error={productDatabaseError.message}
          status={productDatabaseError.status}
          clearError={clearProductDatabaseErrorHandler}
        />
      )}

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
      {(productDatabaseLoader && <Spinner />) ||
        (state.requistionComponent ? (
          state.selected && (
            <IssueComponent
              setState={setState}
              requistion={state.selectedRequistion}
              updateStockRequired={updateStockRequiredHandler}
              updateCostPrice={updateCostPriceHandler}
              validateIssue={validateIssueHandler}
              updateStoreProduct={updateStoreProductHandler}
              searchStoreProduct={searchStoreProductHandler}
              holdIssue={holdIssueHandler}
              retrieveRequistion={retrieveRequistionHandler}
              checkRequistion={checkRequistionHeld}
              state={state}
              database={productDatabase}
              show={state.modalPreview}
              store={state.storeProducts}
              token={token}
              location={$location?.id}
              unit={unit?.id}
              clinic={clinic?.id}
            />
          )
        ) : state.previewComponent ? (
          state.issueLoading ? (
            <Spinner />
          ) : (
            <IssuePreviewComponent
              products={state.selectedRequistion?.products || []}
              unit={state.selectedRequistion?.unit}
              location={state.selectedRequistion?.location}
              show={state.modalPreview}
              setState={setState}
              state={state}
              mainLocation={$location}
              mainUnit={unit}
              token={token}
              issueRequistion={issueRequistionHandler}
              siv={state.selectedRequistion.siv}
              clinic={clinic}
              socket={props.socket}
            />
          )
        ) : (
          <div className={classes.requistionList}>
            <h3>REQUISTION LIST</h3>
            {state.requistions.length ? (
              state.requistions.map((requistion) => (
                <div
                  className={classes.requistion}
                  key={requistion._id}
                  onClick={() =>
                    storeProductHandler(
                      requistion._id,
                      setState,
                      state,
                      productDatabase
                    )
                  }
                >
                  <div className={classes.requistionLocation}>
                    <div>{requistion.location?.name}</div>
                    <div>
                      REQUISTION FROM {requistion.unit?.name} PHARMACY,{" "}
                      {requistion.clinic?.name}
                    </div>
                  </div>
                  <div className={classes.requistionInformation}>
                    <div> PRODUCTS : {requistion.numberOfProducts}</div>
                    <div>SIV : {requistion.siv} </div>
                    <div>
                      {Intl.DateTimeFormat("en-GB", {
                        dateStyle: "full",
                      }).format(Date.parse(requistion.createdAt))}
                      ,{" "}
                      {Intl.DateTimeFormat("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(Date.parse(requistion.createdAt))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={classes.emptyRequistion}>
                There is no current requistion
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default IssuedProducts;
