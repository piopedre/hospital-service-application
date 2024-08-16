import React, { useEffect, useState, useCallback, Fragment } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initDrugTherapyProblem,
  sendMessage,
  clearMessage,
  filterDrugTherapyProblem,
} from "../../../store";
import { Navigate } from "react-router-dom";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import Spinner from "../../../components/UI/Spinner/Spinner";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import DrugTherapyProblemItem from "../../../components/DrugTherapyProblemItem/DrugTherapyProblemItem";
import DrugTherapyViewItem from "../../../components/DrugTherapyProblemItem/DrugTherapyViewItem/DrugTherapyViewItem";
import FilterButton from "../../../components/UI/FilterButton/FilterButton";
import FilterIcon from "../../../components/UI/FilterButton/FilterIcon/FilterIcon";
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import classes from "./DrugTherapyProblem.module.css";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const DrugTherapyProblem = (props) => {
  const dispatch = useDispatch();
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const mainMessage = useSelector((state) => state.messenger.message);

  const [state, setState] = useState({
    reports: [],
    loading: false,
    view: null,
    filter: false,
    endDate: "",
    startDate: "",
  });

  const initDrugTherapyProblemHandler = useCallback(
    (token, setState, object) =>
      dispatch(initDrugTherapyProblem(token, setState, object)),
    [dispatch]
  );
  const filterDrugTherapyProblemHandler = useCallback(
    (e, token, setState, object) =>
      dispatch(filterDrugTherapyProblem(e, token, setState, object)),
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
    initDrugTherapyProblemHandler(token, setState, {
      clinic,
      location: $location,
      unit,
    });
  }, []);
  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);

  let monthValidater = "";
  const newMonths = [...state.reports].reduce((acc, cur, i) => {
    const month = Intl.DateTimeFormat("en-GB", { month: "long" }).format(
      Date.parse(cur?.createdAt || new Date())
    );
    if (month !== monthValidater) {
      monthValidater = month;

      const data = {
        month,
        index: i,
      };

      acc.push(data);
    }
    return acc;
  }, []);
  const dtps = [...state.reports].map((rep, i) => {
    const notify = newMonths.find((data) => data.index === i);

    if (notify) {
      return (
        <Fragment key={rep._id}>
          <h4
            style={{
              textAlign: "left",
              color: "#25447d",
              textTransform: "uppercase",
            }}
          >
            {newMonths[i].month}
          </h4>
          <DrugTherapyProblemItem
            setState={setState}
            dtp={rep}
          />
        </Fragment>
      );
    } else {
      return (
        <DrugTherapyProblemItem
          key={rep._id}
          setState={setState}
          dtp={rep}
        />
      );
    }
  });

  return (
    <div className={classes.container}>
      <Backdrop
        show={state.filter}
        closed={() =>
          setState((prevState) => {
            return {
              ...prevState,
              filter: false,
            };
          })
        }
      />
      <ChatMessenger message={mainMessage} />
      {!isAuthenticated && !token && (
        <Navigate
          replace={true}
          to='/pharma-app/log-out'
        />
      )}
      <h4 className={classes.heading}>DRUG THERAPY PROBLEM REPORTS</h4>
      {state.view ? (
        <DrugTherapyViewItem
          dtp={state.view}
          setState={setState}
        />
      ) : (
        <div className={classes.dtpContainer}>
          <div className={classes.title}>
            <div>DATE</div>
            <div>DTP</div>
            <div className={classes.desktopOnly}>PATIENT</div>
            <div>PHARM</div>
          </div>
          <div className={classes.filterCtn}>
            {state.startDate && state.endDate && (
              <FilterIcon
                changed={() => {
                  setState((prevState) => {
                    return {
                      ...prevState,
                      startDate: "",
                      endDate: "",
                    };
                  });
                  initDrugTherapyProblemHandler(token, setState, {
                    clinic,
                    location: $location,
                    unit,
                  });
                }}
                iconName='CUSTOM DATE'
              />
            )}
            <FilterButton
              changed={() =>
                setState((prevState) => {
                  return {
                    ...prevState,
                    filter: !prevState.filter,
                    startDate: "",
                    endDate: "",
                  };
                })
              }
            />

            {state.filter ? (
              <form
                className={classes.filterForm}
                onSubmit={(e) =>
                  filterDrugTherapyProblemHandler(e, token, setState, {
                    clinic,
                    location: $location,
                    unit,
                  })
                }
              >
                <span>Filter By Date</span>
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
          </div>

          <div>
            <div className={classes.reportContainer}>
              {state.loading ? (
                <Spinner />
              ) : !state.reports.length ? (
                <div className={classes.emptyReport}>NO REPORT AVAILABLE</div>
              ) : (
                dtps
              )}
            </div>

            <div>
              <div className={classes.interaction}>
                <div>NUMBER OF REPORTS</div>
                <div>{state.reports.length}</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DrugTherapyProblem;
