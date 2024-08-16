import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, clearMessage, addFeedback } from "../../../store";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import Message from "../../../components/UI/Message/Message";
import classes from "./Feedback.module.css";
import { Navigate } from "react-router-dom";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const Feedback = memo((props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
  });
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const mainMessage = useSelector((state) => state.messenger.message);
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);

  const mainMessageHandler = useCallback(
    (message) => dispatch(sendMessage(message)),
    [dispatch]
  );
  const clearMessageHandler = useCallback(
    () => dispatch(clearMessage()),
    [dispatch]
  );
  const addFeedbackHandler = useCallback(
    (e, token, setState, location, unit, clinic) =>
      dispatch(addFeedback(e, token, setState, location, unit, clinic)),
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
    <div className={classes.container}>
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

      {state.loading ? (
        <Spinner />
      ) : (
        <form
          className={classes.feedback}
          onSubmit={(e) =>
            addFeedbackHandler(e, token, setState, $location, unit, clinic)
          }
        >
          <h4>Product and Services Feedback</h4>
          <Input
            config={{ name: "name", required: true, autoFocus: true }}
            label='NAME'
          />
          <Input
            config={{ name: "subject", required: true }}
            label={"SUBJECT"}
          />
          <Input
            config={{ name: "body", required: true }}
            label={"BODY"}
            inputType='text-area'
          />
          <Button config={{ className: classes.confirm }}>SUBMIT</Button>
        </form>
      )}
    </div>
  );
});

export default Feedback;
// TEMPLATE
