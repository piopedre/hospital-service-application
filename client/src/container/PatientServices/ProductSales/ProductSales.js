import React, { Fragment, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../../components/UI/Message/Message";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import { Navigate } from "react-router-dom";
import {
  initProductSalesDatabase,
  clearProductSalesError,
  filterSales,
  deleteSale,
  sendMessage,
  clearMessage,
  addReceiptHandler,
} from "../../../store";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import SalesItems from "../../../components/SalesItems/SalesItems";
import { setSaleHandler } from "../../../Utility/PatientServices/productSales";
import Input from "../../../components/UI/Input/Input";
import PreviewItem from "../../../components/PreviewItem/PreviewItem";
import FilterButton from "../../../components/UI/FilterButton/FilterButton";
import Button from "../../../components/UI/Button/Button";
import classes from "./ProductSales.module.css";
import Spinner from "../../../components/UI/Spinner/Spinner";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const ProductSales = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    preview: false,
    form: false,
    selectedSale: null,
    deleteModal: false,
    loading: false,
  });
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const unit = JSON.parse(sessionStorage.getItem("unit"));
  const clinic = JSON.parse(sessionStorage.getItem("clinic"));
  const message = useSelector((state) => state.addProduct.message);
  const mainMessage = useSelector((state) => state.messenger.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const initProductSalesDatabaseHandler = useCallback(
    (token, location, unit, clinic, startDate, endDate) =>
      dispatch(
        initProductSalesDatabase(
          token,
          location,
          unit,
          clinic,
          startDate,
          endDate
        )
      ),
    [dispatch]
  );
  const clearProductSalesErrorHandler = useCallback(
    () => dispatch(clearProductSalesError()),
    [dispatch]
  );
  const filterSalesHandler = useCallback(
    (e, token, location, unit, clinic) =>
      dispatch(filterSales(e, token, location, unit, clinic)),
    [dispatch]
  );
  const deleteSaleHandler = useCallback(
    (token, id, setState, location, unit, clinic, products) =>
      dispatch(
        deleteSale(token, id, setState, location, unit, clinic, products)
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
  const addReceiptSubmitHandler = useCallback(
    (e, token, setState, id, location, unit, clinic) =>
      dispatch(
        addReceiptHandler(e, token, setState, id, location, unit, clinic)
      ),
    [dispatch]
  );
  const productSalesDatabaseLoader = useSelector(
    (state) => state.general.sales.loading
  );
  const productSalesDatabaseError = useSelector(
    (state) => state.general.sales.error
  );
  const productSalesDatabase = useSelector(
    (state) => state.general.sales.database
  );
  useEffect(() => {
    initProductSalesDatabaseHandler(token, $location?.id, unit?.id, clinic?.id);
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
    <Fragment>
      <Backdrop
        show={state.form}
        closed={() =>
          setState((prevState) => {
            return {
              ...prevState,
              form: false,
            };
          })
        }
      />
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
      {productSalesDatabaseError.message && (
        <ErrorHandler
          error={productSalesDatabaseError.message}
          status={productSalesDatabaseError.status}
          clearError={clearProductSalesErrorHandler}
        />
      )}
      {productSalesDatabaseLoader || state.loading ? (
        <Spinner />
      ) : state.preview ? (
        <PreviewItem
          sale={state.selectedSale}
          products={state.selectedSale.products}
          unit={state.selectedSale.unit}
          location={state.selectedSale.location}
          setState={setState}
          token={token}
          id={state.selectedSale._id}
          mainLocation={$location}
          mainUnit={unit}
          clinic={clinic}
          deleteItem={deleteSaleHandler}
          deleteModal={state.deleteModal}
          productSales
          addReceipt={addReceiptSubmitHandler}
        />
      ) : (
        <Fragment>
          <div className={classes.salesCtn}>
            <div className={classes.filter}>
              <FilterButton
                changed={() =>
                  setState((prevState) => {
                    return {
                      ...prevState,
                      form: !prevState.form,
                    };
                  })
                }
              />
            </div>
            {state.form ? (
              <form
                className={classes.salesForm}
                onSubmit={(e) => {
                  e.preventDefault();
                  setState((prevState) => {
                    return {
                      ...prevState,
                      form: false,
                    };
                  });
                  filterSalesHandler(
                    e,
                    token,
                    $location?.id,
                    unit?.id,
                    clinic?.id
                  );
                }}
              >
                <h5>FILTER SALES DATA</h5>
                <div className={classes.formComps}>
                  <Input
                    inputType='select'
                    options={[
                      "All",
                      "NORMAL",
                      "NHIA",
                      "NNPC",
                      "FUCC",
                      "COMMUNITY",
                    ]}
                    title='PRICING'
                    config={{
                      name: "pricing",
                      required: true,
                      className: classes.input,
                    }}
                  />
                  <Input
                    inputType='select'
                    options={["All", "OUT-PATIENT", "IN-PATIENT", "REQUISTION"]}
                    title='SERVICE TYPE'
                    config={{
                      name: "patientType",
                      required: true,
                    }}
                  />
                </div>
                <Input
                  inputType='select'
                  options={["All", "GENERAL MEDICAL SERVICES", "PSYCHIATRY"]}
                  title='CLINIC TYPE'
                  config={{
                    name: "serviceClinic",
                    required: true,
                  }}
                />
                <Input
                  config={{
                    type: "datetime-local",
                    name: "start_date",
                    required: true,
                  }}
                  label='START DATE'
                />
                <Input
                  config={{
                    type: "datetime-local",
                    name: "end_date",
                    required: true,
                  }}
                  label='END DATE'
                />
                <Button
                  config={{
                    className: classes.cancel,
                    type: "submit",
                  }}
                  changed={() => {
                    setState((prevState) => {
                      return {
                        ...prevState,
                        form: false,
                      };
                    });
                  }}
                >
                  CANCEL
                </Button>
                <Button
                  config={{
                    className: classes.confirm,
                    type: "submit",
                  }}
                >
                  SUBMIT
                </Button>
              </form>
            ) : null}
            <SalesItems
              sales={productSalesDatabase}
              productSales
              checkDetails={setSaleHandler}
              setState={setState}
            />
          </div>
        </Fragment>
      )}
    </Fragment>
  );
};

export default ProductSales;
