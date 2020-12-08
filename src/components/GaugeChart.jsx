import React, { useEffect, useRef, useState } from "react";
import "./GaugeChart.css";
import ml5 from "ml5";
import Gauge from "./chart/Gauge";
import useInterval from "./reuseComponents/useInterval";

let classifier;

function App() {
  const videoRef = useRef();
  const [gaugeData, setGaugeData] = useState([0.5, 0.5]);
  const [shouldClassify, setShouldClassify] = useState(false);

  useEffect(() => {
    classifier = ml5.imageClassifier("./my-model/model.json", () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: false })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        });
    });
  }, []);

  useInterval(() => {
    if (classifier && shouldClassify) {
      classifier.classify(videoRef.current, (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        results.sort((a, b) => a.label.localeCompare(b.label));
        setGaugeData(results.map((entry) => entry.confidence));
      });
    }
  }, 500);

  return (
    <React.Fragment>
      <h1>
        Is Human there? <br />
        <small>
          [{gaugeData[0].toFixed(2)}, {gaugeData[1].toFixed(2)}]
        </small>
      </h1>
      <Gauge data={gaugeData} />
      <button onClick={() => setShouldClassify(!shouldClassify)}>
        {shouldClassify ? "Stop classifying" : "Start classifying"}
      </button>
      <br />
      <br />
      <video
        ref={videoRef}
        style={{ transform: "scale(-1, 1)" }}
        width="300"
        height="150"
      />
    </React.Fragment>
  );
}

export default App;
