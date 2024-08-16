import React, { Fragment, useEffect, useState, useCallback } from "react";
import Button from "../../../../components/UI/Button/Button";
import FilterReport from "../../../../components/FilterReport/FilterReport";
import Input from "../../../../components/UI/Input/Input";
import Carousel from "../../../../components/UI/Carousel/Carousel";
import classes from "./StoreVisualizationReport.module.css";
import { Navigate } from "react-router-dom";
import {
  initStoreVisualization,
  filterStoreVisualization,
  clearMessage,
  sendMessage,
} from "../../../../store";
import { dataAnalysis } from "../../../../Utility/storeServices/storeVisualizationReport";
import Backdrop from "../../../../components/UI/Backdrop/Backdrop";
import Message from "../../../../components/UI/Message/Message";
import { useDispatch, useSelector } from "react-redux";
import ChatMessenger from "../../../../components/UI/ChatMessenger/ChatMessenger";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import FilterButton from "../../../../components/UI/FilterButton/FilterButton";
import { storeNotificationMessenger } from "../../../../Utility/general/general";
const StoreVisualizationReport = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    report: "both",
    dataType: "both",
    frequency: "daily",
    filterReport: false,
    form: false,
    supplies: [],
    requistions: [],
    loading: false,
  });
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const mainMessage = useSelector((state) => state.messenger.message);
  const initStoreReportVisualizationHandler = useCallback(
    (token, setState, object) =>
      dispatch(initStoreVisualization(token, setState, object)),
    [dispatch]
  );
  const filterStoreReportVisualizationHandler = useCallback(
    (e, token, setState) =>
      dispatch(filterStoreVisualization(e, token, setState)),
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
    initStoreReportVisualizationHandler(token, setState);
  }, []);
  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);

  const newData = dataAnalysis(state);
  return (
    <div className={classes.visualization}>
      <Backdrop
        show={state.form || state.filterReport}
        closed={() =>
          setState((prevState) => {
            return {
              ...prevState,
              form: false,
              filterReport: false,
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
      <h4>STORE VISUALIZATION REPORT</h4>
      <div className={classes.filterBtnReport}>
        <FilterButton
          changed={() => {
            setState((prevState) => {
              return {
                ...prevState,
                filterReport: !prevState.filterReport,
                form: false,
              };
            });
          }}
        />
      </div>

      <div className={classes.filterBtnForm}>
        <FilterButton
          changed={() => {
            setState((prevState) => {
              return {
                ...prevState,
                filterReport: false,
                form: !prevState.form,
              };
            });
          }}
        />
      </div>

      {state.filterReport && (
        <FilterReport
          config={{ className: classes.filterReport }}
          setState={setState}
        />
      )}
      {state.form && (
        <form
          className={classes.form}
          onSubmit={(e) =>
            filterStoreReportVisualizationHandler(e, token, setState)
          }
        >
          <h5>Filter Data</h5>
          <Input
            config={{
              name: "startDate",
              type: "date",
            }}
            label='START DATE'
          />
          <Input
            config={{
              name: "endDate",
              type: "date",
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
            }}
          >
            SUBMIT
          </Button>
        </form>
      )}
      {state.loading ? (
        <Spinner />
      ) : (
        <div className={classes.graph}>
          {newData.length ? (
            <Carousel
              data={newData}
              plotTitle={
                state.report === "both"
                  ? "SUPPLY AND REQUISTION VISUALIZATION"
                  : state.report === "supply"
                  ? "SUPPLY  VISUALIZATION"
                  : "REQUISTION  VISUALIZATION"
              }
            />
          ) : (
            <Carousel data={[]} />
          )}
        </div>
      )}
    </div>
  );
};

export default StoreVisualizationReport;
