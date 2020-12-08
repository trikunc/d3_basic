import React, { useRef, useEffect, useState } from "react";
import { select, axisBottom, axisLeft, scaleLinear, scaleBand } from "d3";

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

const Bar = ({ initialData }) => {
  const [dataArr, setDataArr] = useState(initialData);
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  useEffect(() => {
    const svg = select(svgRef.current);
    console.log(dimensions);

    if (!dimensions) return;

    const xScale = scaleBand()
      .domain(dataArr.map((value, index) => index))
      .range([0, dimensions.width])
      .padding(0.1);

    const yScale = scaleLinear().domain([0, 150]).range([dimensions.height, 0]);

    const colorScale = scaleLinear()
      .domain([75, 100, 150])
      .range(["green", "orange", "red"])
      .clamp(true);

    const xAxis = axisBottom(xScale).tickFormat((index) => index + 1);
    svg
      .select(".x-axis")
      .style("transform", `translateY(${dimensions.height}px)`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").style("transform", `translateX(${0}px)`).call(yAxis);

    svg
      .selectAll(".bar")
      .data(dataArr)
      .join("rect")
      .attr("class", "bar")
      .style("transform", "scale(1, -1)")
      .attr("x", (value, index) => xScale(index))
      .attr("y", -dimensions.height)
      .attr("width", xScale.bandwidth())
      .on("mouseenter", function (event, value) {
        // events have changed in d3 v6:
        // https://observablehq.com/@d3/d3v6-migration-guide#events
        const index = svg.selectAll(".bar").nodes().indexOf(this);
        svg
          .selectAll(".tooltip")
          .data([value])
          .join((enter) => enter.append("text").attr("y", yScale(value) - 4))
          .attr("class", "tooltip")
          .text(value)
          .attr("x", xScale(index) + xScale.bandwidth() / 2)
          .attr("text-anchor", "middle")
          .transition()
          .attr("y", yScale(value) - 8)
          .attr("opacity", 1);
      })
      .on("mouseleave", () => svg.select(".tooltip").remove())
      .transition()
      .attr("fill", colorScale)
      .attr("height", (value) => dimensions.height - yScale(value));
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
            display: "block",
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
        <button
          onClick={() =>
            setDataArr([...dataArr, Math.round(Math.random() * 100)])
          }
        >
          Add data
        </button>
      </div>
    </div>
  );
};

export default Bar;
