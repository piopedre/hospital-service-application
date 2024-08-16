// After i am adjusting the icons next
import React, { Fragment, useState, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import classes from "./DailySalesReport.module.css";
import Button from "../../../../components/UI/Button/Button";
import Carousel from "../../../../components/UI/Carousel/Carousel";
import {
  filterSales,
  clearProductSalesError,
  sendMessage,
  clearMessage,
} from "../../../../store";
import { Navigate } from "react-router-dom";
import Backdrop from "../../../../components/UI/Backdrop/Backdrop";
import Input from "../../../../components/UI/Input/Input";
import ErrorHandler from "../../../../hoc/ErrorHandler/ErrorHandler";
import Message from "../../../../components/UI/Message/Message";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import ChatMessenger from "../../../../components/UI/ChatMessenger/ChatMessenger";
import FilterButton from "../../../../components/UI/FilterButton/FilterButton";
import { storeNotificationMessenger } from "../../../../Utility/general/general";
const DailySalesReport = React.memo((props) => {
  const dispatch = useDispatch();
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const mainMessage = useSelector((state) => state.messenger.message);
  const [state, setState] = useState({
    salesForm: false,
  });
  const filterSalesHandler = useCallback(
    (e, token, location, unit, clinic) =>
      dispatch(filterSales(e, token, location, unit, clinic)),
    [dispatch]
  );
  const clearProductSalesErrorHandler = useCallback(
    () => dispatch(clearProductSalesError()),
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
    filterSalesHandler(null, token, $location, unit, clinic);
  }, [filterSalesHandler, token, $location, unit, clinic]);
  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);
  const sales = Object.entries(
    productSalesDatabase
      .map((sale) => {
        return { price: sale.totalPrice, date: sale.createdAt };
      })
      .reduce((acc, cur) => {
        acc[cur.date]
          ? (acc[cur.date] += +cur.price)
          : (acc[cur.date] = +cur.price);
        return acc;
      }, {})
  ).reduce(
    (acc, [key, value]) => {
      acc.x.push(key);
      acc.y.push(value);
      return acc;
    },
    { x: [], y: [] }
  );
  sales.marker = { color: "#936c60" };
  sales.title = `SALES REPORT`;
  return (
    <Fragment>
      <ChatMessenger message={mainMessage} />
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
      <Message
        message={message}
        error={errorMessage}
      />
      {productSalesDatabaseError.message && (
        <ErrorHandler
          error={productSalesDatabaseError.message}
          status={productSalesDatabaseError.status}
          clearError={clearProductSalesErrorHandler}
        />
      )}
      {!isAuthenticated && !token && (
        <Navigate
          replace={true}
          to='/pharma-app/log-out'
        />
      )}

      {productSalesDatabaseLoader ? (
        <Spinner />
      ) : (
        <div className={classes.dailySalesReport}>
          {state.salesForm && (
            <form
              className={classes.salesForm}
              onSubmit={(e) => {
                e.preventDefault();
                setState((prevState) => {
                  return {
                    ...prevState,
                    salesForm: false,
                  };
                });
                filterSalesHandler(e, token, $location, unit, clinic);
              }}
            >
              <h5>FILTER SALES DATA</h5>
              <div className={classes.formProps}>
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
                }}
                changed={(e) => {
                  e.preventDefault();
                  setState((prevState) => {
                    return {
                      ...prevState,
                      salesForm: false,
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
          )}
          <div className={classes.filterCtn}>
            <div className={classes.filter}>
              <FilterButton
                changed={() => {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      salesForm: !prevState.salesForm,
                    };
                  });
                }}
              />
            </div>
          </div>
          <h4>DAILY SALES VIZUALIZATION REPORT</h4>
          <div>
            {productSalesDatabase.length ? (
              <Carousel
                data={[sales]}
                plotTitle={sales.title}
              />
            ) : (
              <Carousel />
            )}
          </div>
        </div>
      )}
    </Fragment>
  );
});

export default DailySalesReport;
