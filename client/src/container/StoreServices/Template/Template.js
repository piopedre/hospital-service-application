import React, { memo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  clearMessage,
  clearProductDatabaseError,
  initProductDatabase,
} from "../../../store";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import Message from "../../../components/UI/Message/Message";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import { Navigate } from "react-router-dom";
const ExchangeProducts = memo((props) => {
  const dispatch = useDispatch();

  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const unit = JSON.parse(sessionStorage.getItem("unit"));
  const clinic = JSON.parse(sessionStorage.getItem("clinic"));
  const mainMessage = useSelector((state) => state.messenger.message);
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
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
    props.socket.on("requistion_message", (message) => {
      const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
      if (unitName === "STORE") {
        setTimeout(() => {
          clearMessageHandler();
        }, 4000);
        mainMessageHandler(`${message.message}`);
      }
    });
    props.socket.on("message received", (newMessageReceived) => {
      setTimeout(() => {
        clearMessageHandler();
      }, 4000);
      if (!newMessageReceived.chat.isGroupChat) {
        mainMessageHandler(
          `New Message from ${newMessageReceived.sender.firstName} ${newMessageReceived.sender.lastName}`
        );
      } else {
        mainMessageHandler(
          `Message from ${newMessageReceived.sender.firstName} ${newMessageReceived.sender.lastName} in ${newMessageReceived.chat.name}`
        );
      }
    });
    return () => {
      props.socket.off("message received");
      props.socket.off("requistion");
    };
  }, [props.socket]);
  return (
    <div>
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
      ExchangeProducts
    </div>
  );
});

export default ExchangeProducts;
// TEMPLATE
