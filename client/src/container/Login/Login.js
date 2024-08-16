import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  Fragment,
} from "react";
import LoginComponent from "../../components/LoginComponent/LoginComponent";
import UsernameLoginComponent from "../../components/LoginComponent/UsernameLoginComponent/UsernameLoginComponent";
import {
  getDepartments,
  getUserLogin,
  authenticating,
  clearLoginError,
} from "../../store";

// Link import
import { Navigate } from "react-router-dom";
// Loader import
import Loader from "../../components/UI/Loader/Loader";
// Redux
import { useSelector, useDispatch } from "react-redux";
import Message from "../../components/UI/Message/Message";

const Login = () => {
  const dispatch = useDispatch();
  const departmentRef = useRef();
  // STATE VARIABLES
  const [state, setState] = useState({
    loading: false,
    departments: [],
    institution: null,
    departmentId: "",
    department: "",
    user: null,
    clinics: [],
    clinic: "",
    locations: [],
    location: "",
    units: [],
    unit: "",
  });
  const { departments } = state;
  // REDUX STATE VARIABLES
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const unit = JSON.parse(sessionStorage.getItem("unit"));
  const loading = useSelector((state) => state.login.loading);
  const error = useSelector((state) => state.login.error);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const message = useSelector((state) => state.addProduct.message);
  // REDUX FUNCTION

  const authenticationHandler = useCallback(
    (e, state) => dispatch(authenticating(e, state)),
    [dispatch]
  );
  const clearErrorHandler = useCallback(
    () => dispatch(clearLoginError()),
    [dispatch]
  );
  const getDepartmentsHandler = useCallback(
    (setState) => dispatch(getDepartments(setState)),
    [dispatch]
  );
  const getUsernameMethodHandler = useCallback(
    (e, setState, state) => dispatch(getUserLogin(e, setState, state)),
    [dispatch]
  );
  useEffect(() => {
    if (!departments.length) {
      getDepartmentsHandler(setState);
    } else {
      const department = state.departments.find(
        (dep) => dep.name === departmentRef.current?.value
      );
      setState((prevState) => {
        return {
          ...prevState,
          department: departmentRef.current?.value,
          departmentId: department?._id,
        };
      });
    }
  }, [departments.length]);

  return (
    <Fragment>
      {isAuthenticated && unit?.name !== "STORE" && (
        <Navigate
          to='/pharma-app/dashboard'
          replace={true}
        />
      )}
      {isAuthenticated && unit?.name === "STORE" && (
        <Navigate
          to='/pharma-app/store-dashboard'
          replace={true}
        />
      )}
      <Message
        message={message}
        error={errorMessage}
      />

      {state.loading || loading ? (
        <Loader />
      ) : state.user ? (
        <Fragment>
          {error.message ? (
            <p
              style={{
                textTransform: "uppercase",
                color: "#c41a1a",
                margin: "0.5rem 0",
                fontWeight: "bold",
              }}
            >
              {error.message}
            </p>
          ) : null}
          <LoginComponent
            department={state.department}
            userLogin={authenticationHandler}
            state={state}
            setState={setState}
            error={error.message}
            clearError={clearErrorHandler}
          />
        </Fragment>
      ) : (
        <UsernameLoginComponent
          departments={state.departments}
          departmentRef={departmentRef}
          setState={setState}
          department={state.department}
          state={state}
          getUsername={getUsernameMethodHandler}
        />
      )}
    </Fragment>
  );
};

export default React.memo(Login);
