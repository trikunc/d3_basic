import React, { useRef, useState, useEffect } from "react";
import { select, pie, arc, interpolate } from "d3";
import useResizeObserver from "../reuseComponents/useResizeObserver";

const GaugeChart = ({ data }) => {
  // const [dataArr, setDataArr] = useState(data);
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    if (!dimensions) return;

    const arcGenerator = arc().innerRadius(75).outerRadius(150);

    const pieGenerator = pie()
      .startAngle(-0.5 * Math.PI)
      .endAngle(0.5 * Math.PI)
      .sort(null);

    const instructions = pieGenerator(data);

    svg
      .selectAll(".slice")
      .data(instructions)
      .join("path")
      .attr("class", "slice")
      .attr("fill", (instruction, index) => (index === 0 ? "#ffcc00" : "#eee"))
      .style(
        "transform",
        `translate(${dimensions.width / 2}px, ${dimensions.height}px)`
      )
      .transition()
      .attrTween("d", function (nextInstruction, index) {
        const interpolator = interpolate(this.lastInstruction, nextInstruction);
        this.lastInstruction = interpolator(1);
        return function (t) {
          return arcGenerator(interpolator(t));
        };

        // bonus, which wasn't in video 07:
        // animate chart initially, but setting initial instruction
        // const initialInstruction = pieGenerator([0, 1])[index];
        // const interpolator = interpolate(
        //   this.lastInstruction || initialInstruction,
        //   nextInstruction
        // );
        // this.lastInstruction = interpolator(1);
        // return function (t) {
        //   return arcGenerator(interpolator(t));
        // };
      });

    // draw the gauge
  }, [data, dimensions]);

  return (
    <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
      <svg ref={svgRef}></svg>
    </div>
  );
};

export default GaugeChart;
