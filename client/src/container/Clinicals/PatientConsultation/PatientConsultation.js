import React, { memo, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  clearMessage,
  initProductDatabase,
  clearProductDatabaseError,
} from "../../../store";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import Message from "../../../components/UI/Message/Message";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import Container from "../../../components/Container/Container";
import PatientContainer from "../../../components/PatientContainer/PatientContainer";
import { Navigate } from "react-router-dom";
import classes from "./PatientConsultation.module.css";
const PatientConsultation = memo((props) => {
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
      <Container>
        <PatientContainer />
        <div className={classes.subHeadings}>
          <div className={classes.subHeading}>Profile</div>
          <div className={classes.subHeading}>Clinical Record</div>
          <div className={classes.desktopOnly}>Lab Investigations</div>
          <div className={classes.desktopOnly}>Prescriptions</div>
          <div>
            <div className={classes.subHeading}>. . .</div>
            <ul className={classes.otherList}>
              <li>Lab Investigations</li>
              <li>Prescriptions</li>
            </ul>
          </div>
        </div>
        <div></div>
      </Container>
    </div>
  );
});

export default PatientConsultation;
// TEMPLATE
