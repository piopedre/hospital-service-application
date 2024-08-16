import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  clearMessage,
  getNotificationMethod,
  setNotificationMethod,
} from "../../store";
import ChatMessenger from "../../components/UI/ChatMessenger/ChatMessenger";
import Message from "../../components/UI/Message/Message";
import { Navigate } from "react-router-dom";
import classes from "./Notification.module.css";
import NotificationItem from "../../components/NotificationItem/NotificationItem";
import { storeNotificationMessenger } from "../../Utility/general/general";
const Notification = memo((props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
    notifications: [],
  });
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const mainMessage = useSelector((state) => state.messenger.message);
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const notificationList = useSelector(
    (state) => state.navigation.authenticatedLinks[1].notification
  );

  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;

  const mainMessageHandler = useCallback(
    (message) => dispatch(sendMessage(message)),
    [dispatch]
  );
  const clearMessageHandler = useCallback(
    () => dispatch(clearMessage()),
    [dispatch]
  );
  const getNotificationMethodHandler = useCallback(
    (token, object) => dispatch(getNotificationMethod(token, object)),
    [dispatch]
  );
  const setNotificationMethodHandler = useCallback(
    (token, id, setState, object) =>
      dispatch(setNotificationMethod(token, id, setState, object)),
    [dispatch]
  );
  const { notifications } = state;
  const length = notifications.length;
  useEffect(() => {
    getNotificationMethodHandler(token, {
      unit,
      location: $location,
      clinic,
    });
  }, []);
  useEffect(() => {
    if (length) {
      notifications.forEach((id) => {
        setNotificationMethodHandler(token, id, setState, {
          location: $location,
          unit,
          clinic,
        });
      });
    }

    // test this
  }, [length]);

  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
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
      <div className={classes.notifyCtn}>
        <div className={classes.mainHeadings}>
          <div className={classes.headings}>
            <div className={classes.header}>
              <h3>Notifications</h3>
            </div>
            <div
              className={classes.allRead}
              onClick={() =>
                setState((prevState) => {
                  return {
                    ...prevState,
                    notifications: notificationList.map((notify) => notify._id),
                  };
                })
              }
            >
              Mark all as read
            </div>
          </div>
          <div className={classes.minHeadings}>
            <span
              className={[classes.notificationNavigators, classes.active].join(
                " "
              )}
            >
              All{" "}
              <span className={classes.notificationNumber}>
                {notificationList.length}
              </span>
            </span>
          </div>
        </div>

        <div className={classes.notificationList}>
          {notificationList.map((notification) => (
            <NotificationItem
              key={notification._id}
              id={notification._id}
              type={notification.type}
              message={notification.message}
              time={notification.createdAt}
              marked={true}
              setState={setState}
              notifications={state.notifications}
            />
          ))}
        </div>
      </div>
    </div>
  );
});

export default Notification;
