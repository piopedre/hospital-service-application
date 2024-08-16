import React, { useState, useCallback, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../../components/UI/Message/Message";
import classes from "./InstitutionLogin.module.css";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { loginInstitution } from "../../../store";
import { Link, Navigate } from "react-router-dom";
const InstitutionLogin = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    username: "",
    password: "",
    loading: false,
    error: false,
  });
  const loginInstitutionHandler = useCallback(
    (e, setState) => dispatch(loginInstitution(e, setState)),
    [dispatch]
  );
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const message = useSelector((state) => state.addProduct.message);
  return (
    <div className={classes.container}>
      {isAuthenticated && token && (
        <Navigate
          to='/institution/components'
          replace={true}
        />
      )}
      <Message
        message={message}
        error={errorMessage}
      />
      {state.loading ? (
        <Spinner />
      ) : (
        <form
          className={classes.loginForm}
          onSubmit={(e) => loginInstitutionHandler(e, setState)}
        >
          <h3 className={classes.formTitle}>INSTITUTION LOGIN</h3>
          <Input
            config={{
              name: "username",
              required: true,
              className: state.error ? classes.error : classes.bottom,
              placeholder: "USERNAME",
              value: state.username,
            }}
            changed={(e) =>
              setState((prevState) => {
                return {
                  ...prevState,
                  [e.target.name]: e.target.value,
                  error: false,
                };
              })
            }
          />
          <div style={{ marginBottom: "20px" }}></div>
          <Input
            config={{
              name: "password",
              required: true,
              className: state.error ? classes.error : null,
              placeholder: "PASSWORD",
              type: "password",
              value: state.password,
            }}
            changed={(e) =>
              setState((prevState) => {
                return {
                  ...prevState,
                  [e.target.name]: e.target.value,
                  error: false,
                };
              })
            }
          />
          <Button
            config={{
              className: classes.confirm,
            }}
          >
            LOGIN
          </Button>
          <div>
            <Link
              className={classes.departmentLogin}
              to={"/pharma-app/login"}
              replace={true}
            >
              Department Login
            </Link>
          </div>
        </form>
      )}
    </div>
  );
};

export default InstitutionLogin;
