import {
  getTransfersMethod,
  initReceiveRequistion,
  initRequistion,
  addNotificationAction,
} from "../../store";
import notificationSound from "../../assets/tones/notification.mp3";
import welcome from "../../assets/tones/welcome.mp3";
export async function sendReq(token, data, reqFunction, ResponseError) {
  try {
    const response = await reqFunction(token, data);
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
    return response;
  } catch (err) {
    return { err };
  }
}
export function playWelcomeSound() {
  const audio = new Audio(welcome);
  audio.play();
}

export function playNotificationSound() {
  const audio = new Audio(notificationSound);
  audio.play();
}

export async function sendEditReq(token, reqFunction, id, data, ResponseError) {
  try {
    const response = await reqFunction(token, id, data);
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
    return response;
  } catch (err) {
    return { err };
  }
}
export async function getReqById(ResponseError, reqFunction, token, id) {
  try {
    const response = await reqFunction(token, id);
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
    return response;
  } catch (error) {
    return { error };
  }
}
export async function getDatabase(
  token,
  reqFunction,
  location,
  unit,
  clinic,
  ResponseError
) {
  let message = null;
  const response = await reqFunction(token, location, unit, clinic);
  try {
    if (!response.ok) {
      throw new ResponseError("Bad Fetch Response", response);
    }
    return response;
  } catch (err) {
    switch (err?.response?.status) {
      case 400:
        message = "Error, Fetching Database";
        break;
      case 401:
        message = "Unauthorized";
        break;
      case 404:
        message = "Database is empty";
        break;
      case 500:
        message = " error, connecting to server";
        break;
      default:
        return {
          message,
          err,
        };
    }
    return {
      message,
      err,
    };
  }
}
// receipt
export async function addReceipt(token, data) {
  const response = await fetch("/api/receipts", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-type": "application/json",
    },
    body: data,
  });
  return response;
}
// departments
export async function getDepartmentsRequest() {
  const response = await fetch("/api/department", {
    method: "GET",
    headers: {
      "Content-type": "application/json",
    },
  });
  return response;
}
export function getDate(formattedDate) {
  const date = new Date(formattedDate);
  return `${Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(
    date
  )}-${Intl.DateTimeFormat("en-GB", { month: "2-digit" }).format(
    date
  )}-${Intl.DateTimeFormat("en-GB", { day: "2-digit" }).format(date)}`;
}

