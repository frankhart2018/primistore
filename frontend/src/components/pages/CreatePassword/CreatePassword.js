import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPasswordThunk } from "../../../services/password-thunk";
import NavBar from "../../parts/NavBar/NavBar";

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
      <div className="w-5/6 mx-auto py-7 flex flex-col justify-center items-center">
        <div class="mb-10 w-5/6 space-y-5">
          <label
            for="identifier"
            class="block mb-2 text-md font-medium text-gray-900"
          >
            Password identifier (should be unique)
          </label>
          <input
            type="text"
            id="identifier"
            class="bg-transparent border border-gray-950 text-gray-900 text-md rounded-lg block w-full p-2.5"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
          />
        </div>
        <button
          type="button"
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-64 text-md px-5 py-2.5 me-2 mb-2 rounded-full"
          onClick={generatePassword}
        >
          Generate password
        </button>
      </div>
    </div>
  );
};

export default CreatePassword;
