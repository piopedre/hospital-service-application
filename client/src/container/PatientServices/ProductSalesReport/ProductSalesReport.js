import React, { useEffect, useCallback, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  clearProductSalesError,
  initProductSalesDatabase,
  filterSales,
  clearMessage,
  sendMessage,
} from "../../../store";
import Message from "../../../components/UI/Message/Message";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { Navigate } from "react-router-dom";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import {
  setProductDispensed,
  getAnalysisData,
} from "../../../Utility/PatientServices/productSales";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import SalesReport from "../../../components/SalesReport/SalesReport";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const ProductSalesReport = React.memo((props) => {
  const [state, setState] = useState({
    salesReport: true,
    salesForm: false,
    modal: false,
    analysedProducts: [],
    productsDispensed: [],
  });
  const dispatch = useDispatch();
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const mainMessage = useSelector((state) => state.messenger.message);
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
  const mainMessageHandler = useCallback(
    (message) => dispatch(sendMessage(message)),
    [dispatch]
  );
  const clearMessageHandler = useCallback(
    () => dispatch(clearMessage()),
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
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  useEffect(() => {
    initProductSalesDatabaseHandler(token, $location, unit, clinic);
  }, [initProductSalesDatabaseHandler, token, $location, unit, clinic]);
  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);

  return productSalesDatabaseLoader ? (
    <Spinner />
  ) : (
    <div style={{ minHeight: "600px" }}>
      <Backdrop
        show={state.salesForm}
        closed={() =>
          setState((prevState) => {
            return {
              ...prevState,
              salesForm: false,
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
      {/* PRODUCT SALES */}
      <SalesReport
        state={state}
        setState={setState}
        database={productSalesDatabase}
        setProductDispensed={setProductDispensed}
        getAnalysisData={getAnalysisData}
        filterSales={filterSalesHandler}
      />
    </div>
  );
});

export default ProductSalesReport;
