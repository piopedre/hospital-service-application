import React, { useState, useCallback, useEffect, Fragment } from "react";
import classes from "./Supplies.module.css";
import Button from "../../../components/UI/Button/Button";
import FilterButton from "../../../components/UI/FilterButton/FilterButton";
import SalesItem from "../../../components/SalesItem/SalesItem";
import Message from "../../../components/UI/Message/Message";
import Spinner from "../../../components/UI/Spinner/Spinner";
import Input from "../../../components/UI/Input/Input";
import Backdrop from "../../../components/UI/Backdrop/Backdrop";
import PreviewItem from "../../../components/PreviewItem/PreviewItem";
import ChatMessenger from "../../../components/UI/ChatMessenger/ChatMessenger";
import { useSelector, useDispatch } from "react-redux";
import {
  deleteSupply,
  filterSupplies,
  initSupplies,
  sendMessage,
  clearMessage,
} from "../../../store";
import { Navigate } from "react-router-dom";
import { setSelectedSupplyHandler } from "../../../Utility/receivedProducts/receivedProducts";
import { storeNotificationMessenger } from "../../../Utility/general/general";
const Supplies = (props) => {
  const dispatch = useDispatch();
  const [state, setState] = useState({
    supplies: [],
    suppliers: [],
    preview: false,
    selectedSupply: null,
    loading: false,
    modal: false,
    deleteModal: false,
  });
  const token = JSON.parse(sessionStorage.getItem("token"));
  const $location = JSON.parse(sessionStorage.getItem("location"));
  const unit = JSON.parse(sessionStorage.getItem("unit"));
  const clinic = JSON.parse(sessionStorage.getItem("clinic"));
  const message = useSelector((state) => state.addProduct.message);
  const errorMessage = useSelector((state) => state.addProduct.errorMessage);
  const isAuthenticated = useSelector((state) => state.login.isAuthenticated);
  const mainMessage = useSelector((state) => state.messenger.message);
  const initSuppliesHandler = useCallback(
    (token, setState, location, unit, clinic) =>
      dispatch(initSupplies(token, setState, location, unit, clinic)),
    [dispatch]
  );

  const filterSuppliesHandler = useCallback(
    (e, token, setState, state, location, unit, clinic) =>
      dispatch(
        filterSupplies(e, token, setState, state, location, unit, clinic)
      ),
    [dispatch]
  );
  const deleteSupplyHandler = useCallback(
    (token, id, setState, location, unit, clinic, products) =>
      dispatch(
        deleteSupply(token, id, setState, location, unit, clinic, products)
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
  useEffect(() => {
    initSuppliesHandler(token, setState, $location?.id, unit?.id, clinic?.id);
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
    <div className={classes.suppliesReport}>
      <Backdrop
        show={state.modal}
        closed={() =>
          setState((prevState) => {
            return {
              ...prevState,
              modal: false,
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

      {state.modal && (
        <form
          className={classes.filterForm}
          onSubmit={(e) =>
            filterSuppliesHandler(
              e,
              token,
              setState,
              state,
              $location?.id,
              unit?.id,
              clinic?.id
            )
          }
        >
          <h5>FILTER SUPPLIES</h5>
          <Input
            config={{
              name: "startDate",
              type: "month",
              required: true,
            }}
            label='START DATE'
          />
          <Input
            config={{
              name: "endDate",
              type: "month",
              required: true,
            }}
            label='END DATE'
          />
          <Input
            config={{
              name: "supplier",
              required: true,
            }}
            title='SUPPLIER'
            inputType='select'
            options={[
              "ALL",
              ...state.suppliers.map((supplier) => supplier.name),
            ]}
          />
          <Input
            config={{
              name: "exchange",
              required: true,
            }}
            title='TYPE'
            inputType='select'
            options={["ALL", "EXCHANGE", "SUPPLY"]}
          />
          <Button
            config={{
              className: classes.hold,
            }}
          >
            SUBMIT
          </Button>
        </form>
      )}

      {state.preview ? null : (
        <Fragment>
          <h4 className={classes.title}>LIST OF SUPPLIES</h4>
          <div className={classes.filter}>
            <FilterButton
              changed={() =>
                setState((prevState) => {
                  return {
                    ...prevState,
                    modal: !prevState.modal,
                  };
                })
              }
            />
          </div>
        </Fragment>
      )}

      {(state.loading && <Spinner />) ||
        (state.preview ? (
          <PreviewItem
            products={state.selectedSupply.products}
            unit={state.selectedSupply.unit}
            location={state.selectedSupply.location}
            supplier={state.selectedSupply.supplier}
            setState={setState}
            token={token}
            id={state.selectedSupply._id}
            deleteModal={state.deleteModal}
            mainLocation={$location}
            mainUnit={unit}
            clinic={clinic}
            deleteItem={deleteSupplyHandler}
            supplies
          />
        ) : (
          <SalesItem
            sales={state.supplies}
            state={state}
            setState={setState}
            checkDetails={setSelectedSupplyHandler}
          />
        ))}
    </div>
  );
};

export default Supplies;
