import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decryptPasswordThunk } from "../../services/password-thunk";
import NavBar from "../NavBar/NavBar";

const DecryptPassword = () => {
  const { decryptedData } = useSelector((state) => state.password);
  const [pmsPath, setPmsPath] = useState("");

  const pathName = window.location.pathname;
  const passUid = pathName.split("/")[3];

  const dispatch = useDispatch();

  const decryptData = () => {
    dispatch(
      decryptPasswordThunk({
        passUid,
        pmsPath,
      })
    );
  };

  return (
    <div>
      <NavBar />
      <br />
      <label for="pms-path">PMS Path:</label>
      <input
        type="text"
        id="pms-path"
        value={pmsPath}
        onChange={(e) => setPmsPath(e.target.value)}
        autoFocus
      />
      <button onClick={() => decryptData()}>Decrypt</button>

      <p>
        <strong>Decrypted data: </strong>
        {decryptedData}
      </p>
    </div>
  );
};

export default DecryptPassword;
