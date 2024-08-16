import classes from "./StoreDashboard.module.css";
import Carousel from "../../../components/UI/Carousel/Carousel";
import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import {
  initStoreVisualization,
  clearMessage,
  sendMessage,
} from "../../../store";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Message from "../../../components/UI/Message/Message";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import { getDataAnalysis } from "../../../Utility/storeServices/storeDashboard";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const StoreDashboard = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    requistions: [],
    supplies: [],
    loading: false,
  });
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const userData = JSON.parse(sessionStorage.getItem("id"));
  const mainMessage = useSelector((state) => state.messenger.message);
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);

  // DISPATCH FUNCTIONS
  const initStoreDashboardHandler = useCallback(
    (token, setState, socket) =>
      dispatch(initStoreVisualization(token, setState, socket)),
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
    if (isAuthenticated) {
      props.socket.emit("setup", userData);
      // Here is the code for all store Places
      storeNotificationMessenger(
        props.socket,
        mainMessageHandler,
        clearMessageHandler,
        dispatch
      );
    }
  }, [props.socket]);
  useEffect(() => {
    initStoreDashboardHandler(token, setState, props.socket);
  }, []);

  const graphData = getDataAnalysis(state);
  // MAIN FUNCTIONALITY
  const links = graphData.map((_, i) => (
    <a
      key={i}
      href={`#slide${i}`}
    ></a>
  ));

  const slides = graphData.map((slide, i) =>
    state.loading ? (
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
        data={slide.data}
        id={`slide${i}`}
      />
    )
  );

  return (
    <div className={classes.Slider}>
      <ChatMessenger message={mainMessage} />
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
      {state.loading ? (
        <Spinner />
      ) : (
        <Fragment>
          {!graphData.length ? (
            <div>
              <Carousel data={[]} />
            </div>
          ) : (
            <Fragment>
              <div className={classes.Link_Container}>{links}</div>
              <div className={classes.Carousel_Container}>{slides}</div>
            </Fragment>
          )}
        </Fragment>
      )}
    </div>
  );
};

export default StoreDashboard;
