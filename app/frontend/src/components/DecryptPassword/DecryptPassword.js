import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decryptPasswordThunk } from "../../services/password-thunk";
import NavBar from "../NavBar/NavBar";

const DecryptPassword = () => {
  const { decryptedData } = useSelector((state) => state.password);
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
        {decryptedData}
      </p>
    </div>
  );
};

export default DecryptPassword;
