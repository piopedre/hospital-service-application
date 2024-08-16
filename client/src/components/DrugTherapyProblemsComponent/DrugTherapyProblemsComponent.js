import React from "react";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import Modal from "../Modal/Modal";
import classes from "./DrugTherapyProblemsComponent.module.css";
import Spinner from "../UI/Spinner/Spinner";
const drugTherapyProblemsComponent = React.memo((props) => {
  return (
    <Modal
      show={props.state.show}
      modalClosed={props.closed}
    >
      {props.state.loading ? (
        <Spinner />
      ) : (
        <form
          className={classes.drugTherapy}
          onSubmit={(e) =>
            props.addDtp(
              e,
              props.token,
              props.setState,
              props.preview,
              props.location,
              props.unit,
              props.clinic
            )
          }
        >
          <h3>ADD DRUG THERAPY PROBLEM</h3>
          <Input
            config={{
              name: "drugTherapyProblem",
              required: true,
            }}
            title='DRUG THERAPY PROBLEM'
            inputType='select'
            options={[
              "UNNECESSARY DRUG THERAPY",
              "NEEDS ADDITIONAL DRUG",
              "WRONG DRUG",
              "DOSE TOO LOW",
              "DOSE TOO HIGH",
              "ADVERSE DRUG REACTION",
              "NONCOMPLIANCE",
            ]}
          />

          <Input
            label='INTERVENTION'
            config={{
              name: "intervention",
              required: true,
              placeholder: "Intervention ....",
              autoFocus: true,
            }}
            inputType='text-area'
          />
          <Input
            title='OUTCOME'
            inputType='select'
            options={["SUCCESSFUL", "UNSUCCESSFUL"]}
            config={{
              name: "outcome",
              required: true,
              placeholder: "Outcome ....",
            }}
          />
          <Button
            config={{
              className: classes.confirm,
            }}
          >
            ADD
          </Button>
        </form>
      )}
    </Modal>
  );
});

export default drugTherapyProblemsComponent;
