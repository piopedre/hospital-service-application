import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  clearMessage,
  getSuppliersMethod,
  deleteSupplierMethod,
  editSupplierMethod,
} from "../../../store";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import Message from "../../../components/UI/Message/Message";
import { Navigate } from "react-router-dom";
import { storeNotificationMessenger } from "../../../Utility/general/general";
import edit from "../../../assets/images/NavigationImages/edit.png";
import classes from "./Suppliers.module.css";
import Input from "../../../components/UI/Input/Input";
import Modal from "../../../components/Modal/Modal";
import Button from "../../../components/UI/Button/Button";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { editSupplier } from "../../../Utility/storeServices/storeServices";
const Suppliers = memo((props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
    suppliers: [],
    deleteModal: false,
    editSupplier: null,
    deleteId: null,
    name: "",
    contact: "",
  });
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const mainMessage = useSelector((state) => state.messenger.message);
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);

  const mainMessageHandler = useCallback(
    (message) => dispatch(sendMessage(message)),
    [dispatch]
  );
  const getSupplierHandler = useCallback(
    (token, setState) => dispatch(getSuppliersMethod(token, setState)),
    [dispatch]
  );
  const clearMessageHandler = useCallback(
    () => dispatch(clearMessage()),
    [dispatch]
  );
  const editSupplierMethodHandler = useCallback(
    (e, setState, supplier, token) =>
      dispatch(editSupplierMethod(e, setState, supplier, token)),
    [dispatch]
  );
  const deleteSupplierMethodHandler = useCallback(
    (id, token, setState) =>
      dispatch(deleteSupplierMethod(id, token, setState)),
    [dispatch]
  );
  useEffect(() => {
    getSupplierHandler(token, setState);
  }, []);
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
      {state.loading ? (
        <Spinner />
      ) : (
        <div>
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
              <h4>Are you sure to want to continue</h4>
              <div>
                <Button
                  config={{
                    className: classes.cancel,
                  }}
                  changed={() =>
                    setState((prevState) => {
                      return {
                        ...prevState,
                        deleteModal: false,
                      };
                    })
                  }
                >
                  NO
                </Button>
                <Button
                  config={{
                    className: classes.confirm,
                  }}
                  changed={() =>
                    deleteSupplierMethodHandler(state.deleteId, token, setState)
                  }
                >
                  YES
                </Button>
              </div>
            </div>
          </Modal>
          <Modal
            show={state.editSupplier}
            modalClosed={() =>
              setState((prevState) => {
                return {
                  ...prevState,
                  editSupplier: null,
                  name: "",
                  contact: "",
                };
              })
            }
          >
            <form
              className={classes.supplierForm}
              onSubmit={(e) =>
                editSupplierMethodHandler(
                  e,
                  setState,
                  state.editSupplier,
                  token
                )
              }
            >
              <h3>SUPPLIER INFORMATION</h3>
              <Input
                config={{
                  placeholder: "SUPPLIERS NAME",
                  value: state.name,
                  name: "name",
                }}
                label={"SUPPLIER NAME"}
                changed={(e) =>
                  setState((prevState) => {
                    return {
                      ...prevState,
                      [e.target.name]: e.target.value,
                    };
                  })
                }
              />
              <Input
                config={{
                  placeholder: "PHONE NUMBER",
                  value: state.contact,
                  name: "contact",
                }}
                changed={(e) =>
                  setState((prevState) => {
                    return {
                      ...prevState,
                      [e.target.name]: e.target.value,
                    };
                  })
                }
                label={"PHONE NUMBER"}
              />
              <Button
                config={{
                  className: classes.confirm,
                  disabled:
                    state.editSupplier?.name === state.name &&
                    state.editSupplier?.contact === state.contact,
                }}
              >
                EDIT
              </Button>
            </form>
          </Modal>
          <h4
            style={{
              textTransform: "uppercase",
            }}
          >
            Suppliers List
          </h4>

          <div className={classes.suppliers}>
            {state.suppliers.map((supplier, i) => (
              <div
                className={classes.supplierItem}
                key={supplier._id}
              >
                <div>{i + 1}</div>
                <div>{supplier.name}</div>
                <div>{supplier.contact}</div>
                <div
                  className={classes.editImage}
                  onClick={() =>
                    editSupplier(supplier._id, state.suppliers, setState)
                  }
                >
                  <img
                    src={edit}
                    className={classes.edit}
                  />
                </div>
                <button
                  className={classes.removeBtn}
                  onClick={() => {
                    setState((prevState) => {
                      return {
                        ...prevState,
                        deleteModal: true,
                        deleteId: supplier._id,
                      };
                    });
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default Suppliers;
