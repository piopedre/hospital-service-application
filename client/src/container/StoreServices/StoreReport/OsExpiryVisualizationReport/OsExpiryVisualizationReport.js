import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessage, clearMessage } from "../../../../store";
import ChatMessenger from "../../../../components/UI/ChatMessenger/ChatMessenger";
import Message from "../../../../components/UI/Message/Message";
import {
  storeNotificationMessenger,
  getDate,
} from "../../../../Utility/general/general";
import Carousel from "../../../../components/UI/Carousel/Carousel";
import { Navigate } from "react-router-dom";
import classes from "./OsExpiryVisualizationReport.module.css";
import Input from "../../../../components/UI/Input/Input";
import Button from "../../../../components/UI/Button/Button";
import FilterButton from "../../../../components/UI/FilterButton/FilterButton";
import {
  filterOsExpiryVisualization,
  initOsExpiryVisualization,
} from "../../../../store/actions/action/storeServices/storeRequistionsAction";
import Backdrop from "../../../../components/UI/Backdrop/Backdrop";
import Spinner from "../../../../components/UI/Spinner/Spinner";
const OsExpiryVisualizationReport = memo((props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    form: false,
    loading: false,
    osData: [],
    expiriesData: [],
    type: "OUT OF STOCK",
    startDate: getDate(new Date().setDate(1)),
    endDate: getDate(new Date().setMonth(new Date().getMonth() + 1, 1)),
  });
  const defaultMonth = Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
  }).format(new Date());
  const startMonth = Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
  }).format(new Date(state?.startDate));
  const endMonth = Intl.DateTimeFormat("en-GB", {
    month: "short",
    year: "numeric",
  }).format(new Date(state?.endDate));
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const mainMessage = useSelector((state) => state.messenger.message);
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);

  const mainMessageHandler = useCallback(
    (message) => dispatch(sendMessage(message)),
    [dispatch]
  );
  const clearMessageHandler = useCallback(
    () => dispatch(clearMessage()),
    [dispatch]
  );
  const initOsExpiryVisualizationHandler = useCallback(
    (token, setState, location, unit, clinic, startDate, endDate) =>
      dispatch(
        initOsExpiryVisualization(
          token,
          setState,
          location,
          unit,
          clinic,
          startDate,
          endDate
        )
      ),
    [dispatch]
  );
  const filterOsExpiryVisualizationHandler = useCallback(
    (e, token, setState, location, unit, clinic) =>
      dispatch(
        filterOsExpiryVisualization(e, token, setState, location, unit, clinic)
      ),
    [dispatch]
  );

  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);
  useEffect(() => {
    const now = new Date();
    const endDate = getDate(now.setMonth(now.getMonth() + 1, 1));
    const startDate = getDate(new Date().setMonth(new Date().getMonth(), 1));
    initOsExpiryVisualizationHandler(
      token,
      setState,
      $location,
      unit,
      clinic,
      startDate,
      endDate
    );
  }, []);
  return (
    <div className={classes.osExpiryContainer}>
      <ChatMessenger message={mainMessage} />
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
      <div className={classes.filterBtnReport}>
        <FilterButton
          changed={() => {
            setState((prevState) => {
              return {
                ...prevState,
                form: !prevState.form,
              };
            });
          }}
        />
      </div>
      <div>
        {state.form && (
          <form
            className={classes.form}
            onSubmit={(e) =>
              filterOsExpiryVisualizationHandler(
                e,
                token,
                setState,
                $location,
                unit,
                clinic
              )
            }
          >
            <h5>Filter Data</h5>
            <Input
              title='TYPE'
              inputType='select'
              options={["EXPIRIES", "OUT OF STOCK"]}
              config={{
                name: "type",
                value: state.type,
              }}
              changed={(e) =>
                setState((prevState) => {
                  return {
                    ...prevState,
                    type: e.target.value,
                  };
                })
              }
            />
            <Input
              config={{
                name: "startDate",
                type: "date",
                value: state.startDate,
              }}
              label='START DATE'
              changed={(e) =>
                setState((prevState) => {
                  return {
                    ...prevState,
                    startDate: e.target.value,
                  };
                })
              }
            />
            <Input
              config={{
                name: "endDate",
                type: "date",
                value: state.endDate,
              }}
              label='END DATE'
              changed={(e) =>
                setState((prevState) => {
                  return {
                    ...prevState,
                    endDate: e.target.value,
                  };
                })
              }
            />
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
      </div>
      <h4>OS EXPIRY VISUALIZATION REPORT</h4>
      {state.loading ? (
        <Spinner />
      ) : (
        <div className={classes.graph}>
          <Carousel
            data={
              state.type === "OUT OF STOCK" ? state.osData : state.expiriesData
            }
            plotTitle={`${
              state.startDate && state.endDate
                ? `${startMonth} - ${endMonth}`
                : `${defaultMonth}`
            }  ${
              state.type === "OUT OF STOCK" ? "OS REPORT" : "EXPIRY REPORT"
            }`}
            barmode={state.type === "EXPIRIES"}
          />
        </div>
      )}
    </div>
  );
});

export default OsExpiryVisualizationReport;
// TEMPLATE
