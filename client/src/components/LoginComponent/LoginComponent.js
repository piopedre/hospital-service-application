import React from "react";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import classes from "./LoginComponent.module.css";
const LoginComponent = (props) => {
  return (
    <div className={classes.container}>
      <form
        onSubmit={(e) => props.userLogin(e, props.state)}
        className={classes.loginForm}
      >
        <h3 className={classes.login}>Login into {props.department}</h3>
        <div className={classes.location}>
          <Input
            error={props.error}
            inputType='select'
            config={{
              name: "location",
              value: props.state.location,
            }}
            changed={(e) => {
              if (props.error) {
                props.clearError();
              }
              props.setState((prevState) => {
                return {
                  ...prevState,
                  location: prevState.locations.find(
                    (loc) => loc.name === e.target.value
                  ).name,
                };
              });
            }}
            title='LOCATION'
            options={props.state.locations?.map((loc) => loc.name)}
          />
        </div>

        <div
          className={
            props.department === "PHARMACY"
              ? classes.clinicUnit
              : classes.singleUnit
          }
        >
          {props.department === "PHARMACY" ? (
            <Input
              error={props.error}
              title='CLINIC'
              inputType='select'
              config={{ name: "clinic", value: props.state.clinic }}
              options={props.state.clinics.map((clinic) => clinic.name)}
              changed={(e) => {
                if (props.error) {
                  props.clearError();
                }
                props.setState((prevState) => {
                  return {
                    ...prevState,
                    clinic: prevState.clinics.find(
                      (clinic) => clinic.name === e.target.value
                    ).name,
                  };
                });
              }}
            />
          ) : null}
          <Input
            error={props.error}
            inputType='select'
            config={{
              name: "unit",
              value: props.state.unit,
            }}
            title='UNIT'
            options={props.state.units?.map((unit) => unit.name)}
            changed={(e) => {
              if (props.error) {
                props.clearError();
              }
              props.setState((prevState) => {
                return {
                  ...prevState,
                  unit: prevState.units.find(
                    (unit) => unit.name === e.target.value
                  ).name,
                };
              });
            }}
          />
        </div>

        <Input
          error={props.error}
          config={{
            defaultValue: props.state.user?.name,
            name: "username",
            readOnly: true,
            type: "text",
          }}
        />
        <Input
          error={props.error}
          config={{
            type: "password",
            name: "password",
            placeholder: "PASSWORD",
            required: true,
          }}
          changed={() => {
            if (props.error) {
              props.clearError();
            }
          }}
        />
        <Button
          config={{
            className: classes.confirm,
          }}
        >
          LOGIN
        </Button>
      </form>
    </div>
  );
};

export default React.memo(LoginComponent);
