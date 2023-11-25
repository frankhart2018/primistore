import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPasswordThunk } from "../../services/password-thunk";
import NavBar from "../NavBar/NavBar";

const CreatePassword = () => {
  let [identifier, setIdentifier] = useState("");

  const dispatch = useDispatch();

  const generatePassword = () => {
    dispatch(
      createPasswordThunk({
        identifier,
      })
    );
  };

  return (
    <div>
      <NavBar />
      <p>
        <label for="identifier">Password identifier (should be unique):</label>
        <input
          type="text"
          id="identifier"
          value={identifier}
          onChange={(e) => setIdentifier(e.target.value)}
        />
      </p>
      <p>
        <button type="button" onClick={generatePassword}>
          Generate password
        </button>
      </p>
    </div>
  );
};

export default CreatePassword;
