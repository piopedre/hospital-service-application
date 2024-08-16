import React, { Fragment, memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  clearMessage,
  getFeedback,
  filterFeedback,
} from "../../../../store";
import Backdrop from "../../../../components/UI/Backdrop/Backdrop";
import ChatMessenger from "../../../../components/UI/ChatMessenger/ChatMessenger";
import Message from "../../../../components/UI/Message/Message";
import classes from "./FeedbackReport.module.css";
import { Navigate } from "react-router-dom";
import Input from "../../../../components/UI/Input/Input";
import FilterButton from "../../../../components/UI/FilterButton/FilterButton";
import Button from "../../../../components/UI/Button/Button";
import Spinner from "../../../../components/UI/Spinner/Spinner";
import { storeNotificationMessenger } from "../../../../Utility/general/general";
const Feedback = memo((props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
    preview: false,
    form: false,
    reports: [],
    report: null,
  });
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
  const getFeedbackHandler = useCallback(
    (object, token, setState) => dispatch(getFeedback(object, token, setState)),
    [dispatch]
  );
  const filterFeedbackHandler = useCallback(
    (e, token, setState, location, unit, clinic) =>
      dispatch(filterFeedback(e, token, setState, location, unit, clinic)),
    [dispatch]
  );
  useEffect(() => {
    getFeedbackHandler({ location: $location, unit, clinic }, token, setState);
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
    <div className={classes.report}>
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

      {state.loading ? (
        <Spinner />
      ) : state.preview ? (
        state.report && (
          <div className={classes.preview}>
            <div className={classes.title}>
              {" "}
              {JSON.parse(sessionStorage.getItem("institution"))?.name}
            </div>
            <span className={classes.title}>
              {JSON.parse(sessionStorage.getItem("location"))?.name}{" "}
              {JSON.parse(sessionStorage.getItem("clinic"))?.name},{" "}
              {JSON.parse(sessionStorage.getItem("unit"))?.name}
            </span>
            <div className={classes.mainReport}>
              <div>NAME</div>
              <div>{state.report.name} </div>
              <div>SUBJECT</div>
              <div>{state.report.subject}</div>
              <div>BODY</div>
              <div className={classes.body}>{state.report.body}</div>
              <div>PHARMACIST</div>
              <div>
                {state.report.pharmacist.lastName}{" "}
                {state.report.pharmacist.firstName}
              </div>
            </div>
            <Button
              config={{
                className: classes.hold,
              }}
              changed={() =>
                setState((prevState) => {
                  return {
                    ...prevState,
                    preview: false,
                    report: null,
                  };
                })
              }
            >
              CLOSE
            </Button>
          </div>
        )
      ) : (
        <Fragment>
          <div>
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
                className={classes.filterForm}
                onSubmit={(e) =>
                  filterFeedbackHandler(
                    e,
                    token,
                    setState,
                    $location,
                    unit,
                    clinic
                  )
                }
              >
                <h4>Filter By Date</h4>
                <Input
                  config={{
                    type: "date",
                    required: true,
                    name: "startDate",
                  }}
                  changed={(e) =>
                    setState((prevState) => {
                      return {
                        ...prevState,
                        startDate: e.target.value,
                      };
                    })
                  }
                  label='START DATE'
                />
                <Input
                  config={{
                    type: "date",
                    required: true,
                    name: "endDate",
                  }}
                  changed={(e) =>
                    setState((prevState) => {
                      return {
                        ...prevState,
                        endDate: e.target.value,
                      };
                    })
                  }
                  label='END DATE'
                />
                <Button config={{ className: classes.hold }}>SUBMIT</Button>
              </form>
            ) : null}

            <div className={classes.reportHeadings}>
              <div>DATE</div>
              <div>SUBJECT</div>
              <div className={classes.desktopOnly}>NAME</div>
              <div>PHARMACIST</div>
            </div>
          </div>
          <div className={classes.reportList}>
            {state.reports.length ? (
              state.reports.map((report) => (
                <div
                  className={classes.reportItem}
                  onClick={() =>
                    setState((prevState) => {
                      const reportItem = [...prevState.reports].find(
                        (rep) => rep._id === report._id
                      );
                      return {
                        ...prevState,
                        preview: true,
                        report: reportItem,
                      };
                    })
                  }
                  key={report._id}
                >
                  <div>
                    <div>
                      {Intl.DateTimeFormat("en-GB", {
                        dateStyle: "full",
                      }).format(Date.parse(new Date()))}
                    </div>
                    <div>
                      {Intl.DateTimeFormat("en-GB", {
                        hour: "2-digit",
                        minute: "2-digit",
                      }).format(Date.parse(new Date()))}
                    </div>
                  </div>
                  <div>{report.subject}</div>
                  <div className={classes.desktopOnly}>{report.name}</div>
                  <div>
                    <div>{report.pharmacist.firstName}</div>
                    <div>{report.pharmacist.lastName}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className={classes.empty}>NO REPORT FOUND</div>
            )}
          </div>
          <div className={classes.interactionBar}>
            <div>NUMBER OF REPORTS</div>
            <div>{state.reports.length}</div>
          </div>
        </Fragment>
      )}
    </div>
  );
});

export default Feedback;
// TEMPLATE
