import React, {
  Fragment,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  initProductDatabase,
  clearProductDatabaseError,
  clearMessage,
  sendMessage,
  sendProductMessenger,
  resetProductMessenger,
  clearAuthentication,
  setReorderHandler,
} from "../../../store";
import FilterButton from "../../../components/UI/FilterButton/FilterButton";
import Input from "../../../components/UI/Input/Input";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import ErrorHandler from "../../../hoc/ErrorHandler/ErrorHandler";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Message from "../../../components/UI/Message/Message";
import ReOrderLevelComponent from "../../../components/ReOrderLevelComponent/ReOrderLevelComponent";
import Button from "../../../components/UI/Button/Button";
import classes from "./ReOrderLevel.module.css";
import { Navigate } from "react-router-dom";
import { calculateReorderLevelRequest } from "../../../Utility/sales/sales";
import {
  getDate,
  storeNotificationMessenger,
} from "../../../Utility/general/general";
const ReOrderLevel = React.memo((props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    loading: false,
    reorderList: [],
    form: false,
  });
  const reOrderRef = useRef();
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
  const initProductDatabaseHandler = useCallback(
    (token, location, unit, clinic) =>
      dispatch(initProductDatabase(token, location, unit, clinic)),
    [dispatch]
  );
  const clearProductDatabaseErrorHandler = useCallback(
    () => dispatch(clearProductDatabaseError()),
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
  const sendProductMessageHandler = useCallback(
    (message, errorMessage, error) =>
      dispatch(sendProductMessenger(message, errorMessage, error)),
    [dispatch]
  );
  const resetProductMessageHandler = useCallback(
    () => dispatch(resetProductMessenger()),
    [dispatch]
  );
  const clearAuthenticationHandler = useCallback(
    (status) => dispatch(clearAuthentication(status)),
    [dispatch]
  );
  const setReOrderLevelHandler = useCallback(
    (token, location, unit, clinic) =>
      dispatch(setReorderHandler(token, location, unit, clinic)),
    [dispatch]
  );
  const downloadPdf = async () => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    const input = reOrderRef.current;
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
  };
  const getReOrderProducts = (products, setState) => {
    const reorderProducts = products.filter(
      (pr) => pr.quantity && pr.minimumQuantity >= pr.quantity
    );
    setState((prevState) => {
      return {
        ...prevState,
        reorderList: [...reorderProducts],
      };
    });
  };
  const calculateReOrderLevelHandler = async (e, setState) => {
    e.preventDefault();
    setState((prevState) => {
      return {
        ...prevState,
        form: false,
        loading: true,
      };
    });
    const format = Object.fromEntries(new FormData(e.target).entries());

    const presentDate = new Date();
    const formattedDate = presentDate.setMonth(
      presentDate.getMonth() - +format.date,
      0
    );
    const dateString = getDate(formattedDate);
    try {
      const response = await calculateReorderLevelRequest(
        token,
        JSON.stringify({ date: dateString, type: "store" })
      );

      if (response?.ok) {
        initProductDatabaseHandler(token, $location, unit, clinic);
        setState((prevState) => {
          return {
            ...prevState,
            loading: false,
            reorderList: [],
          };
        });
      } else {
        throw {
          message: response.statusText,
          status: response.status,
        };
      }
    } catch (error) {
      if (error.status === 401) {
        clearAuthenticationHandler(error.status);
      }
      setState((prevState) => {
        return {
          ...prevState,
          loading: false,
        };
      });
    }
  };
  const length = productDatabase.length;
  const reorderListLength = state.reorderList.length;
  useEffect(() => {
    initProductDatabaseHandler(token, $location, unit, clinic);
    setReOrderLevelHandler(token, $location, unit, clinic);
  }, []);

  useEffect(() => {
    if (length && !reorderListLength) {
      getReOrderProducts(productDatabase, setState);
    }
  }, [length, reorderListLength]);

  useEffect(() => {
    storeNotificationMessenger(
      props.socket,
      mainMessageHandler,
      clearMessageHandler,
      dispatch
    );
  }, [props.socket]);
  return (
    <div className={classes.container}>
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
          error={productDatabaseError.message}
          status={productDatabaseError.status}
          clearError={clearProductDatabaseErrorHandler}
        />
      )}
      {productDatabaseLoader || state.loading ? (
        <Spinner />
      ) : (
        <Fragment>
          <div className={classes.mainCtn}>
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
            <div>
              {state.form ? (
                <form
                  className={classes.reorderForm}
                  onSubmit={(e) => calculateReOrderLevelHandler(e, setState)}
                >
                  <h3>Calculate Reorder Level</h3>
                  <Input
                    inputType='select'
                    options={[1, 2, 3, 4, 5, 6]}
                    title='MONTHLY DURATION'
                    config={{
                      name: "date",
                    }}
                  />
                  <Button config={{ className: classes.hold, type: "submit" }}>
                    SUBMIT
                  </Button>
                </form>
              ) : null}
            </div>

            <ReOrderLevelComponent
              state={state}
              setState={setState}
              reOrderRef={reOrderRef}
              downloadReOrder={downloadPdf}
            />
          </div>
        </Fragment>
      )}
    </div>
  );
});

export default ReOrderLevel;
