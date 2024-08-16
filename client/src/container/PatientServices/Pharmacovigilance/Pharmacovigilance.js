import React, { Fragment, useEffect, useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, clearMessage } from "../../../store";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import Message from "../../../components/UI/Message/Message";
import PharmaForm from "../../../components/PharmacovigilanceForm/PharmacovigilanceForm";
import Button from "../../../components/UI/Button/Button";
import classes from "./Pharmacovigilance.module.css";
import { Navigate } from "react-router-dom";
import { validatePharmacovigilanceForm } from "../../../store/actions/action/patientServices/pharmacovigilanceAction";
import PharmacovigilancePreview from "../../../components/PharmacovigilanceForm/PharmacovigilancePreview/PharmacovigilancePreview";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const Pharmacovigilance = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
    preview: false,
    form: null,
    concomitantMedicines: [
      {
        genericName: "",
        dosage: "",
        route: "",
        dateStarted: "",
        dateStopped: "",
        reason: "",
      },
    ],
  });
  const token = JSON.parse(sessionStorage.getItem("token"));
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const mainMessage = useSelector((state) => state.messenger.message);
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const mainMessageHandler = useCallback(
    (message) => dispatch(sendMessage(message)),
    [dispatch]
  );
  const validatePharmacovigilanceFormHandler = useCallback(
    (e, token, state, setState) =>
      dispatch(validatePharmacovigilanceForm(e, token, state, setState)),
    [dispatch]
  );
  const clearMessageHandler = useCallback(
    () => dispatch(clearMessage()),
    [dispatch]
  );
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
      <Message
        message={message}
        error={errorMessage}
      />
      <ChatMessenger message={mainMessage} />
      {!isAuthenticated && !token && (
        <Navigate
          replace={true}
          to='/pharma-app/log-out'
        />
      )}
      {state.loading ? (
        <Spinner />
      ) : state.preview ? (
        <div>
          <PharmacovigilancePreview state={state} />
          <Button
            config={{
              className: classes.closeBtn,
            }}
            changed={() =>
              setState((prevState) => {
                return {
                  ...prevState,
                  preview: false,
                  form: null,
                  concomitantMedicines: [],
                };
              })
            }
          >
            ✕
          </Button>
        </div>
      ) : (
        <PharmaForm
          state={state}
          setState={setState}
          validateForm={validatePharmacovigilanceFormHandler}
          token={token}
        />
      )}
    </Fragment>
  );
};

export default Pharmacovigilance;
