import React, { useCallback, useEffect, useState, useRef } from "react";
import { Navigate } from "react-router-dom";
import Message from "../../components/UI/Message/Message";
import Spinner from "../../components/UI/Spinner/Spinner";
import classes from "./Register.module.css";
import RegisterUserComponent from "../../components/RegisterUserComponent/RegisterUserComponent";
import {
  getDepartmentsMethod,
  registerUser,
  getUserRoleMethod,
} from "../../store";
import { useDispatch, useSelector } from "react-redux";

const Register = () => {
  const dispatch = useDispatch();
  const departmentRef = useRef(null);
  const userRoleRef = useRef(null);
  const [state, setState] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    retypePassword: "",
    loading: false,
    departments: [],
    department: "",
    departmentId: "",
    userRoles: [],
    userRole: "",
    userRoleId: "",
  });
  const { departments, userRoles } = state;
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const loading = useSelector((state) => state.register.loading);
  const registerUserHandler = useCallback(
    (e, state, setState, token) =>
      dispatch(registerUser(e, state, setState, token)),
    [dispatch]
  );
  const getDepartmentsHandler = useCallback(
    (token, setState) => dispatch(getDepartmentsMethod(token, setState)),
    [dispatch]
  );
  const getUserRoleMethodHandler = useCallback(
    (token, setState) => dispatch(getUserRoleMethod(token, setState)),
    [dispatch]
  );
  useEffect(() => {
    if (!departments.length) {
      getDepartmentsHandler(token, setState);
      getUserRoleMethodHandler(token, setState);
    } else {
      const department = state.departments.find(
        (dep) => dep.name === departmentRef.current?.value
      );
      setState((prevState) => {
        return {
          ...prevState,
          departmentId: department._id,
          department: department.name,
        };
      });
    }
  }, [departments.length]);
  useEffect(() => {
    if (userRoles.length) {
      setState((prevState) => {
        const userRole = userRoles.find(
          (role) => role.name === userRoleRef.current?.value
        );
        return {
          ...prevState,
          userRoleId: userRole._id,
          userRole: userRole.name,
        };
      });
    }
  }, [userRoles.length]);

  return (
    <React.Fragment>
      {!isAuthenticated && !token && (
        <Navigate
          to='/institution/log-out'
          replace={true}
        />
      )}
      <Message
        message={message}
        error={errorMessage}
      />
      {loading || state.loading ? (
        <Spinner />
      ) : (
        <RegisterUserComponent
          state={state}
          setState={setState}
          classes={classes}
          departmentRef={departmentRef}
          userRoleRef={userRoleRef}
          registerUserHandler={registerUserHandler}
          getUserRoleMethodHandler={getUserRoleMethodHandler}
          token={token}
        />
      )}
    </React.Fragment>
  );
};

export default Register;
