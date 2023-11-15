import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPasswordThunk } from "../../services/password-thunk";

const GeneratePassword = () => {
  let [identifier, setIdentifier] = useState("");
  let { created } = useSelector((state) => state.password);

  const dispatch = useDispatch();

  const generatePassword = () => {
    dispatch(
      createPasswordThunk({
        identifier,
      })
    );
  };

  useEffect(() => {
    setIdentifier("");
  }, [created]);

  return (
    <div>
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

export default GeneratePassword;
