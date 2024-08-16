import React, { memo } from "react";
import Input from "../../UI/Input/Input";
import Button from "../../UI/Button/Button";
import classes from "./UsernameLoginComponent.module.css";
import pharmacyImage from "../../../assets/images/pharmacy.avif";
const usernameLoginComponent = memo((props) => {
  return (
    <form
      className={classes.loginForm}
      onSubmit={(e) => props.getUsername(e, props.setState, props.state)}
    >
      <h3 className={classes.login}> Department Login</h3>
      <Input
        inputType='select'
        options={props.departments.map((dep) => dep.name)}
        changed={(e) => {
          props.setState((prevState) => {
            return {
              ...prevState,
              [e.target.name]: prevState.departments.find(
                (dep) => dep.name === e.target.value
              ).name,
              departmentId: prevState.departments.find(
                (dep) => dep.name === e.target.value
              )._id,
            };
          });
        }}
        title='DEPARTMENT'
        config={{
          name: "department",
          ref: props.departmentRef,
          value: props.department,
          required: true,
        }}
      />
      <Input
        config={{
          placeholder: "USERNAME",
          name: "username",
          required: true,
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
  );
});

export default usernameLoginComponent;
