import React, {
  Fragment,
  useCallback,
  useState,
  useEffect,
  useRef,
} from "react";
import { Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearProductSalesError,
  clearProductDatabaseError,
  clearMessage,
  sendMessage,
  initProductsReport,
  filterProductsReport,
  sendProductMessenger,
  resetProductMessenger,
} from "../../../store";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Message from "../../../components/UI/Message/Message";
import Report from "../../../components/Report/Report";
import FilterButton from "../../../components/UI/FilterButton/FilterButton";
import Button from "../../../components/UI/Button/Button";
import Input from "../../../components/UI/Input/Input";
import classes from "./ReportInventory.module.css";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const ReportInventory = (props) => {
  const dispatch = useDispatch();
  const reportRef = useRef();
  const [state, setState] = useState({
    loading: false,
    reports: [],
    forms: [],
    report: [],
    requistions: [],
    transfers: [],
    unitTransfers: [],
    exchanges: [],
    supplies: [],
    expiries: [],
    productList: [],
    startDate: null,
    endDate: null,
    filter: false,
  });
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);

  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
  const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
  const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;

  const productDatabase = useSelector(
    (state) => state.general.products.database
  );
  const productDatabaseError = useSelector(
    (state) => state.general.products.error
  );
  const productDatabaseLoader = useSelector(
    (state) => state.general.products.loading
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

  const clearProductDatabaseErrorHandler = useCallback(
    () => dispatch(clearProductDatabaseError()),
    [dispatch]
  );
  const clearProductSalesErrorHandler = useCallback(
    () => dispatch(clearProductSalesError()),
    [dispatch]
  );
  const productsReportHandler = useCallback(
    (token, setState, location, unit, clinic) =>
      dispatch(initProductsReport(token, setState, location, unit, clinic)),
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
  const filterReportHandler = useCallback(
    (e, token, setState, location, unit, clinic) =>
      dispatch(
        filterProductsReport(e, token, setState, location, unit, clinic)
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
  const downloadPdf = async () => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    const input = reportRef.current;
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
      const imgY = 0;
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
  };
  const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;

  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);
  useEffect(() => {
    productsReportHandler(token, setState, $location, unit, clinic);
  }, []);
  return (
    <Fragment>
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
      {productDatabaseError.message && (
        <ErrorHandler
          error={
            productDatabaseError.message || productSalesDatabaseError.message
          }
          status={
            productDatabaseError.status || productSalesDatabaseError.status
          }
          clearError={
            clearProductDatabaseErrorHandler || clearProductSalesErrorHandler
          }
        />
      )}
      {productDatabaseLoader || state.loading || productSalesDatabaseLoader ? (
        <Spinner />
      ) : (
        <div className={classes.reportCtn}>
          <Report
            state={state}
            setState={setState}
            products={productDatabase}
            sales={productSalesDatabase}
            unit={unitName}
            reportRef={reportRef}
          />
          <div className={classes.filter}>
            <FilterButton
              changed={() =>
                setState((prevState) => {
                  return {
                    ...prevState,
                    filter: !prevState.filter,
                  };
                })
              }
            />
          </div>
          {state.filter && (
            <form
              className={classes.filterForm}
              onSubmit={(e) =>
                filterReportHandler(e, token, setState, $location, unit, clinic)
              }
            >
              <h5>SET A TIMEFRAME</h5>
              <Input
                config={{ name: "startDate", type: "date", required: true }}
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
                config={{ name: "endDate", type: "date", required: true }}
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

              <Button config={{ className: classes.hold, type: "submit" }}>
                SUBMIT
              </Button>
            </form>
          )}
          <Button
            changed={() => downloadPdf()}
            config={{ className: classes.hold }}
          >
            DOWNLOAD
          </Button>
        </div>
      )}
    </Fragment>
  );
};

export default ReportInventory;
