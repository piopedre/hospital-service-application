import React, { Fragment, useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Message from "../../../components/UI/Message/Message";
import Input from "../../../components/UI/Input/Input";
import { Navigate } from "react-router-dom";
import Button from "../../../components/UI/Button/Button";
import classes from "./StoreReport.module.css";
import RequistionPreview from "../../../components/RequistionPreview/RequistionPreview";
import Spinner from "../../../components/UI/Spinner/Spinner";
import {
  filterStoreReportRequistion,
  initStoreReportRequistion,
  clearMessage,
  sendMessage,
} from "../../../store";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import FilterButton from "../../../components/UI/FilterButton/FilterButton";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const StoreReport = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
    form: false,
    supplies: [],
    requistions: [],
    selectedRequistion: [],
    preview: false,
  });
  const token = JSON.parse(sessionStorage.getItem("token"));
  const mainMessage = useSelector((state) => state.messenger.message);
  // const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  // const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const numberOfProducts = [...state.requistions].flatMap(
    (requistion) => requistion.products
  );
  const sumTotal = [...state.requistions].reduce(
    (acc, cur) => (acc += cur.costOfRequistion),
    0
  );
  //////////////////////////////
  const initStoreReportRequistionHandler = useCallback(
    (token, setState) => dispatch(initStoreReportRequistion(token, setState)),
    [dispatch]
  );
  const filterStoreReportRequistionHandler = useCallback(
    (event, token, setState) =>
      dispatch(filterStoreReportRequistion(event, token, setState)),
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
    initStoreReportRequistionHandler(token, setState);
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
    <div className={classes.storeCtn}>
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
      {state.preview ? null : (
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
      )}

      {state.form && (
        <form
          className={classes.requistionForm}
          onSubmit={(e) =>
            filterStoreReportRequistionHandler(e, token, setState)
          }
        >
          <h5>FILTER DATA</h5>
          <Input
            config={{ name: "startDate", required: true, type: "date" }}
            label='START DATE'
          />
          <Input
            config={{ name: "endDate", required: true, type: "date" }}
            label='END DATE'
          />
          <Button
            config={{
              className: classes.cancel,
              type: "cancel",
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
              type: "submit",
            }}
          >
            SUBMIT
          </Button>
        </form>
      )}
      {state.loading ? (
        <Spinner />
      ) : state.preview ? (
        <RequistionPreview
          requistion={state.selectedRequistion}
          setState={setState}
        />
      ) : (
        <Fragment>
          <h4>REQUISTION LIST</h4>
          <div
            className={[classes.reportHeadings, classes.structure].join(" ")}
          >
            <div>DATE</div>
            <div>LOCATION</div>
            <div>AMOUNT</div>
          </div>
          <div className={classes.requistionList}>
            {state.requistions.length ? (
              state.requistions.map((requistion) => (
                <div
                  className={classes.requistionItem}
                  key={requistion._id}
                  onClick={() =>
                    setState((prevState) => {
                      return {
                        ...prevState,
                        selectedRequistion: requistion,
                        preview: true,
                      };
                    })
                  }
                >
                  <div className={classes.structure}>
                    <div>
                      <div>
                        {Intl.DateTimeFormat("en-GB", {
                          dateStyle: "full",
                        }).format(Date.parse(requistion.createdAt))}
                      </div>
                      <div>
                        {Intl.DateTimeFormat("en-GB", {
                          hour: "2-digit",
                          minute: "2-digit",
                        }).format(Date.parse(requistion.createdAt))}
                      </div>
                    </div>
                    <div>
                      {requistion.clinic?.name}, {requistion.location?.name}{" "}
                      {requistion.unit?.name}
                    </div>
                    <div>
                      ₦
                      {Intl.NumberFormat("en-GB").format(
                        requistion.costOfRequistion
                      )}
                    </div>
                  </div>
                  <div className={classes.requistionProps}>
                    <div>SIV :{requistion.siv}</div>
                    <div
                      style={{
                        textTransform: "uppercase",
                      }}
                    >
                      {requistion.requistingPharmacist?.lastName}{" "}
                      {requistion.requistingPharmacist?.firstName}
                    </div>
                    <div>PRODUCTS: {requistion.numberOfProducts} </div>
                  </div>
                </div>
              ))
            ) : (
              <div className={classes.emptyRequistion}>NO REQUISTION </div>
            )}
          </div>
          <div className={classes.interactionBar}>
            <div>NUMBER OF PRODUCTS</div>
            <div>{numberOfProducts.length}</div>
            <div> TOTAL</div>
            <div>
              ₦ {Intl.NumberFormat("en-GB").format(sumTotal.toFixed(2))}
            </div>
          </div>
        </Fragment>
      )}
    </div>
  );
};

export default StoreReport;
