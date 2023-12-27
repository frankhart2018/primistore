import React, { useEffect, useState } from "react";
import NavBar from "../../parts/NavBar/NavBar";
import ToggleButton from "../../parts/ToggleButton/ToggleButton";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadBackupThunk,
  getDeviceInfoThunk,
} from "../../../services/password-thunk";

const DeviceInfo = () => {
  const { deviceInfo, backupData } = useSelector((state) => state.password);
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

  const downloadBackupHandler = () => {
    dispatch(downloadBackupThunk());
  };

  useEffect(() => {
    if (backupData !== null) {
      try {
        const url = window.URL.createObjectURL(new Blob([backupData]));
        const a = document.createElement("a");
        a.href = url;
        a.download = "latest-snapshot.tar.gz";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (e) {
        alert(`Error downloading file: ${e}`);
      }
    }
  }, [backupData]);

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

      <div className="text-center">
        <div className="text-2xl my-2">Backups</div>

        <div>
          <button
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-64 text-md px-5 py-2.5 me-2"
            onClick={downloadBackupHandler}
          >
            Download Backup
          </button>
          <button
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-64 text-md px-5 py-2.5"
            onClick={() => {}}
          >
            Restore From Backup
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeviceInfo;
