import React, { useRef, useEffect, useState } from "react";
import { select } from "d3";
// import useResizeObserver from "../reuseComponents/useResizeObserver";

const Circle = ({ initialData }) => {
  const [dataArr, setDataArr] = useState(initialData);
  const svgRef = useRef();
  const wrapperRef = useRef();
  // const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    // if (!dimensions) return;

    svg
      .selectAll("circle")
      .data(dataArr)
      .join("circle")
      .attr("r", (radius) => radius)
      .attr("cx", (radius) => radius * 2)
      .attr("cy", (radius) => radius * 3)
      .attr("fill", "yellow")
      .attr("stroke", "orange");
  }, [dataArr]);

  return (
    <div>
      <div ref={wrapperRef}>
        <svg
          ref={svgRef}
          height={300}
          // width={300}
          style={{ backgroundColor: "#f3f3f3" }}
        ></svg>
      </div>
      <br />
      <div style={{ margin: 10 }}>
        <button onClick={() => setDataArr(dataArr.map((value) => value + 5))}>
          Upadte data
        </button>
        <button
          onClick={() => setDataArr(dataArr.filter((value) => value <= 35))}
        >
          Filter data
        </button>
        <button onClick={() => setDataArr(initialData)}>Reset data</button>
      </div>
    </div>
  );
};

export default Circle;
