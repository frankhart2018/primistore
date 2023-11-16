import React, { useState } from "react";
import { useRef } from "react";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from "uuid";
import SquareTable from "../SquareTable/SquareTable";
import { useDispatch, useSelector } from "react-redux";
import { COLS, ROWS } from "../../utils/constants";
import { encryptPasswordThunk } from "../../services/password-thunk";
import NavBar from "../NavBar/NavBar";

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
      <div>
        <label for="password">Password: </label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <button onClick={() => encryptData()}>Encrypt password</button>
      </div>
      <div>
        <button onClick={() => handleDownloadImage(uuid)} id="download-image">
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
