import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPasswordThunk,
  fetchPoliciesThunk,
} from "../../../services/password-thunk";
import NavBar from "../../parts/NavBar/NavBar";

const CreatePassword = () => {
  const { policies } = useSelector((state: any) => state.password);
  const [identifier, setIdentifier] = useState<string>("");
  const [policy, setPolicy] = useState<string>("");

  const dispatch = useDispatch<any>();

  const generatePassword = () => {
    dispatch(
      createPasswordThunk({
        identifier,
        policy,
      }),
    );
  };

  useEffect(() => {
    dispatch(fetchPoliciesThunk());
  }, [dispatch]);

  useEffect(() => {
    if (policies !== null) {
      if (policies.length === 0) {
        alert("No policies found. Please create a policy first.");
        window.location.href = "/policy";
      }
      setPolicy(policies[0]._id);
    }
  }, [policies]);

  return (
    <div>
      <NavBar />
      <div className="w-5/6 mx-auto py-7 flex flex-col justify-center items-center">
        <div className="mb-10 w-5/6 space-y-5">
          <label
            htmlFor="identifier"
            className="block mb-2 text-md font-medium text-gray-900 capitalize"
          >
            Password identifier (should be unique)
          </label>
          <input
            type="text"
            id="identifier"
            className="bg-transparent border border-gray-950 text-gray-900 text-md rounded-lg block w-full p-2.5"
            value={identifier}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setIdentifier(e.target.value)
            }
          />
        </div>
        <div className="mb-10 w-5/6 space-y-5">
          <label
            htmlFor="policy"
            className="block mb-2 text-md font-medium text-gray-900 capitalize"
          >
            Password Policy
          </label>
          <select
            id="policy"
            className="bg-transparent border border-gray-950 text-gray-900 text-md rounded-lg block w-full p-2.5"
            value={policy}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setPolicy(e.target.value)
            }
          >
            {policies !== null &&
              policies.map((policy: any) => (
                <option key={policy._id} value={policy._id}>
                  {policy.policy_name} (min: {policy.update_window_min}, max:{" "}
                  {policy.update_window_max})
                </option>
              ))}
          </select>
        </div>
        <button
          type="button"
          className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-64 text-md px-5 py-2.5 me-2 mb-2"
          onClick={generatePassword}
        >
          Generate password
        </button>
      </div>
    </div>
  );
};

export default CreatePassword;
