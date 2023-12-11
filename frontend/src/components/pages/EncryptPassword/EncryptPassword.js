import React, { useState } from "react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";
import SquareTable from "../../parts/SquareTable/SquareTable";
import { useDispatch, useSelector } from "react-redux";
import { COLS, ROWS } from "../../../utils/constants";
import { encryptPasswordThunk } from "../../../services/password-thunk";
import NavBar from "../../parts/NavBar/NavBar";

const EncryptPassword = () => {
  const targetRef = useRef();

  const [password, setPassword] = useState("");
  const { encryptedData } = useSelector((state) => state.password);

  const uuid = uuidv4();

  const dispatch = useDispatch();

  const pathName = window.location.pathname;
  const passUid = pathName.split("/")[3];

  const handleDownloadImage = async (uuid) => {
    const element = targetRef.current;
    const canvas = await html2canvas(element);

    const data = canvas.toDataURL("image/jpg");
    const link = document.createElement("a");

    if (typeof link.download === "string") {
      link.href = data;
      link.download = `image-${uuid}.jpg`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      window.open(data);
    }
  };

  const encryptData = () => {
    dispatch(
      encryptPasswordThunk({
        passUid,
        password,
      })
    );
  };

  return (
    <div>
      <NavBar />
      <div className="flex flex-row w-11/12 mx-auto justify-between items-center mb-4">
        <label
          className="mb-2 text-lg font-medium text-gray-900 capitalize"
          htmlFor="password"
        >
          Password
        </label>
        <input
          type="password"
          className="bg-transparent border border-gray-950 text-gray-900 text-md rounded-lg block w-3/5 p-2.5"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <button
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-64 text-md px-5 py-2.5 me-2 mb-2"
          onClick={() => encryptData()}
        >
          Encrypt password
        </button>
      </div>
      <div className="text-center mb-4">
        <button
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-64 text-md px-5 py-2.5 me-2 mb-2"
          onClick={() => handleDownloadImage(uuid)}
          id="download-image"
        >
          Download Image
        </button>
      </div>
      <div ref={targetRef}>
        <SquareTable rows={ROWS} cols={COLS} data={encryptedData} />
      </div>
    </div>
  );
};

export default EncryptPassword;
