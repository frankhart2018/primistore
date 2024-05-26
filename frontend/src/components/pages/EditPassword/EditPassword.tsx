import React, { useEffect, useState } from "react";
import NavBar from "../../parts/NavBar/NavBar";
import { useDispatch } from "react-redux";
import {
  deletePasswordThunk,
  fetchPoliciesThunk,
  getPasswordPolicyIdThunk,
  rotateAESKeyAndIVThunk,
  rotateCharsetThunk,
  updatePasswordPolicyThunk,
} from "../../../services/password-thunk";
import { useSelector } from "react-redux";

const EditPassword = () => {
  const { policies, currentPolicy } = useSelector(
    (state: any) => state.password,
  );
  const [policy, setPolicy] = useState<string>("");

  const pathName = window.location.pathname;
  const passUid = pathName.split("/")[3];

  const dispatch = useDispatch<any>();

  const deletePassword = () => {
    const userConfirmed = window.confirm(`Deleting password for ${passUid}`);

    if (userConfirmed === true) {
      dispatch(
        deletePasswordThunk({
          passUid,
        }),
      ).then(() => {
        window.location.href = "/";
      });
    } else {
      alert(`Retaining password for ${passUid}`);
    }
  };

  const rotateAESKeyAndIV = () => {
    const userConfirmed = window.confirm(
      "Have you copied your current password?",
    );

    if (userConfirmed) {
      dispatch(
        rotateAESKeyAndIVThunk({
          passUid,
        }),
      );
    } else {
      alert("Cancelling AES Key and IV rotation!");
    }
  };

  const rotateCharset = () => {
    const userConfirmed = window.confirm(
      "Have you copied your current password?",
    );

    if (userConfirmed === true) {
      dispatch(
        rotateCharsetThunk({
          passUid,
        }),
      );
    } else {
      alert("Cancelling Charset rotation!");
    }
  };

  const updatePasswordPolicy = () => {
    dispatch(
      updatePasswordPolicyThunk({
        passUid,
        policyId: policy,
      }),
    ).then(() => {
      window.location.reload();
    });
  };

  useEffect(() => {
    dispatch(fetchPoliciesThunk()).then(() => {
      dispatch(getPasswordPolicyIdThunk({ passUid })).then(() => {
        setPolicy(currentPolicy);
      });
    });
  }, [dispatch, passUid, currentPolicy]);

  return (
    <div>
      <NavBar />

      <div className="w-5/6 mx-auto flex flex-col justify-center items-center">
        <h1 className="text-2xl font-bold mt-5">Edit Password</h1>
        <button
          className="border bg-gray-400/60 border-gray-600 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-fit text-base px-3 py-2.5 me-2 my-2"
          onClick={() => deletePassword()}
        >
          Delete Password
        </button>
        <button
          onClick={() => rotateAESKeyAndIV()}
          className="border bg-gray-400/60 border-gray-600 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-fit text-base px-3 py-2.5 me-2 my-2"
        >
          Rotate AES Key and IV
        </button>
        <button
          onClick={() => rotateCharset()}
          className="border bg-gray-400/60 border-gray-600 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-fit text-base px-3 py-2.5 me-2 my-2"
        >
          Rotate Charset
        </button>

        <div className="mb-10 w-5/6 space-y-5">
          <label
            htmlFor="policy"
            className="block mb-2 text-md font-medium text-gray-900 capitalize"
          >
            Current Password Policy
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
          <button
            onClick={() => updatePasswordPolicy()}
            className="border bg-gray-400/60 border-gray-600 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-fit text-base px-3 py-2.5 me-2 my-2"
          >
            Update Password Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPassword;
