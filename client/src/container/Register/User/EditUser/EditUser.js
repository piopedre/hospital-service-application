import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../../../components/UI/Message/Message";
import UserComponent from "../../../../components/InstitutionComponent/UserComponent/UserComponent";
import {
  getUserRoleMethod,
  getDepartmentsMethod,
  getUsersInstitutionRequest,
  activateUserMethod,
  editUserMethod,
  deactivateUserMethod,
} from "../../../../store";
import { Navigate } from "react-router-dom";
import { editUserValid } from "../../../../Utility/institution/initInstitution";
import Button from "../../../../components/UI/Button/Button";
import classes from "./EditUser.module.css";
import RegisterUserComponent from "../../../../components/RegisterUserComponent/RegisterUserComponent";
import registerClasses from "../../Register.module.css";
import Modal from "../../../../components/Modal/Modal";
import Spinner from "../../../../components/UI/Spinner/Spinner";
const EditUser = memo((props) => {
  const dispatch = useDispatch();
  const departmentRef = useRef(null);
  const userRoleRef = useRef(null);
  const [state, setState] = useState({
    users: [],
    loading: false,
    search: "",
    selectedUser: null,
    edit: false,
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    retypePassword: "",
    departments: [],
    department: "",
    departmentId: "",
    userRoles: [],
    userRole: "",
    userRoleId: "",
    activationModal: false,
    deactivation: false,
  });
  const userRef = useRef();
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));

  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const getUsersInstitutionHandler = useCallback(
    (token, state, setState) =>
      dispatch(getUsersInstitutionRequest(token, state, setState)),
    [dispatch]
  );
  const getDepartmentsHandler = useCallback(
    (token, setState) => dispatch(getDepartmentsMethod(token, setState)),
    [dispatch]
  );
  const getUserRoleMethodHandler = useCallback(
    (token, dep, setState) => dispatch(getUserRoleMethod(token, dep, setState)),
    [dispatch]
  );
  const activateUserMethodHandler = useCallback(
    (setState, token, state) =>
      dispatch(activateUserMethod(setState, token, state)),
    [dispatch]
  );
  const deactivateUserMethodHandler = useCallback(
    (setState, token, state) =>
      dispatch(deactivateUserMethod(setState, token, state)),
    [dispatch]
  );
  const editUserMethodHandler = useCallback(
    (e, setState, token, state) =>
      dispatch(editUserMethod(e, setState, token, state)),
    [dispatch]
  );

  const { departments, department, userRoles, search } = state;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search === userRef?.current?.value) {
        // send getUsers Request //
        getUsersInstitutionHandler(token, state, setState);
      } else {
        clearTimeout(timer);
      }
    }, 500);
  }, [search, userRef]);
  const length = departments.length;
  useEffect(() => {
    if (!length) {
      getDepartmentsHandler(token, setState);
      getUserRoleMethodHandler(token, setState);
    } else {
      if (department) {
        const selectedDepartment = state.departments.find(
          (dep) => dep.name === departmentRef.current?.value
        );
        setState((prevState) => {
          return {
            ...prevState,
            departmentId: selectedDepartment?._id,
            department: selectedDepartment?.name,
          };
        });
      }
    }
  }, [length, department]);
  useEffect(() => {
    if (userRoles.length) {
      setState((prevState) => {
        const userRole = userRoles.find(
          (role) => role.name === userRoleRef.current?.value
        );
        return {
          ...prevState,
          userRoleId: userRole?._id,
          userRole: userRole?.name,
        };
      });
    }
  }, [userRoles.length]);

  return (
    <div>
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
      <Modal
        show={state.activationModal}
        modalClosed={() =>
          setState((prevState) => {
            return {
              ...prevState,
              activationModal: false,
            };
          })
        }
      >
        <div className={classes.modalMessage}>
          are you sure, you want to activate this user
        </div>
        <Button
          config={{ className: classes.cancel }}
          changed={() =>
            setState((prevState) => {
              return {
                ...prevState,
                activationModal: false,
              };
            })
          }
        >
          CANCEL
        </Button>
        <Button
          config={{ className: classes.hold }}
          changed={
            state.deactivation
              ? () => deactivateUserMethodHandler(setState, token, state)
              : () => activateUserMethodHandler(setState, token, state)
          }
        >
          CONFIRM
        </Button>
      </Modal>
      {state.loading ? (
        <Spinner />
      ) : state.edit ? (
        <div className={classes.editContainer}>
          <Button
            config={{ className: classes.closeBtn }}
            changed={() =>
              setState((prevState) => {
                return {
                  ...prevState,
                  edit: false,
                };
              })
            }
          >
            ✕
          </Button>
          <RegisterUserComponent
            state={state}
            setState={setState}
            classes={registerClasses}
            departmentRef={departmentRef}
            userRoleRef={userRoleRef}
            registerUserHandler={editUserMethodHandler}
            getUserRoleMethodHandler={getUserRoleMethodHandler}
            token={token}
            edit
            disabled={editUserValid(state, state.selectedUser)}
            requiredEdit={false}
          />
          <div className={classes.clearError}>
            {(state.selectedUser.signError > 4 ||
              !state.selectedUser.status) && (
              <div className={classes.signError}>
                <div>ACTIVATE USER </div>
                <Button
                  config={{ className: classes.hold }}
                  changed={() =>
                    setState((prevState) => {
                      return {
                        ...prevState,
                        activationModal: true,
                      };
                    })
                  }
                >
                  ACTIVATE
                </Button>
              </div>
            )}
          </div>
          <div className={classes.clearError}>
            {state.selectedUser.status && (
              <div className={classes.signError}>
                <div>DEACTIVATE USER </div>
                <Button
                  config={{ className: classes.hold }}
                  changed={() =>
                    setState((prevState) => {
                      return {
                        ...prevState,
                        activationModal: true,
                        deactivation: true,
                      };
                    })
                  }
                >
                  DEACTIVATE USER
                </Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <UserComponent
          users={state.users}
          userRef={userRef}
          search={state.search}
          setState={setState}
          loading={state.loading}
        />
      )}
    </div>
  );
});

export default EditUser;
