import React, { useRef, useEffect, useState } from "react";
import {
  select,
  line,
  curveCardinal,
  axisBottom,
  axisLeft,
  scaleLinear
} from "d3";

const useResizeObserver = (ref) => {
  const [dimensions, setDimensions] = useState(null);
  useEffect(() => {
    const observerTarget = ref.current;
    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });
    resizeObserver.observe(observerTarget);
    return () => {
      resizeObserver.unobserve(observerTarget);
    };
  }, [ref]);
  return dimensions;
};

const Line = ({ initialData }) => {
  const [dataArr, setDataArr] = useState(initialData);
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    console.log(dimensions);

    if (!dimensions) return;

    const xScale = scaleLinear()
      .domain([0, dataArr.length - 1])
      .range([0, dimensions.width]);

    const yScale = scaleLinear().domain([0, 150]).range([dimensions.height, 0]);

    const xAxis = axisBottom(xScale)
      .ticks(dataArr.length)
      .tickFormat((index) => index + 1);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").style("transform", `translateX(${0}px)`).call(yAxis);

    const myLine = line()
      .x((value, index) => xScale(index))
      .y(yScale)
      .curve(curveCardinal);

    svg
      .selectAll(".line")
      .data([dataArr])
      .join("path")
      .attr("class", "line")
      .attr("d", myLine)
      .attr("fill", "none")
      .attr("stroke", "blue");
  }, [dataArr, dimensions]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "0 50px"
      }}
    >
      <div ref={wrapperRef}>
        <svg
          ref={svgRef}
          style={{
            backgroundColor: "#f3f3f3",
            overflow: "visible",
            width: "100%"
          }}
        >
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
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

export default Line;
