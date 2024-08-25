import React from "react";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import classes from "./PrescriptionFormat.module.css";
const prescriptionFormat = React.memo((props) => {
  return (
    <div className={classes.prescriptionFormat}>
      <h4 className={classes.title}>SET PRESCRIPTION FORMAT</h4>
      <Input
        config={{
          name: "clinicType",
          value: props.format.clinicType,
        }}
        title='CLINIC TYPE'
        inputType='select'
        options={["PSYCHIATRY", "GENERAL MEDICAL SERVICES"]}
        changed={(e) => props.setPrescriptionFormat(e, props.setFormat)}
      />
      <Input
        config={{
          name: "serviceType",
          value: props.format.serviceType,
        }}
        inputType='select'
        title='SERVICE TYPE'
        options={["OUT-PATIENT", "IN-PATIENT", "REQUISTION"]}
        changed={(e) => {
          props.setPrescriptionFormat(e, props.setFormat);
          props.setPreview((prevState) => {
            return {
              ...prevState,
              selectedReceipent: "",
              receipent: null,
            };
          });
        }}
      />
      <Input
        config={{
          name: "pricingType",
          value: props.format.pricingType,
        }}
        inputType='select'
        title='PRICING TYPE'
        options={["NORMAL", "NHIA", "NYSC", "NNPC", "FUCC", "COMMUNITY"]}
        changed={(e) => {
          props.updatePrescriptionPrice(
            e.target.value,
            props.setPrescription,
            props.setNumber,
            props.setTotalPrice,
            props.products
          );
          props.setPrescriptionFormat(e, props.setFormat);
        }}
      />
      <Button
        config={{
          className: classes.confirm,
        }}
        changed={() => {
          props.modal(false);
        }}
      >
        CONFIRM
      </Button>
    </div>
  );
});

export default prescriptionFormat;
