import React, { useEffect, useState } from "react";
import NavBar from "../../parts/NavBar/NavBar";
import ToggleButton from "../../parts/ToggleButton/ToggleButton";
import { useDispatch, useSelector } from "react-redux";
import { getCpuTempThunk } from "../../../services/password-thunk";

const DeviceInfo = () => {
  const { cpuTemp } = useSelector((state) => state.password);
  const [currentScale, setCurrentScale] = useState("C");

  const dispatch = useDispatch();

  const convertCToF = (tempVal) => {
    return ((9 * tempVal) / 5 + 32).toFixed(1);
  };

  const formatTemp = (tempVal) => {
    let convertedTempVal = tempVal;
    if (tempVal !== null && currentScale === "F") {
      convertedTempVal = convertCToF(tempVal);
    }
    return tempVal !== null
      ? `${convertedTempVal}°${currentScale}`
      : "Cannot determine CPU temperature";
  };

  const handleScaleToggle = (isChecked) => {
    setCurrentScale(isChecked ? "F" : "C");
  };

  useEffect(() => {
    dispatch(getCpuTempThunk());
  });

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
