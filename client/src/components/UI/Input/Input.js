import React from "react";
import classes from "./Input.module.css";
const input = React.memo((props) => {
  let inputElement = "";
  let inputClasses = [classes.Input_Container];
  if (props.error) {
    inputClasses.push(classes.Error);
  }
  switch (props.inputType) {
    case "select":
      inputElement = (
        <div className={inputClasses.join(" ")}>
          {props.title ? <label>{props.title}</label> : null}
          <select
            {...props.config}
            onChange={props.changed}
          >
            {props.options.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
          {props.children}
        </div>
      );
      break;
    case "text-area":
      inputElement = (
        <div className={inputClasses.join(" ")}>
          {props.label ? <label>{props.label}</label> : null}
          <textarea
            {...props.config}
            onChange={props.changed}
          ></textarea>
          {props.children}
        </div>
      );
      break;
    default:
      inputElement = (
        <div className={inputClasses.join(" ")}>
          {props.label ? <label>{props.label}</label> : null}
          <input
            {...props.config}
            onChange={props.changed}
          />
          {props.children}
        </div>
      );
  }
  return inputElement;
});

export default input;
