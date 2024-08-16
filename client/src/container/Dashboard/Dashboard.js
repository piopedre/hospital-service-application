import classes from "./Dashboard.module.css";
import Carousel from "../../components/UI/Carousel/Carousel";
import React, { Fragment, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  initDashboard,
  clearError,
  sendMessage,
  clearMessage,
} from "../../store/index";
import Message from "../../components/UI/Message/Message";
import ChatMessenger from "../../components/UI/ChatMessenger/ChatMessenger";
import Spinner from "../../components/UI/Spinner/Spinner";
import ErrorHandler from "../../hoc/ErrorHandler/ErrorHandler";
import { storeNotificationMessenger } from "../../Utility/general/general";
const Dashboard = (props) => {
  const dispatch = useDispatch();
  const slideList = useSelector((state) => state.dashboard.slides);
  const loading = useSelector((state) => state.dashboard.loading);
  const error = useSelector((state) => state.dashboard.error);

  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);

  const token = JSON.parse(sessionStorage.getItem("token"));
  const userData = JSON.parse(sessionStorage.getItem("id"));
  const mainMessage = useSelector((state) => state.messenger.message);

  // DISPATCH FUNCTIONS
  const clearErrorHandler = useCallback(
    () => dispatch(clearError()),
    [dispatch]
  );
  const initDashboardHandler = useCallback(
    (socket) => dispatch(initDashboard(socket)),
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
  // USE EFFECT

  useEffect(() => {
    props.socket.emit("setup", userData);
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);
  useEffect(() => {
    initDashboardHandler(props.socket);
  }, []);

  // MAIN FUNCTIONALITY
  const links = slideList.map((_, i) => (
    <a
      key={i}
      href={`#slide${i}`}
    ></a>
  ));
  const slides = slideList.map((slide, i) =>
    loading ? (
      <div
        className={classes.Error_Carousel}
        key={i}
      >
        <Spinner />
      </div>
    ) : (
      <Carousel
        key={i}
        plotTitle={slide.title}
        data={[slide.data]}
        id={`slide${i}`}
      />
    )
  );
  return (
    <div className={classes.slider}>
      {error.message && (
        <ErrorHandler
          error={error.message}
          status={error.status}
          clearError={clearErrorHandler}
        />
      )}
      {!isAuthenticated && !token && (
        <Navigate
          replace={true}
          to='/pharma-app/log-out'
        />
      )}
      <Message
        message={message}
        error={errorMessage}
      />
      <ChatMessenger message={mainMessage} />
      <div className={classes.Link_Container}>{links}</div>
      <div className={classes.Carousel_Container}>{slides}</div>
    </div>
  );
};

export default React.memo(Dashboard);
