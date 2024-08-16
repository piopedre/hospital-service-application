import React, { Fragment, useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  filteredProducts,
  validateTransfer,
  getLocationsByDepartment,
  getUnitsByDepartment,
  submitTransfer,
} from "../../../store";
import {
  addToProductListHandler,
  updateProductItem,
  deleteProductItem,
} from "../../../Utility/inventory/transferProducts";

import ProductContainer from "../../../components/ProductContainer/ProductContainer";
import TransferPreviewItem from "../../../components/TransferPreviewItem/TransferPreviewItem";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { getClinics } from "../../../store/actions/action/generalLogin/generalLogin";
import classes from "./TransferProducts.module.css";
const TransferProductsComponent = React.memo((props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    searchModal: false,
    productList: [],
    transferModal: false,
    preview: false,
    loading: false,
    search: "",
    locations: [],
    units: [],
    clinics: [],
  });

  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const department = JSON.parse(
    sessionStorage.getItem("department")
  )?.department;
  const products = useSelector((state) => state.editProduct.renderedProducts);
  const productDatabase = useSelector(
    (state) => state.general.products.database
  );

  const validateTransferHandler = useCallback(
    (state, setState) => dispatch(validateTransfer(state, setState)),
    [dispatch]
  );
  const filteredProductsHandler = useCallback(
    (event, products) => dispatch(filteredProducts(event, products)),
    [dispatch]
  );
  const getLocationsByDepartmentHandler = useCallback(
    (setState, department) =>
      dispatch(getLocationsByDepartment(setState, department)),
    [dispatch]
  );
  const getUnitsByDepartmentHandler = useCallback(
    (setState, department) =>
      dispatch(getUnitsByDepartment(setState, department)),
    [dispatch]
  );
  const getClinicsHandler = useCallback(
    (setState) => dispatch(getClinics(setState)),
    [dispatch]
  );
  const submitTransferHandler = useCallback(
    (
      e,
      state,
      setState,
      token,
      location,
      unit,
      clinic,
      setTransferComponent,
      socket
    ) =>
      dispatch(
        submitTransfer(
          e,
          state,
          setState,
          token,
          location,
          unit,
          clinic,
          setTransferComponent,
          socket
        )
      ),
    [dispatch]
  );
  useEffect(() => {
    getLocationsByDepartmentHandler(setState, department);
    getUnitsByDepartmentHandler(setState, department);
    getClinicsHandler(setState);
  }, []);

  return (
    <Fragment>
      <h4 className={classes.title}>TRANSFER PRODUCTS</h4>
      {state.loading ? (
        <Spinner />
      ) : state.preview ? (
        <TransferPreviewItem
          state={state}
          productList={state.productList}
          setState={setState}
          token={token}
          location={$location}
          unit={unit}
          clinic={clinic}
          submitTransfer={submitTransferHandler}
          setRequistionState={props.setRequistionState}
          socket={props.socket}
        />
      ) : (
        <ProductContainer
          filterMethod={filteredProductsHandler}
          products={productDatabase}
          filteredProducts={products}
          setState={setState}
          state={state}
          searchModal={state.searchModal}
          productList={state.productList}
          addToProductList={addToProductListHandler}
          updateProductItem={updateProductItem}
          deleteItem={deleteProductItem}
          validateTransfer={validateTransferHandler}
          setRequistionState={props.setRequistionState}
          transfers
        />
      )}
    </Fragment>
  );
});

export default TransferProductsComponent;
