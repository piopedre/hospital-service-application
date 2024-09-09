import {
  resetProductMessenger,
  sendProductMessenger,
  clearAuthentication,
  SET_REQUISTION_LOADER,
  CLEAR_REQUISTION_LOADER,
  CLEAR_REQUISTION_MODAL,
  REQUISTION_MODAL,
  addNotificationAction,
} from "../../../index";
import {
  getLastRequistion,
  postRequistion,
} from "../../../../Utility/product/product";
import { calculateReorderLevelRequest } from "../../../../Utility/sales/sales";
import { getDate } from "../../../../Utility/general/general";
import { addNotificationRequest } from "../../../../Utility/users/usersChat";
const setRequistionLoader = () => {
  return {
    type: SET_REQUISTION_LOADER,
  };
};
export const clearRequistionLoader = () => {
  return {
    type: CLEAR_REQUISTION_LOADER,
  };
};
const requistionModal = () => {
  return {
    type: REQUISTION_MODAL,
  };
};
export const clearRequistionModal = () => {
  return {
    type: CLEAR_REQUISTION_MODAL,
  };
};
export const setMinimumQuantityHandler = (token, location, unit, clinic) => {
  const date = new Date();
  const newDate = date.setMonth(date.getMonth() - 1, 0);

  return async (dispatch) => {
    try {
      dispatch(setRequistionLoader());
      const setMinimumResponse = await calculateReorderLevelRequest(
        token,
        JSON.stringify({
          type: "otherUnits",
          date: newDate,
          location,
          unit,
          clinic,
        })
      );
      if (!setMinimumResponse?.ok) {
        throw {
          message: setMinimumResponse?.statusText,
          status: setMinimumResponse.status,
        };
      } else {
        dispatch(clearRequistionLoader());
      }
    } catch (error) {
      dispatch(clearRequistionLoader());
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
    }
  };
};
export const setReorderHandler = (token, location, unit, clinic) => {
  const date = new Date();
  const newDate = date.setMonth(date.getMonth() - 1, 0);

  return async (dispatch) => {
    try {
      dispatch(setRequistionLoader());
      const setMinimumResponse = await calculateReorderLevelRequest(
        token,
        JSON.stringify({
          type: "store",
          date: newDate,
          location,
          unit,
          clinic,
        })
      );
      if (!setMinimumResponse?.ok) {
        throw {
          message: setMinimumResponse?.statusText,
          status: setMinimumResponse.status,
        };
      } else {
        dispatch(clearRequistionLoader());
      }
    } catch (error) {
      dispatch(clearRequistionLoader());
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      }
    }
  };
};
export const validateRequistion = (requistion) => {
  return async (dispatch) => {
    if (!requistion.length) {
      dispatch(sendProductMessenger("Requistion cant be empty", true));
      setTimeout(() => {
        dispatch(resetProductMessenger());
      }, 3000);
    } else {
      const valid = requistion.every(
        (requiste) => requiste.get("stockRequired") > 0
      );
      if (valid) {
        dispatch(requistionModal());
      } else {
        dispatch(
          sendProductMessenger(
            "A requisted Product required stock is zero",
            true
          )
        );
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
      }
    }
  };
};
export const sendRequistion = (
  requistion,
  token,
  location,
  unit,
  numberOfProducts,
  totalPrice,
  setRequistion,
  setNumber,
  setPrice,
  clinic,
  socket,
  setRequistionComponent
) => {
  return async (dispatch) => {
    try {
      dispatch(setRequistionLoader());
      const newRequistion = requistion.map((requiste) =>
        Object.fromEntries(requiste)
      );
      const requistionObject = new Map();
      requistionObject.set("unit", unit);
      const lastRequistionResponse = await getLastRequistion(
        token,
        location,
        unit,
        clinic
      );
      if (lastRequistionResponse?.ok) {
        const [requistion] = await lastRequistionResponse.json();
        if (
          +Intl.DateTimeFormat("en-GB", { year: "numeric" }).format(
            Date.parse(`${requistion.createdAt}`)
          ) === new Date().getFullYear()
        ) {
          requistionObject.set("siv", requistion.siv + 1);
        } else {
          requistionObject.set("siv", 1);
        }
      } else {
        requistionObject.set("siv", 1);
      }
      requistionObject.set("location", location);
      requistionObject.set("clinic", clinic);
      requistionObject.set("requistionProcess", true);
      requistionObject.set("numberOfProducts", numberOfProducts);
      requistionObject.set("costOfRequistion", totalPrice);
      requistionObject.set("products", newRequistion);
      const response = await postRequistion(
        token,
        JSON.stringify(Object.fromEntries(requistionObject))
      );
      if (response?.ok) {
        dispatch(clearRequistionLoader());
        dispatch(clearRequistionModal());
        setRequistion([]);
        setNumber(0);
        setPrice(0);
        setRequistionComponent((prevState) => {
          return {
            ...prevState,
            requistionComponent: false,
          };
        });
        const clinic = JSON.parse(sessionStorage.getItem("clinic"));
        const $location = JSON.parse(sessionStorage.getItem("location"));
        const unit = JSON.parse(sessionStorage.getItem("unit"));
        socket.emit("requistion", {
          type: "sending",
          message: `Requistion was sent from ${$location?.name}, ${unit?.name}, ${clinic?.name}`,
        });

        const response = await addNotificationRequest(
          token,
          JSON.stringify({
            type: "requistion",
            message: `Requistion was sent from ${$location?.name}, ${unit?.name}, ${clinic?.name}`,
            read: false,
          })
        );
        if (response?.ok) {
          const notification = await response.json();
          // add notification to database
          socket.emit("notification", notification);
          dispatch(sendProductMessenger("Requistion sent successfully"));
          setTimeout(() => {
            dispatch(resetProductMessenger());
          }, 3000);
        }
      } else {
        throw new Object({
          message: response.statusText,
          status: response.status,
        });
      }
    } catch (error) {
      dispatch(clearRequistionLoader());
      if (error.status === 401) {
        dispatch(clearAuthentication(error.status));
      } else {
        dispatch(sendProductMessenger("unable to send requistion", true));
        setTimeout(() => {
          dispatch(resetProductMessenger());
        }, 3000);
      }
    }
  };
};
