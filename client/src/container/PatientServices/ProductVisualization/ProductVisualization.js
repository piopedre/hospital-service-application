import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Carousel from "../../../components/UI/Carousel/Carousel";
import { Navigate } from "react-router-dom";
import classes from "./ProductVisualization.module.css";
import Button from "../../../components/UI/Button/Button";
import {
  initProductSalesDatabase,
  clearProductSalesError,
  filterSales,
  sendMessage,
  clearMessage,
} from "../../../store";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import Message from "../../../components/UI/Message/Message";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import FilterButton from "../../../components/UI/FilterButton/FilterButton";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const ProductVisualization = React.memo((props) => {
  const dispatch = useDispatch();
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const mainMessage = useSelector((state) => state.messenger.message);
  const [state, setState] = useState({
    price: true,
    salesForm: false,
  });
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

  const database = [...productSalesDatabase];
  let data = [];
  if (database.length) {
    if (state.price) {
      data = Object.entries(
        database
          .map((sale) => sale.products)
          .flat()
          .reduce((acc, cur) => {
            acc[cur.name]
              ? (acc[cur.name] = acc[cur.name] += cur.quantityPrice)
              : (acc[cur.name] = +cur.quantityPrice);
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
    } else {
      data = Object.entries(
        database
          .map((sale) => sale.products)
          .flat()
          .reduce((acc, cur) => {
            acc[cur.name]
              ? (acc[cur.name] = +acc[cur.name] + +cur.quantity)
              : (acc[cur.name] = +cur.quantity);
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
    }
    data.type = "bar";
    data.marker = {
      color: "#936c60",
    };
  }

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
    <div className={classes.productVisualization}>
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
              options={["All", "NORMAL", "NHIA", "NNPC", "FUCC", "COMMUNITY"]}
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
      <Button
        config={{
          className: classes.confirm,
        }}
        changed={() => {
          setState((prevState) => {
            return {
              ...prevState,
              price: !prevState.price,
            };
          });
        }}
      >
        PRODUCT {state.price ? " QUANTITY" : " PRICE"} VISUALIZATION
      </Button>

      {/* <Button
        config={{
          className: classes.hold,
        }}
        changed={() => {
          setState((prevState) => {
            return {
              ...prevState,
              salesForm: true,
            };
          });
        }}
      >
        FILTER PRODUCT DATA
      </Button> */}
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
      <div>
        {database.length ? (
          <Carousel
            data={[data]}
            plotTitle={
              state.price ? "PRICE  VISUALIZATION" : "QUANTITY  VISUALIZATION"
            }
          />
        ) : (
          <Carousel />
        )}
      </div>
    </div>
  );
});

export default ProductVisualization;
