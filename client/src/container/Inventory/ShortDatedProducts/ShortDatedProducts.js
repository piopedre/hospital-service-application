import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  clearMessage,
  getPotentialExpiries,
} from "../../../store";

import Message from "../../../components/UI/Message/Message";
import { Navigate } from "react-router-dom";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import ProductListContainer from "../../../components/ProductListContainer/ProductListContainer";
import classes from "./ShortDatedProducts.module.css";
import { storeNotificationMessenger } from "../../../Utility/general/general";

const ShortDatedProducts = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    form: false,
    loading: false,
    productList: [],
    duration: "A MONTH",
  });
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  const token = JSON.parse(sessionStorage.getItem("token"));
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
  const getPotentialExpiriesHandler = useCallback(
    (token, location, unit, clinic, duration, setState) =>
      dispatch(
        getPotentialExpiries(token, location, unit, clinic, duration, setState)
      ),
    [dispatch]
  );
  const filterShortDatedHandler = (e) => {
    setState((prevState) => {
      return {
        ...prevState,
        form: false,
      };
    });

    const form = Object.fromEntries(new FormData(e.target).entries());
    getPotentialExpiriesHandler(
      token,
      $location,
      unit,
      clinic,
      form.duration,
      setState
    );
  };
  const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);
  useEffect(() => {
    getPotentialExpiriesHandler(
      token,
      $location,
      unit,
      clinic,
      "MONTH",
      setState
    );
  }, []);
  return (
    <div className={classes.container}>
      <Message
        message={message}
        error={errorMessage}
      />
      {!isAuthenticated && !token && (
        <Navigate
          replace={true}
          to='/pharma-app/login'
        />
      )}
      {state.form && (
        <form
          className={classes.form}
          onSubmit={(e) => filterShortDatedHandler(e)}
        >
          <span>FILTER BY DATE</span>
          <Input
            inputType='select'
            options={[
              "MONTH",
              "2 MONTHS",
              "3 MONTHS",
              "6 MONTHS",
              "A YEAR",
              "2 YEARS",
            ]}
            config={{
              name: "duration",
              value: state.duration,
            }}
            title='TIME DURATION'
            changed={(e) =>
              setState((prevState) => {
                return {
                  ...prevState,
                  duration: e.target.value,
                };
              })
            }
          />
          <Button
            config={{
              className: classes.confirm,
              type: "submit",
            }}
          >
            SUBMIT
          </Button>
        </form>
      )}

      <ProductListContainer
        state={state}
        setState={setState}
        unit={unitName}
      />
    </div>
  );
};

export default ShortDatedProducts;
