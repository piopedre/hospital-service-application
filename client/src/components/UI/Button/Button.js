import React from "react";
import "./Button.css";
const button = React.memo((props) => (
  <button
    onClick={props.changed}
    {...props.config}
  >
    {props.children}
  </button>
));

export default button;
