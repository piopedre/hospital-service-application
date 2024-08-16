import React, {
  useCallback,
  useEffect,
  useState,
  Fragment,
  useRef,
} from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { useDispatch, useSelector } from "react-redux";
import {
  sendMessage,
  clearMessage,
  sendProductMessenger,
  resetProductMessenger,
} from "../../../store";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import Message from "../../../components/UI/Message/Message";
import Button from "../../../components/UI/Button/Button";
import classes from "./PharmacovigilanceReport.module.css";
import { Navigate } from "react-router-dom";
import { getPharmacovigilances } from "../../../store/actions/action/patientServices/pharmacovigilanceAction";
import FilterIcon from "../../../components/UI/FilterButton/FilterIcon/FilterIcon";
import FilterButton from "../../../components/UI/FilterButton/FilterButton";
import Input from "../../../components/UI/Input/Input";
import PharmacovigilancePreview from "../../../components/PharmacovigilanceForm/PharmacovigilancePreview/PharmacovigilancePreview";
import Spinner from "../../../components/UI/Spinner/Spinner";
import { storeNotificationMessenger } from "../../../Utility/general/general";

const PharmacovigilanceReport = (props) => {
  const dispatch = useDispatch();
  const pdfRef = useRef();
  const [state, setState] = useState({
    forms: [],
    form: null,
    filter: false,
    concomitantMedicines: [],
    startDate: "",
    endDate: "",
  });
  const token = JSON.parse(sessionStorage.getItem("token"));

  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
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
  const getPharmacovigilanceHandler = useCallback(
    (object, token, setState) =>
      dispatch(getPharmacovigilances(object, token, setState)),
    [dispatch]
  );
  const sendProductMessageHandler = useCallback(
    (message, errorMessage, error) =>
      dispatch(sendProductMessenger(message, errorMessage, error)),
    [dispatch]
  );
  const resetProductMessageHandler = useCallback(() =>
    dispatch(resetProductMessenger())
  );
  useEffect(() => {
    getPharmacovigilanceHandler({}, token, setState);
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
  const newMonths = [...state.forms].reduce((acc, cur, i) => {
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
  // FOR DOWNLOAD
  // Report for Pharmacoviligance Report
  const downloadPdf = async () => {
    setState((prevState) => {
      return {
        ...prevState,
        loading: true,
      };
    });
    const input = pdfRef.current;
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
      pdf.save("pharmacovigilanceForm.pdf");
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
  let pharmaReports = <div className={classes.empty}>NO REPORT PRESENT</div>;
  if (state.forms.length) {
    pharmaReports = [...state.forms].map((rep, i) => {
      const notify = newMonths.find((data) => data.index === i);

      if (notify) {
        return (
          <Fragment key={i}>
            <div className={classes.month}>{newMonths[i].month}</div>
            <div
              className={[classes.structure, classes.item].join(" ")}
              onClick={() =>
                setState((prevState) => {
                  return {
                    ...prevState,
                    form: rep.form,
                    concomitantMedicines: [...rep.form.concomitantMedicines],
                  };
                })
              }
            >
              <div
                style={{
                  color: "#25447d",
                }}
              >
                <div>
                  {Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(
                    Date.parse(rep?.createdAt || new Date())
                  )}
                </div>
                <div
                  style={{
                    fontSize: "large",
                  }}
                >
                  {Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(
                    Date.parse(rep?.createdAt || new Date())
                  )}
                </div>
              </div>
              <div>{rep.form.patient}</div>
              <div className={classes.desktopOnly}>{rep.form.brandName}</div>
              <div>{rep.form.reporter}</div>
            </div>
          </Fragment>
        );
      } else {
        return (
          <div
            className={[classes.structure, classes.item].join(" ")}
            key={i}
            onClick={() =>
              setState((prevState) => {
                return {
                  ...prevState,
                  form: rep.form,
                  concomitantMedicines: [...rep.form.concomitantMedicines],
                };
              })
            }
          >
            <div
              style={{
                color: "#25447d",
              }}
            >
              <div>
                {Intl.DateTimeFormat("en-GB", { weekday: "short" }).format(
                  Date.parse(rep?.createdAt || new Date())
                )}
              </div>
              <div
                style={{
                  fontSize: "large",
                }}
              >
                {Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(
                  Date.parse(rep?.createdAt || new Date())
                )}
              </div>
            </div>
            <div>{rep.form.patient}</div>
            <div className={classes.desktopOnly}>{rep.form.brandName}</div>
            <div>{rep.form.reporter}</div>
          </div>
        );
      }
    });
  }

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
      <ChatMessenger message={mainMessage} />
      {!isAuthenticated && !token && (
        <Navigate
          replace={true}
          to='/pharma-app/log-out'
        />
      )}
      <div className={classes.ctn}>
        {state.loading ? (
          <Spinner />
        ) : state.form ? (
          <div>
            <PharmacovigilancePreview
              state={state}
              pdfRef={pdfRef}
            />
            <Button
              config={{ className: classes.hold }}
              changed={() => downloadPdf()}
            >
              DOWNLOAD PDF
            </Button>
            <Button
              changed={() =>
                setState((prevState) => {
                  return {
                    ...prevState,
                    form: null,
                    concomitantMedicines: [],
                  };
                })
              }
              config={{ className: classes.closeBtn }}
            >
              {" "}
              ✕
            </Button>
          </div>
        ) : (
          <Fragment>
            <h4>PHARMACOVIGILANCE REPORTS</h4>
            <div className={[classes.structure, classes.headings].join(" ")}>
              <div>DATE</div>
              <div>PATIENT</div>
              <div className={classes.desktopOnly}>DRUG</div>
              <div>PHARMACIST</div>
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
                    getPharmacovigilanceHandler({}, token, setState);
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
                  onSubmit={(e) => {
                    e.preventDefault();
                    setState((prevState) => {
                      return {
                        ...prevState,
                        filter: false,
                      };
                    });
                    const form = Object.fromEntries(
                      new FormData(e.target).entries()
                    );
                    getPharmacovigilanceHandler(form, token, setState);
                  }}
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
            {pharmaReports}
          </Fragment>
        )}
      </div>
    </Fragment>
  );
};

export default PharmacovigilanceReport;
