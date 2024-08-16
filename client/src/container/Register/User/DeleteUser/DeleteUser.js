import React, { memo, useCallback, useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../../../components/UI/Message/Message";
import UserComponent from "../../../../components/InstitutionComponent/UserComponent/UserComponent";
import { getUsersInstitutionRequest, deleteUser } from "../../../../store";
import classes from "./DeleteUser.module.css";
import Modal from "../../../../components/Modal/Modal";
import Button from "../../../../components/UI/Button/Button";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import { Navigate } from "react-router-dom";
const DeleteUser = memo((props) => {
  const dispatch = useDispatch();
  const userRef = useRef();
  const [state, setState] = useState({
    users: [],
    search: "",
    id: "",
    userName: "",
    loading: false,
    deleteModal: false,
  });
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));

  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const getUsersInstitutionHandler = useCallback(
    (token, state, setState) =>
      dispatch(getUsersInstitutionRequest(token, state, setState)),
    [dispatch]
  );
  const deleteUserHandler = useCallback(
    (setState, token, state) => dispatch(deleteUser(setState, token, state)),
    [dispatch]
  );
  const { search } = state;
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
        show={state.deleteModal}
        modalClosed={() =>
          setState((prevState) => {
            return {
              ...prevState,
              deleteModal: false,
            };
          })
        }
      >
        <div className={classes.deleteModal}>
          <div>{state.userName} will be deleted permanently</div>
          <div>Are you sure, you want to continue ?</div>
          <Button
            config={{ className: classes.hold }}
            changed={() =>
              setState((prevState) => {
                return {
                  ...prevState,
                  deleteModal: false,
                };
              })
            }
          >
            CANCEL
          </Button>
          <Button
            config={{ className: classes.cancel }}
            changed={() => deleteUserHandler(setState, token, state)}
          >
            DELETE
          </Button>
        </div>
      </Modal>

      <UserComponent
        users={state.users}
        userRef={userRef}
        search={state.search}
        setState={setState}
        loading={state.loading}
        delete
      />
    </div>
  );
});

export default DeleteUser;
