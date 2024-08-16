import React, { useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Input from "../../components/UI/Input/Input";
import Button from "../../components/UI/Button/Button";
import classes from "./InitInstitution.module.css";
import Spinner from "../../components/UI/Spinner/Spinner";
import PharmacyLogo from "../../components/PharmacyLogo/PharmacyLogo";
import Message from "../../components/UI/Message/Message";
import { registerInstitution } from "../../store";
const InitInstitution = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
    institution: false,
  });
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const message = useSelector((state) => state.addProduct.message);
  const registerInstitutionHandler = useCallback(
    (e, setState) => dispatch(registerInstitution(e, setState)),
    [dispatch]
  );

  return (
    <div className={classes.container}>
      <h3>REGISTER AN INSTITUTION</h3>
      <Message
        message={message}
        error={errorMessage}
      />

      {state.loading ? (
        <Spinner />
      ) : (
        <form
          className={classes.initContainer}
          onSubmit={(e) => registerInstitutionHandler(e, setState)}
        >
          <PharmacyLogo />
          <Input
            label='NAME OF INSTITUTION'
            config={{
              placeholder: "ENTER NAME OF INSTUTUTION",
              required: true,
              autoFocus: true,
              name: "name",
            }}
          />
          <Input
            label='USERNAME'
            config={{
              placeholder: "USERNAME",
              required: true,
              name: "username",
            }}
          />
          <Input
            label='CITY'
            config={{ placeholder: "BENIN CITY", required: true, name: "city" }}
          />
          <Input
            label='STATE'
            config={{ placeholder: "EDO STATE", required: true, name: "state" }}
          />
          <Input
            label='PASSWORD'
            config={{
              placeholder: "PASSWORD",
              required: true,
              name: "password",
              type: "password",
            }}
          />
          <Input
            label=' CONFIRM PASSWORD'
            config={{
              placeholder: " CONFIRM PASSWORD",
              required: true,
              name: "confirmPassword",
              type: "password",
            }}
          />
          <Button config={{ className: classes.confirm }}>SUBMIT</Button>
        </form>
      )}
    </div>
  );
};

export default InitInstitution;
