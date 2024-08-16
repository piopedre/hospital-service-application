import React from "react";
import Input from "../UI/Input/Input";
import Button from "../UI/Button/Button";
import Modal from "../Modal/Modal";
import classes from "./OutOfStockComponent.module.css";
import Spinner from "../UI/Spinner/Spinner";
const outOfStockComponent = React.memo((props) => {
  return (
    <Modal
      show={props.state.osModal}
      modalClosed={props.closed}
    >
      {props.state.loading ? (
        <Spinner />
      ) : (
        <form
          onSubmit={(e) => props.addOs(e, props.token, props.setState)}
          className={classes.outOfStockForm}
          onClick={() =>
            props.setState((prevState) => {
              return {
                ...prevState,
                render: false,
              };
            })
          }
        >
          <h4 className={classes.title}>ADD OUT OF STOCK PRODUCT</h4>
          <Input
            config={{
              name: "name",
              required: true,
              placeholder: "TAB TOPIRAMATE 50MG",
              value: props.state.osValue,
              ref: props.osRef,
              autoFocus: true,
              autoComplete: "on",
            }}
            label='PRODUCT NAME'
            changed={(e) => {
              props.setState((prevState) => {
                return {
                  ...prevState,
                  render: true,
                  osValue: e.target.value,
                  products: props.state.prevOsProducts.filter((pr) =>
                    pr.includes(e.target.value.toUpperCase())
                  ),
                };
              });
              if (!e.target.value.trim()) {
                props.setState((prevState) => {
                  return {
                    ...prevState,
                    render: false,
                  };
                });
              }
            }}
          />
          <Input
            config={{
              name: "type",
              required: true,
              value: props.state.osType,
            }}
            inputType='select'
            title='TYPE'
            options={["OUT OF STOCK", "NOT AVAILABLE"]}
            changed={(e) => {
              props.setState((prevState) => {
                return {
                  ...prevState,
                  osType: e.target.value,
                };
              });
            }}
          />
          {props.state.render ? (
            <div className={classes.renderContainer}>
              {props.state.products.map((pr, i) => (
                <div
                  key={i}
                  className={classes.renderItem}
                  onClick={() => {
                    props.setState((prevState) => {
                      return {
                        ...prevState,
                        osValue: pr,
                        render: false,
                        firstClick: true,
                      };
                    });
                  }}
                >
                  {pr}
                </div>
              ))}
            </div>
          ) : null}
          <Button
            config={{
              className: classes.confirm,
            }}
          >
            ADD OUT OF STOCK
          </Button>
        </form>
      )}
    </Modal>
  );
});

export default outOfStockComponent;
