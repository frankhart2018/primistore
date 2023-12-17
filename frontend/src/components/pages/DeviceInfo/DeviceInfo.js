import React, { useEffect, useState } from "react";
import NavBar from "../../parts/NavBar/NavBar";
import ToggleButton from "../../parts/ToggleButton/ToggleButton";
import { useDispatch, useSelector } from "react-redux";
import { getDeviceInfoThunk } from "../../../services/password-thunk";

const DeviceInfo = () => {
  const { deviceInfo } = useSelector((state) => state.password);
  const [currentScale, setCurrentScale] = useState("C");

  const dispatch = useDispatch();

  const convertCToF = (tempVal) => {
    return ((9 * tempVal) / 5 + 32).toFixed(1);
  };

  const formatTemp = (tempVal) => {
    let convertedTempVal = tempVal;
    if (tempVal !== "Cannot determine" && currentScale === "F") {
      convertedTempVal = convertCToF(tempVal);
    }
    return tempVal !== "Cannot determine"
      ? `${convertedTempVal}°${currentScale}`
      : tempVal;
  };

  const handleScaleToggle = (isChecked) => {
    setCurrentScale(isChecked ? "F" : "C");
  };

  useEffect(() => {
    dispatch(getDeviceInfoThunk());
  }, [dispatch]);

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

      <div className="text-center" style={{ marginLeft: "10px" }}>
        {Object.entries(deviceInfo).map(([key, value]) => (
          <li style={{ textAlign: "left" }}>
            <strong>{key}: </strong>
            {key.includes("Temperature") ? formatTemp(value) : value}
          </li>
        ))}
      </div>
    </div>
  );
};

export default DeviceInfo;
