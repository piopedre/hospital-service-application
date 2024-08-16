import React, { useCallback, useEffect, useState } from "react";
import classes from "./EditProduct.module.css";
import ProductForm from "../../../components/ProductForm/ProductForm";
import Spinner from "../../../components/UI/Spinner/Spinner";
import RenderContainer from "../../../components/RenderContainer/RenderContainer";
import {
  initProductDatabase,
  clearProductDatabaseError,
  filteredProducts,
  initProductCategories,
  addProductCategory,
  closeAddCategory,
  openAddCategory,
  submitEditForm,
  sendMessage,
  clearMessage,
} from "../../../store/index";
import { setEditFormHandler } from "../../../Utility/inventory/editProduct";
import { setForm } from "../../../Utility/inventory/addProduct";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import Message from "../../../components/UI/Message/Message";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const EditProduct = (props) => {
  const dispatch = useDispatch();
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const productDatabase = useSelector(
    (state) => state.general.products.database
  );
  const productDatabaseError = useSelector(
    (state) => state.general.products.error
  );
  const productDatabaseLoader = useSelector(
    (state) => state.general.products.loading
  );
  const products = useSelector((state) => state.editProduct.renderedProducts);
  const options = useSelector((state) => state.addProduct.options);
  const editFormModal = useSelector((state) => state.addProduct.modal);
  const loading = useSelector((state) => state.addProduct.loading);
  const editLoading = useSelector((state) => state.editProduct.loading);
  const mainMessage = useSelector((state) => state.messenger.message);
  const initProductDatabaseHandler = useCallback(
    (token, location, unit, clinic) =>
      dispatch(initProductDatabase(token, location, unit, clinic)),
    [dispatch]
  );
  const initProductCategoriesHandler = useCallback(
    (token) => dispatch(initProductCategories(token)),
    [dispatch]
  );
  const clearProductDatabaseErrorHandler = useCallback(
    () => dispatch(clearProductDatabaseError()),
    [dispatch]
  );
  const filteredProductsHandler = useCallback(
    (event, products) => dispatch(filteredProducts(event, products)),
    [dispatch]
  );
  const addProductCategoryHandler = useCallback(
    (event, token) => dispatch(addProductCategory(event, token)),
    [dispatch]
  );
  const closeAddCategoryHandler = useCallback(
    () => dispatch(closeAddCategory()),
    [dispatch]
  );
  const openAddCategoryHandler = useCallback(
    () => dispatch(openAddCategory()),
    [dispatch]
  );
  const submitEditFormHandler = useCallback(
    (event, id, token, unit, location, setState, options, clinic, setSearch) =>
      dispatch(
        submitEditForm(
          event,
          id,
          token,
          unit,
          location,
          setState,
          options,
          clinic,
          setSearch
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
  // STATE VARIABLES
  const [editForm, setEditFormState] = useState({
    name: "",
    unitOfIssue: "",
    packSize: "",
    quantity: "",
    minimumQuantity: "",
    costPrice: "",
    unitCostPrice: "",
    fgPrice: "",
    productCategory: "",
    expiryDate: "",
    category: "",
    markUp: "",
    _id: "",
  });
  const [modal, setModal] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    initProductDatabaseHandler(token, $location, unit, clinic);
  }, [initProductDatabaseHandler, token, $location, unit, clinic]);
  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);
  const renderedProducts = products.map((product) => {
    const parsedDate = Date.parse(`${product.expiryDate}`);
    const expiryDate = Intl.DateTimeFormat("en-GB", {
      year: "2-digit",
      month: "2-digit",
    }).format(parsedDate);
    return (
      <div
        key={product._id}
        className={[classes.productStructure, classes.productItem].join(" ")}
        onClick={() => {
          initProductCategoriesHandler(token);
          setModal(true);
          setSearch("");
          setEditFormHandler(
            product._id,
            productDatabase,
            editForm,
            setEditFormState
          );
        }}
      >
        <div>{product.name}</div>
        <div>{product.quantity}</div>
        <div className={classes.desktopOnly}>
          {product?.productCategory?.category}
        </div>
        <div>{expiryDate}</div>
      </div>
    );
  });
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
      <h4
        style={{
          textAlign: "center",
        }}
      >
        EDIT PRODUCT
      </h4>
      {productDatabaseError.message && (
        <ErrorHandler
          error={productDatabaseError.message}
          status={productDatabaseError.status}
          clearError={clearProductDatabaseErrorHandler}
        />
      )}
      {!modal ? (
        productDatabaseLoader ? (
          <Spinner />
        ) : (
          <RenderContainer
            database={productDatabase}
            filteredProductsHandler={filteredProductsHandler}
            search={search}
            setSearch={setSearch}
          >
            {renderedProducts || null}
          </RenderContainer>
        )
      ) : editLoading ? (
        <Spinner />
      ) : (
        <div className={classes.form}>
          <ProductForm
            addState={null}
            changed={setForm}
            name={editForm.name}
            unitOfIssue={editForm.unitOfIssue}
            packSize={editForm.packSize}
            quantity={editForm.quantity}
            minimumQuantity={editForm.minimumQuantity}
            costPrice={editForm.costPrice}
            fgPrice={editForm.fgPrice}
            productCategory={editForm.productCategory}
            options={options}
            expiryDate={editForm.expiryDate}
            markUp={editForm.markUp}
            state={editForm}
            setFormState={setEditFormState}
            category={editForm.category}
            modal={editFormModal}
            addCategory={addProductCategoryHandler}
            loading={loading}
            closeModal={closeAddCategoryHandler}
            openModal={openAddCategoryHandler}
            formType='Edit'
            id={editForm._id}
            editProduct={submitEditFormHandler}
            setModal={setModal}
            setAddState={null}
            setSearch={setSearch}
          />
          <button
            className={classes.removeBtn}
            onClick={() => {
              setModal(false);
              setEditFormState((prevState) => {
                return {
                  ...prevState,
                  category: "",
                };
              });
            }}
          >
            <span className={classes.cancelStick}></span>
            <span className={classes.cancelStick}></span>
          </button>
        </div>
      )}
    </div>
  );
};

export default EditProduct;
