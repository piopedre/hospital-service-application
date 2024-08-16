import React, { Fragment, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  initReceiveRequistion,
  receiveRequistionMethod,
  clearMessage,
  sendMessage,
} from "../../../store";
import Message from "../../../components/UI/Message/Message";
import Spinner from "../../../components/UI/Spinner/Spinner";
import IssuePreviewComponent from "../../../components/IssuePreviewComponent/IssuePreviewComponent";
import RequistionItem from "../../../components/RequistionItem/RequistionItem";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import RequistionMainComponent from "../Requistion/RequistionMainComponent";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const ReceiveRequistion = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    requistions: [],
    previewComponent: false,
    loading: false,
    receiveLoading: false,
    modalPreview: false,
    selectedRequistion: null,
    requistionComponent: false,
  });
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const unit = JSON.parse(sessionStorage.getItem("unit"));
  const clinic = JSON.parse(sessionStorage.getItem("clinic"));
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const mainMessage = useSelector((state) => state.messenger.message);
  const initReceiveRequistionHandler = useCallback(
    (token, setState, location, unit, clinic) =>
      dispatch(initReceiveRequistion(token, setState, location, unit, clinic)),
    [dispatch]
  );
  const receiveRequistionHandler = useCallback(
    (token, setState, state, location, unit, clinic) =>
      dispatch(
        receiveRequistionMethod(token, setState, state, location, unit, clinic)
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
    initReceiveRequistionHandler(
      token,
      setState,
      $location?.id,
      unit?.id,
      clinic?.id
    );
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
    <Fragment>
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

      {(state.loading && <Spinner />) ||
        (state.previewComponent ? (
          state.receiveLoading ? (
            <Spinner />
          ) : (
            <IssuePreviewComponent
              products={state.selectedRequistion.products}
              unit={state.selectedRequistion.unit}
              location={state.selectedRequistion.location}
              mainLocation={$location}
              token={token}
              mainUnit={unit}
              clinic={clinic}
              issueRequistion={receiveRequistionHandler}
              setState={setState}
              state={state}
              show={state.modalPreview}
              siv={state.selectedRequistion.siv}
              receive
            />
          )
        ) : state.requistionComponent ? (
          <RequistionMainComponent
            setState={setState}
            socket={props.socket}
          />
        ) : (
          <RequistionItem
            state={state}
            setState={setState}
          />
        ))}
    </Fragment>
  );
};

export default ReceiveRequistion;
