import React, { Fragment, useEffect, useState, useCallback } from "react";
import RequistionItem from "../../../components/RequistionItem/RequistionItem";
import { useSelector, useDispatch } from "react-redux";
import Message from "../../../components/UI/Message/Message";
import { Navigate } from "react-router-dom";
import { initRequistions, sendMessage, clearMessage } from "../../../store";
import Spinner from "../../../components/UI/Spinner/Spinner";
import IssuePreviewComponent from "../../../components/IssuePreviewComponent/IssuePreviewComponent";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const Requistions = React.memo((props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    requistions: [],
    loading: true,
    selectedRequistion: [],
    previewComponent: false,
  });
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const mainMessage = useSelector((state) => state.messenger.message);
  const initRequistionslHandler = useCallback(
    (token, setState, location, unit) =>
      dispatch(initRequistions(token, setState, location, unit)),
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
    initRequistionslHandler(token, setState, $location, unit);
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

      {state.previewComponent ? (
        <IssuePreviewComponent
          products={state.selectedRequistion.products}
          unit={state.selectedRequistion.unit}
          location={state.selectedRequistion.location}
          setState={setState}
          siv={state.selectedRequistion.siv}
          requistionsRoute
        />
      ) : (
        (state.loading && <Spinner />) || (
          <RequistionItem
            state={state}
            setState={setState}
            requistions
          />
        )
      )}
    </Fragment>
  );
});

export default Requistions;
