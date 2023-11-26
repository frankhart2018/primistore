import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decryptPasswordThunk } from "../../../services/password-thunk";
import NavBar from "../../parts/NavBar/NavBar";

const DecryptPassword = () => {
  const { decryptedData, rawData } = useSelector((state) => state.password);
  const [pmsFile, setPmsFile] = useState(null);

  const pathName = window.location.pathname;
  const passUid = pathName.split("/")[3];

  const dispatch = useDispatch();

  const decryptData = () => {
    dispatch(
      decryptPasswordThunk({
        passUid,
        pmsFile,
      })
    );
  };

  return (
    <div>
      <NavBar />
      <br />
      <label for="pms-path">PMS file:</label>
      <input
        type="file"
        id="pms-file"
        onChange={(e) => setPmsFile(e.target.files[0])}
      />
      <button onClick={() => decryptData()}>Decrypt</button>

      <p>
        <strong>Decrypted data: </strong>
        {decryptedData.length > 0 ? (
          <p>
            <strong>Data:</strong> {decryptedData}
          </p>
        ) : (
          <></>
        )}
        {rawData.length > 0 ? (
          <p>
            <strong>Raw:</strong> {rawData}
          </p>
        ) : (
          <></>
        )}
      </p>
    </div>
  );
};

export default DecryptPassword;
