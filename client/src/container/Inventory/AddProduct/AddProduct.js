import React, {
  Fragment,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import { Navigate } from "react-router-dom";
import { setForm } from "../../../Utility/inventory/addProduct";
import Message from "../../../components/UI/Message/Message";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import ProductForm from "../../../components/ProductForm/ProductForm";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import {
  clearProductError,
  addProductCategory,
  initProductCategories,
  openAddCategory,
  closeAddCategory,
  addProduct,
  clearMessage,
  sendMessage,
  fetchProductsMethod,
} from "../../../store/index";
import { useDispatch, useSelector } from "react-redux";
import { addFormHandler } from "../../../Utility/inventory/addProduct";
import { storeNotificationMessenger } from "../../../Utility/general/general";

const AddProduct = (props) => {
  const dispatch = useDispatch();
  // GENERAL STATE VARIABLES
  const token = JSON.parse(sessionStorage.getItem("token"));
  const error = useSelector((state) => state.addProduct.error);
  const loading = useSelector((state) => state.addProduct.loading);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const message = useSelector((state) => state.addProduct.message);
  const options = useSelector((state) => state.addProduct.options);
  const modal = useSelector((state) => state.addProduct.modal);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const mainMessage = useSelector((state) => state.messenger.message);
  const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
  const clinicName = JSON.parse(sessionStorage.getItem("clinic"))?.name;
  const $locationName = JSON.parse(sessionStorage.getItem("location"))?.name;
  const drugRef = useRef();
  const clearErrorHandler = useCallback(
    () => dispatch(clearProductError()),
    [dispatch]
  );
  const addProductCategoryHandler = useCallback(
    (event, token, setState) =>
      dispatch(addProductCategory(event, token, setState)),
    [dispatch]
  );
  const initProductCategoryHandler = useCallback(
    (token) => dispatch(initProductCategories(token)),
    [dispatch]
  );
  const openAddCategoryHandler = useCallback(
    () => dispatch(openAddCategory()),
    [dispatch]
  );
  const closeAddCategoryHandler = useCallback(
    () => dispatch(closeAddCategory()),
    [dispatch]
  );
  const addProductHandler = useCallback(
    (event, token, location, unit, setForm, options, clinic, addState) =>
      dispatch(
        addProduct(
          event,
          token,
          location,
          unit,
          setForm,
          options,
          clinic,
          addState
        )
      ),
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
  const fetchProductsMethodHandler = useCallback(
    (token, search, setState) =>
      dispatch(fetchProductsMethod(token, search, setState)),
    [dispatch]
  );

  // STATE VARIABLES
  const [formState, setFormState] = useState({
    name: "",
    unitOfIssue: "",
    issueQuantity: "",
    packSize: "",
    quantity: "",
    minimumQuantity: "",
    costPrice: "",
    unitCostPrice: "",
    fgPrice: "",
    productCategory: "",
    expiryDate: "",
    category: "",
    markUp: 1.25,
  });

  const [addState, setAddState] = useState({
    products: [],
    loading: false,
    searchModal: false,
    firstClick: false,
  });

  useEffect(() => {
    initProductCategoryHandler(token);
  }, [initProductCategoryHandler]);
  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);
  const { name } = formState;
  const { firstClick } = addState;
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formState.name === drugRef?.current?.value) {
        // send Drugs Request //
        if (
          unitName === "STORE" &&
          clinicName === "PSYCHIATRY" &&
          $locationName === "USELU"
        ) {
          return;
        }
        if (!firstClick) {
          fetchProductsMethodHandler(token, formState.name, setAddState);
        }
      } else {
        clearTimeout(timer);
      }
    }, 500);
  }, [name, drugRef]);
  return (
    <Fragment>
      <ChatMessenger message={mainMessage} />
      <Message
        message={message}
        error={errorMessage}
      />

      {error.message && (
        <ErrorHandler
          error={error.message}
          status={error.status}
          clearError={clearErrorHandler}
        />
      )}
      {!isAuthenticated && !token && (
        <Navigate
          replace={true}
          to='/pharma-app/log-out'
        />
      )}
      <ProductForm
        drugRef={drugRef}
        changed={setForm}
        options={options}
        // added
        setFormState={setFormState}
        state={formState}
        category={formState.category}
        markUp={formState.markUp}
        modal={modal}
        addCategory={addProductCategoryHandler}
        loading={loading}
        closeModal={closeAddCategoryHandler}
        openModal={openAddCategoryHandler}
        addProduct={addProductHandler}
        formType='Add'
        addState={addState}
        setAddState={setAddState}
        readOnly={
          unitName === "STORE" &&
          clinicName === "PSYCHIATRY" &&
          $locationName === "USELU"
        }
        //
        editForm={addFormHandler}
      />
    </Fragment>
  );
};

export default AddProduct;
