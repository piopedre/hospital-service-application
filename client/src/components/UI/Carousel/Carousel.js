import classes from "./Carousel.module.css";
import React from "react";
import Plot from "react-plotly.js";
const carousel = (props) => (
  <div
    id={props.id}
    className={classes.Carousel}
  >
    <Plot
      className={classes.plot}
      style={{ width: "100%", height: "100%" }}
      useResizeHandler={true}
      config={{
        responsive: true,
      }}
      data={props.data}
      layout={{
        autosize: true,
        title: props.plotTitle,
        font: { size: "9" },
        barmode: props.barmode ? "stack" : "relative",
      }}
    />
  </div>
);

export default React.memo(carousel);