export const storeNotificationMessenger = (
  socket,
  mainMessageHandler,
  clearMessageHandler,
  dispatch,
  setState
) => {
  const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
  const locationName = JSON.parse(sessionStorage.getItem("location"))?.name;
  const clinicName = JSON.parse(sessionStorage.getItem("clinic"))?.name;
  socket.on("requistion_message", (message) => {
    const token = JSON.parse(sessionStorage.getItem("token"));
    const $location = JSON.parse(sessionStorage.getItem("location"))?.id;
    const unit = JSON.parse(sessionStorage.getItem("unit"))?.id;
    const clinic = JSON.parse(sessionStorage.getItem("clinic"))?.id;

    if (message.type === "transfer") {
      if (
        message.locationName === locationName &&
        message.unit === unitName &&
        clinicName === message.clinic
      ) {
        setTimeout(() => {
          playNotificationSound();
        }, 300);
        // init Transfers
        if (window.location.pathname === "/pharma-app/transfer-products") {
          if (dispatch) {
            dispatch(
              getTransfersMethod(token, setState, $location, unit, clinic)
            );
          }
        }

        setTimeout(() => {
          clearMessageHandler();
        }, 4000);
        mainMessageHandler(`${message.message}`);
      }
    } else {
      if (message.type === "sending" && unitName === "STORE") {
        setTimeout(() => {
          playNotificationSound();
        }, 300);
        // init Requistions
        if (window.location.pathname === "/pharma-app/issue-products") {
          if (dispatch) {
            dispatch(initRequistion(token, setState, $location, unit));
          }
        }

        setTimeout(() => {
          clearMessageHandler();
        }, 4000);
        mainMessageHandler(`${message.message}`);
      } else {
        if (message.type === "issuedRequistion") {
          if (
            message.clinicName === clinicName &&
            message.unitName === unitName &&
            message.locationName === locationName
          ) {
            setTimeout(() => {
              playNotificationSound();
            }, 300);
            if (window.location.pathname === "/pharma-app/requistion") {
              if (dispatch) {
                dispatch(
                  initReceiveRequistion(
                    token,
                    setState,
                    $location,
                    unit,
                    clinic
                  )
                );
              }
            }
            setTimeout(() => {
              clearMessageHandler();
            }, 4000);
            mainMessageHandler(`${message.message}`);
          }
        }
      }
    }
  });
  socket.on("notification_message", (message) => {
    const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
    if (message.type === "requistion" && unitName === "STORE") {
      // check message
      // add it to the notification array
      dispatch(addNotificationAction(message));
    } else if (message.type === "message") {
      // check if notification
      const notSender = message.chat.users.filter(
        (user) => user !== message.sender
      );

      const isReceiver = notSender.find(
        (user) => user === JSON.parse(sessionStorage.getItem("id"))?._id
      );

      if (isReceiver) {
        dispatch(addNotificationAction(message));
      }
    } else {
      if (
        message.clinic?.name === clinicName &&
        message.unit?.name === unitName &&
        message.location?.name === locationName
      ) {
        dispatch(addNotificationAction(message));
      }
    }
  });
  socket.on("message received", (newMessageReceived) => {
    setTimeout(() => {
      clearMessageHandler();
    }, 4000);
    if (!newMessageReceived.chat.isGroupChat) {
      mainMessageHandler(
        `New Message from ${newMessageReceived.sender.firstName} ${newMessageReceived.sender.lastName}`
      );
    } else {
      mainMessageHandler(
        `Message from ${newMessageReceived.sender.firstName} ${newMessageReceived.sender.lastName} in ${newMessageReceived.chat.name}`
      );
    }
  });
  return () => {
    socket.off("message received");
    socket.off("requistion_message");
    socket.off("notification_message");
  };
};
export const messageAppNotification = (
  socket,
  mainMessageHandler,
  clearMessageHandler,
  dispatch
) => {
  const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
  const locationName = JSON.parse(sessionStorage.getItem("location"))?.name;
  const clinicName = JSON.parse(sessionStorage.getItem("clinic"))?.name;
  socket.on("requistion_message", (message) => {
    if (message.type === "transfer") {
      if (
        message.locationName === locationName &&
        message.unit === unitName &&
        clinicName === message.clinic
      ) {
        setTimeout(() => {
          clearMessageHandler();
        }, 4000);
        mainMessageHandler(`${message.message}`);
      }
    } else {
      if (message.type === "sending" && unitName === "STORE") {
        setTimeout(() => {
          clearMessageHandler();
        }, 4000);
        mainMessageHandler(`${message.message}`);
      } else {
        if (message.type === "issuedRequistion") {
          if (
            message.clinicName === clinicName &&
            message.unitName === unitName &&
            message.locationName === locationName
          ) {
            setTimeout(() => {
              clearMessageHandler();
            }, 4000);
            mainMessageHandler(`${message.message}`);
          }
        }
      }
    }
  });
  socket.on("notification_message", (message) => {
    const unitName = JSON.parse(sessionStorage.getItem("unit"))?.name;
    if (message.type === "requistion" && unitName === "STORE") {
      // check message      // add it to the notification array message chat.id.users === present user.Id
      dispatch(addNotificationAction(message));
    } else if (message.type === "message") {
      // check if notification
      const notSender = message.chat.users.filter(
        (user) => user !== message.sender
      );

      const isReceiver = notSender.find(
        (user) => user === JSON.parse(sessionStorage.getItem("id"))?._id
      );

      if (isReceiver) {
        dispatch(addNotificationAction(message));
      }
    } else {
      if (
        message.clinic?.name === clinicName &&
        message.unit?.name === unitName &&
        message.location?.name === locationName
      ) {
        dispatch(addNotificationAction(message));
      }
    }
  });
  return () => {
    socket.off("requistion_message");
    socket.off("notification_message");
  };
};
export const getExpiryQuantityAnalysis = (products, startDate, endDate) => {
  return Object.entries(
    products
      .flatMap((pr) => pr.expiries)
      .filter((product) => {
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          if (
            start.getTime() >= new Date(product.expiryDate).getTime() &&
            new Date(product.expiryDate).getTime() < end.getTime()
          ) {
            return product;
          }
        }
      })
      .reduce((acc, cur) => {
        acc[cur.name]
          ? (acc[cur.name] += cur.quantity)
          : (acc[cur.name] = cur.quantity);

        return acc;
      }, {})
  ).reduce(
    (acc, cur) => {
      const [x, y] = cur;
      acc.x.push(x);
      acc.y.push(y);
      return acc;
    },
    {
      x: [],
      y: [],
      type: "bar",
      name: "Product Quantity",
      marker: {
        color: "#f1bc97",
      },
    }
  );
};
export const getExpiryTotalPriceAnalysis = (products, startDate, endDate) => {
  return Object.entries(
    products
      .flatMap((pr) => pr.expiries)
      .filter((product) => {
        if (startDate && endDate) {
          const start = new Date(startDate);
          const end = new Date(endDate);
          if (
            start.getTime() >= new Date(product.expiryDate).getTime() &&
            new Date(product.expiryDate).getTime() < end.getTime()
          ) {
            return product;
          }
        }
      })
      .reduce((acc, cur) => {
        acc[cur.name]
          ? (acc[cur.name] += cur.totalPrice)
          : (acc[cur.name] = cur.totalPrice);

        return acc;
      }, {})
  ).reduce(
    (acc, cur) => {
      const [x, y] = cur;
      acc.x.push(x);
      acc.y.push(y);
      return acc;
    },
    {
      x: [],
      y: [],
      type: "bar",
      name: "Product Price",
      marker: {
        color: "#25447d",
      },
    }
  );
};
