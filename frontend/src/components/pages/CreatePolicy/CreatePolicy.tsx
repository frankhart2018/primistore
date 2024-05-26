import React, { useState } from "react";
import NavBar from "../../parts/NavBar/NavBar";
import { useDispatch } from "react-redux";
import { createPolicyThunk } from "../../../services/password-thunk";

const CreatePolicy = () => {
  const [policyName, setPolicyName] = useState<string>("");
  const [updateWindowMin, setUpdateWindowMin] = useState<number>(0);
  const [updateWindowMax, setUpdateWindowMax] = useState<number>(0);

  const dispatch = useDispatch<any>();

  const createPolicyHandler = () => {
    let errors = "";
    if (policyName === "") {
      errors += "Policy Name is required\n";
    }

    if (updateWindowMin >= updateWindowMax) {
      errors +=
        "Update Window Min should be strictly less than Update Window Max\n";
    }

    if (errors) {
      alert(errors);
      return;
    }

    dispatch(
      createPolicyThunk({
        policyName,
        updateWindowMin,
        updateWindowMax,
      }),
    );
  };

  return (
    <div>
      <NavBar />
      <div className="w-5/6 mx-auto py-7 flex flex-col justify-center items-center">
        <div className="mb-10 w-5/6 space-y-5">
          <label
            htmlFor="name"
            className="block mb-2 text-md font-medium text-gray-900 capitalize"
          >
            Policy Name (should be unique)
          </label>
          <input
            type="text"
            id="name"
            className="bg-transparent border border-gray-950 text-gray-900 text-md rounded-lg block w-full p-2.5"
            value={policyName}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setPolicyName(e.target.value)
            }
          />
        </div>
        <div className="mb-10 w-5/6 space-y-5">
          <label
            htmlFor="min"
            className="block mb-2 text-md font-medium text-gray-900 capitalize"
          >
            Update Window Min
          </label>
          <input
            type="number"
            id="min"
            min={0}
            className="bg-transparent border border-gray-950 text-gray-900 text-md rounded-lg block w-full p-2.5"
            value={updateWindowMin}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUpdateWindowMin(parseInt(e.target.value))
            }
          />
        </div>
        <div className="mb-10 w-5/6 space-y-5">
          <label
            htmlFor="max"
            className="block mb-2 text-md font-medium text-gray-900 capitalize"
          >
            Update Window Max
          </label>
          <input
            type="number"
            id="max"
            min={0}
            className="bg-transparent border border-gray-950 text-gray-900 text-md rounded-lg block w-full p-2.5"
            value={updateWindowMax}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setUpdateWindowMax(parseInt(e.target.value))
            }
          />
        </div>
        <button
          type="button"
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-64 text-md px-5 py-2.5 me-2 mb-2"
          onClick={createPolicyHandler}
        >
          Create Policy
        </button>
      </div>
    </div>
  );
};

export default CreatePolicy;
