import React, {
  Fragment,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  clearMessage,
  sendProductMessenger,
  resetProductMessenger,
} from "../../../store";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import { Navigate } from "react-router-dom";
import classes from "./OsReport.module.css";
import FilterButton from "../../../components/UI/FilterButton/FilterButton";
import Input from "../../../components/UI/Input/Input";
import Button from "../../../components/UI/Button/Button";
import { initOutOfStock } from "../../../store";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Message from "../../../components/UI/Message/Message";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { storeNotificationMessenger } from "../../../Utility/general/general";

const OsReport = (props) => {
  const dispatch = useDispatch();
  const osRef = useRef();
  const [state, setState] = useState({
    form: false,
    loading: false,
    report: [],
  });
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;
  const mainMessageHandler = useCallback(
    (message) => dispatch(sendMessage(message)),
    [dispatch]
  );
  const clearMessageHandler = useCallback(
    () => dispatch(clearMessage()),
    [dispatch]
  );
  const sendProductMessageHandler = useCallback(
    (message, errorMessage, error) =>
      dispatch(sendProductMessenger(message, errorMessage, error)),
    [dispatch]
  );
  const resetProductMessageHandler = useCallback(
    () => dispatch(resetProductMessenger()),
    [dispatch]
  );
  const outOfStockHandler = useCallback(
    (setState, token, object) =>
      dispatch(initOutOfStock(setState, token, object)),
    [dispatch]
  );

  const outOfStockFormHandler = useCallback(
    (e, setState, token) => {
      e.preventDefault();
      const form = Object.fromEntries(new FormData(e.target).entries());
      outOfStockHandler(setState, token, form);
    },
    [dispatch]
  );
  const downloadPdf = async () => {
    if (state.report.length) {
      setState((prevState) => {
        return {
          ...prevState,
          loading: true,
        };
      });
      const input = osRef.current;
      try {
        const canvas = await html2canvas(input);
        const imgData = canvas.toDataURL("/image/png");
        const pdf = new jsPDF("p", "mm", "a4", true);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
        const imgX = (pdfWidth - imgWidth * ratio) / 2;
        const imgY = 10;
        pdf.addImage(
          imgData,
          "PNG",
          imgX,
          imgY,
          imgWidth * ratio,
          imgHeight * ratio
        );
        pdf.save("ReOrderLevel.pdf");
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
      } catch (error) {
        sendProductMessageHandler(error.message, true);
        setTimeout(() => {
          resetProductMessageHandler();
        }, 3000);
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
          };
        });
      }
    } else {
      sendProductMessageHandler("No report to download", true);
      setTimeout(() => {
        resetProductMessageHandler();
      }, 3000);
    }
  };
  useEffect(() => {
    outOfStockHandler(setState, token, {});
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
      <Message
        message={message}
        error={errorMessage}
      />
      {!isAuthenticated && !token && (
        <Navigate
          replace={true}
          to='/pharma-app/login'
        />
      )}
      <div>
        <div
          className={classes.osReport}
          ref={osRef}
        >
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
          {state.form && (
            <form
              className={classes.formFilter}
              onSubmit={(e) => outOfStockFormHandler(e, setState, token)}
            >
              <h4>FILTER BY DATE</h4>
              <Input
                config={{ name: "startDate", type: "date", required: true }}
                label='START DATE'
              />
              <Input
                config={{ name: "endDate", type: "date", required: true }}
                label='END DATE'
              />
              <Input
                config={{ name: "type", required: true }}
                label='TYPE'
                inputType='select'
                options={["NOT AVAILABLE", "OUT OF STOCK"]}
              />

              <Button config={{ type: "submit", className: classes.hold }}>
                SUBMIT
              </Button>
            </form>
          )}
          <h4>OUT OF STOCK REPORT</h4>
          <div className={[classes.structure, classes.title].join(" ")}>
            <div>S/N</div>
            <div>PRODUCT NAME</div>
            <div>NUMBER</div>
          </div>
          {state.loading ? (
            <Spinner />
          ) : state.report.length ? (
            state.report.map((rep, i) => (
              <div
                className={[classes.structure, classes.productItem].join(" ")}
                key={i}
              >
                <div>{i + 1}</div>
                <div>{rep.productName}</div>
                <div className={classes.repNumber}>{rep.number}</div>
              </div>
            ))
          ) : (
            <div className={classes.empty}>NO OUT OF STOCK REPORT FOUND</div>
          )}
        </div>
        <Button
          config={{ className: classes.hold, disabled: !state.report.length }}
          changed={() => downloadPdf()}
        >
          DOWNLOAD
        </Button>
      </div>
    </Fragment>
  );
};

export default OsReport;
