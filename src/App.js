import React from "react";
import "./styles.css";

import Circle from "./components/chart/Circle";
import Line from "./components/chart/Line";
import Bar from "./components/chart/Bar";
import GaugeChart from "./components/GaugeChart";

const initialData = [20, 30, 45, 60, 20, 20, 75, 80];

const App = () => {
  return (
    <div className="App">
      <GaugeChart />
      <Bar initialData={initialData} />
      <Line initialData={initialData} />
      <Circle initialData={initialData} />
    </div>
  );
};

export default App;
