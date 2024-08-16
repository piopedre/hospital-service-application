import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  clearMessage,
  initProductCategories,
  deleteCategory,
  editCategoryMethod,
} from "../../../store";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import Message from "../../../components/UI/Message/Message";
import { Navigate } from "react-router-dom";
import classes from "./Category.module.css";
import Input from "../../../components/UI/Input/Input";
import Modal from "../../../components/Modal/Modal";
import Button from "../../../components/UI/Button/Button";
import edit from "../../../assets/images/NavigationImages/edit.png";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const Category = memo((props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    editForm: false,
    deleteModal: false,
    id: null,
    category: "",
  });
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const loading = useSelector((state) => state.addProduct.loading);
  const options = useSelector((state) => state.addProduct.options);
  const mainMessage = useSelector((state) => state.messenger.message);
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);

  const initProductCategoryHandler = useCallback(
    (token) => dispatch(initProductCategories(token)),
    [dispatch]
  );
  const deleteCategoryHandler = useCallback(
    (token, id) => dispatch(deleteCategory(token, id)),
    [dispatch]
  );
  const editCategoryHandler = useCallback(
    (e, token, id) => dispatch(editCategoryMethod(e, token, id)),
    [dispatch]
  );
  const mainMessageHandler = useCallback(
    (message) => dispatch(sendMessage(message)),
    [dispatch]
  );
  const clearMessageHandler = useCallback(
    () => dispatch(clearMessage()),
    [dispatch]
  );
  useEffect(() => {
    initProductCategoryHandler(token);
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
        show={state.editForm}
        modalClosed={() =>
          setState((prevState) => {
            return {
              ...prevState,
              editForm: false,
            };
          })
        }
      >
        <form
          onSubmit={(e) => {
            setState((prevState) => {
              return {
                ...prevState,
                editForm: false,
              };
            });
            editCategoryHandler(e, token, state.id);
          }}
          className={classes.editForm}
        >
          <h4>EDIT PRODUCT CATEGORY</h4>
          <Input
            config={{
              name: "category",
              value: state.category,
            }}
            changed={(e) =>
              setState((prevState) => {
                return {
                  ...prevState,
                  category: e.target.value,
                };
              })
            }
          />
          <Button
            config={{
              className: classes.confirm,
              type: "submit",
              disabled:
                state.category ===
                options.find((opt) => opt._id === state.id)?.category,
            }}
          >
            EDIT
          </Button>
        </form>
      </Modal>
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
          <div>
            <div>This category will be deleted</div>
            <div>Want to continue?</div>
          </div>
          <div>
            <Button
              config={{
                className: [classes.reject, classes.button].join(" "),
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
              No
            </Button>
            <Button
              config={{
                className: [classes.confirm, classes.button].join(" "),
              }}
              changed={() => {
                setState((prevState) => {
                  return {
                    ...prevState,
                    deleteModal: false,
                  };
                });
                deleteCategoryHandler(token, state.id);
              }}
            >
              Yes
            </Button>
          </div>
        </div>
      </Modal>
      {loading ? (
        <Spinner />
      ) : (
        <div className={classes.categoryCtn}>
          <h4>CATEGORIES</h4>
          <div
            className={[
              classes.categoryHeadings,
              classes.categoryStructure,
            ].join(" ")}
          >
            <div>S/N</div>
            <div>NAME</div>
            <div>EDIT</div>
            <div></div>
          </div>
          <div className={classes.categoryList}>
            {options.map((option, i) => (
              <div
                className={[
                  classes.categoryItem,
                  classes.categoryStructure,
                ].join(" ")}
                key={option._id}
              >
                <div>{i + 1}</div>
                <div>{option.category}</div>
                <div
                  className={classes.edit}
                  onClick={() =>
                    setState((prevState) => {
                      return {
                        ...prevState,
                        category: option.category,
                        editForm: true,
                        id: option._id,
                      };
                    })
                  }
                >
                  <img
                    src={edit}
                    className={classes.editImage}
                  />
                </div>
                <div
                  className={classes.delete}
                  onClick={() =>
                    setState((prevState) => {
                      return {
                        ...prevState,
                        deleteModal: true,
                        id: option._id,
                      };
                    })
                  }
                >
                  ✕
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
});

export default Category;
// TEMPLATE
