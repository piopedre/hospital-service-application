import React from "react";
import classes from "./FilterReport.module.css";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
const filterReport = React.memo((props) => {
  return (
    <form
      className={classes.filterReport}
      onSubmit={(e) => {
        e.preventDefault();
        const form = Object.fromEntries(new FormData(e.target).entries());
        props.setState((prevState) => {
          return {
            ...prevState,
            filterReport: false,
            ...form,
          };
        });
      }}
      {...props.config}
    >
      <h5>Filter Report</h5>
      <Input
        config={{
          name: "report",
          required: true,
        }}
        inputType='select'
        options={["supply", "requistions", "both"]}
        title='REPORT'
      />
      <Input
        config={{
          name: "dataType",
          required: true,
        }}
        inputType='select'
        options={["product", "price", "both"]}
        title='TYPE'
      />
      <Button
        config={{
          className: classes.cancel,
        }}
        changed={(e) => {
          e.preventDefault();
          props.setState((prevState) => {
            return {
              ...prevState,
              filterReport: false,
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
  );
});

export default filterReport;
