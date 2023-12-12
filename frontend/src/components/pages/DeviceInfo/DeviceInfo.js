import React, { useState } from "react";
import NavBar from "../../parts/NavBar/NavBar";
import ToggleButton from "../../parts/ToggleButton/ToggleButton";

const DeviceInfo = () => {
  const cpuTemp = 30.6;
  const [currentScale, setCurrentScale] = useState("C");

  const convertCToF = (tempVal) => {
    return ((9 * tempVal) / 5 + 32).toFixed(1);
  };

  const formatTemp = (tempVal) => {
    let convertedTempVal = tempVal;
    if (currentScale === "F") {
      convertedTempVal = convertCToF(tempVal);
    }
    return tempVal !== null ? `${convertedTempVal}°${currentScale}` : "";
  };

  const handleScaleToggle = (isChecked) => {
    setCurrentScale(isChecked ? "F" : "C");
  };

  return (
    <div>
      <NavBar />

      <p className="text-right">
        <ToggleButton
          leftOption={"°C"}
          rightOption={"°F"}
          parentUpdateCallback={handleScaleToggle}
        />
      </p>

      <div className="text-center">
        <p>
          <strong>CPU Temperature: </strong>
          {formatTemp(cpuTemp)}
        </p>
      </div>
    </div>
  );
};

export default DeviceInfo;
