import React, { useEffect, useRef, useState } from "react";
import NavBar from "../../parts/NavBar/NavBar";
import ToggleButton from "../../parts/ToggleButton/ToggleButton";
import { useDispatch, useSelector } from "react-redux";
import {
  downloadBackupThunk,
  generateBackupThunk,
  getDeviceInfoThunk,
  uploadBackupThunk,
} from "../../../services/password-thunk";

interface PasswordState {
  deviceInfo: string;
  backupData: string;
  backupName: string;
}
interface RootPassword {
  password: PasswordState;
}

const DeviceInfo = () => {
  const backupName: string = useSelector<RootPassword, string>(
    (state) => state.password.backupName
  );

  const deviceInfo: string = useSelector<RootPassword, string>(
    (state) => state.password.deviceInfo
  );
  const backupData: any = useSelector<RootPassword, string>(
    (state) => state.password.backupData
  );
  const [currentScale, setCurrentScale] = useState("C");
  const backupUploadFile = useRef<HTMLInputElement>(null);
  const [backupFilePath, setBackupFilePath] = useState<File | null>(null);

  const dispatch = useDispatch<any>();

  const convertCToF = (tempVal: number) => {
    return ((9 * tempVal) / 5 + 32).toFixed(1);
  };

  const formatTemp = (tempVal: any) => {
    let convertedTempVal = tempVal;
    if (tempVal !== "Cannot determine" && currentScale === "F") {
      convertedTempVal = convertCToF(tempVal);
    }
    return tempVal !== "Cannot determine"
      ? `${convertedTempVal}°${currentScale}`
      : tempVal;
  };

  const handleScaleToggle = (isChecked: boolean) => {
    setCurrentScale(isChecked ? "F" : "C");
  };

  useEffect(() => {
    dispatch(getDeviceInfoThunk());
  }, [dispatch]);

  const downloadBackupHandler = () => {
    const password = prompt("Enter server password: ");
    if (password != null) {
      dispatch(
        generateBackupThunk({
          password,
        })
      );
    }
  };

  useEffect(() => {
    if (backupName !== null) {
      let shouldDownload = window.confirm(
        `Generated backup: ${backupName}. Download it?`
      );

      if (shouldDownload) {
        dispatch(
          downloadBackupThunk({
            backupName,
          })
        );
      } else {
        alert(
          "Cancelling download, thanks for wasting compute on generating backup!"
        );
      }
    }
  }, [backupName, dispatch]);

  useEffect(() => {
    if (backupData !== null) {
      try {
        const url = window.URL.createObjectURL(backupData);
        const a = document.createElement("a");
        a.href = url;
        a.download = backupName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } catch (e) {
        alert(`Error downloading file: ${e}`);
      }
    }
  }, [backupData, backupName]);

  const uploadBackupHandler = (
    _e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    if (backupUploadFile.current) {
      backupUploadFile.current.click();
    }
  };

  useEffect(() => {
    if (backupFilePath !== null) {
      const password = prompt("Enter server password: ");
      if (password != null) {
        dispatch(
          uploadBackupThunk({
            backupFile: backupFilePath,
            password,
          })
        );
      }
    }
  }, [backupFilePath, dispatch]);

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
            onClick={uploadBackupHandler}
          >
            Restore From Backup
          </button>
          <input
            type="file"
            id="backup-file"
            ref={backupUploadFile}
            onChange={(e) => {
              if (e.target.files && e.target.files.length > 0) {
                setBackupFilePath(e.target.files[0]);
              }
            }}
            style={{
              display: "none",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default DeviceInfo;
