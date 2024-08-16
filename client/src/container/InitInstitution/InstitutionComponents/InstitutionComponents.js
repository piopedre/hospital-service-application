import React, { Fragment, useCallback, useEffect, useState } from "react";
import classes from "./InstitutionComponents.module.css";
import Message from "../../../components/UI/Message/Message";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Spinner from "../../../components/UI/Spinner/Spinner";
import {
  componentMethod,
  getDepartmentsMethod,
  addUnitMethod,
} from "../../../store";
import InstitutionComponent from "../../../components/InstitutionComponent/InstitutionComponent";
const InstitutionComponents = () => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    links: {
      location: true,
      department: false,
    },
    loading: false,
    unitModal: false,
    departments: [],
  });
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const message = useSelector((state) => state.addProduct.message);

  const addComponentHandler = useCallback(
    (e, state, setState, token) =>
      dispatch(componentMethod(e, state, setState, token)),
    [dispatch]
  );
  const getDepartmentsHandler = useCallback(
    (token, setState) => dispatch(getDepartmentsMethod(token, setState)),
    [dispatch]
  );
  const addUnitHandler = useCallback(
    (e, setState, state, token) =>
      dispatch(addUnitMethod(e, setState, state, token)),
    [dispatch]
  );

  useEffect(() => {
    getDepartmentsHandler(token, setState);
  }, []);
  return (
    <div className={classes.container}>
      {!isAuthenticated && !token && (
        <Navigate
          to='/institution/log-out'
          replace
        />
      )}
      <Message
        message={message}
        error={errorMessage}
      />
      {state.loading ? (
        <Spinner />
      ) : (
        <div>
          <div className={classes.componentLinks}>
            <div
              onClick={() => {
                if (state.links.location) {
                  return;
                }
                setState((prevState) => {
                  return {
                    ...prevState,
                    links: {
                      location: true,
                      department: false,
                    },
                  };
                });
              }}
              className={classes.componentLink}
            >
              ADD LOCATION
            </div>
            <div
              className={classes.componentLink}
              onClick={() => {
                if (state.links.department) {
                  return;
                }
                setState((prevState) => {
                  return {
                    ...prevState,
                    links: {
                      location: false,
                      department: true,
                    },
                  };
                });
              }}
            >
              ADD DEPARTMENT
            </div>
          </div>
          <div>
            <InstitutionComponent
              state={state}
              setState={setState}
              title={state.links.location ? "LOCATION" : "DEPARTMENT"}
              department={state.links.department}
              addComponentHandler={addComponentHandler}
              token={token}
              addUnitHandler={addUnitHandler}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default InstitutionComponents;
