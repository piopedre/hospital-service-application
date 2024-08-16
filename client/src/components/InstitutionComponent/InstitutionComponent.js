import React, { Fragment } from "react";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import classes from "./InstitutionComponent.module.css";
import Modal from "../Modal/Modal";
const institutionComponent = React.memo((props) => {
  return (
    <Fragment>
      <Modal
        show={props.state.unitModal}
        modalClosed={() =>
          props.setState((prevState) => {
            return {
              ...prevState,
              unitModal: false,
            };
          })
        }
      >
        <form
          className={classes.unitForm}
          onSubmit={(e) =>
            props.addUnitHandler(e, props.setState, props.state, props.token)
          }
        >
          <h5>ADD NEW UNIT</h5>
          <Input
            inputType='select'
            options={[...props.state.departments].map((dep) => dep.name)}
            title='DEPARTMENT'
            config={{
              placeholder: "DEPARTMENTS",
              required: true,
              autoFocus: true,
              name: "department",
            }}
          />
          <Input
            config={{
              placeholder: "UNIT",
              required: true,
              autoFocus: true,
              name: "name",
            }}
          />

          <Button config={{ className: classes.confirm }}>SUBMIT</Button>
        </form>
      </Modal>
      <form
        className={classes.form}
        onSubmit={(e) =>
          props.addComponentHandler(e, props.state, props.setState, props.token)
        }
      >
        <h4>{props.title}</h4>
        <Input
          config={{
            placeholder: `${props.title} NAME`,
            required: true,
            autoFocus: true,
            name: "name",
          }}
        />

        <Button
          config={{
            className: classes.confirm,
          }}
        >
          SUBMIT
        </Button>
      </form>
      {props.department ? (
        <Button
          config={{
            className: classes.hold,
          }}
          changed={() =>
            props.setState((prevState) => {
              return {
                ...prevState,
                unitModal: true,
              };
            })
          }
        >
          ADD NEW UNIT
        </Button>
      ) : null}
    </Fragment>
  );
});

export default institutionComponent;
