import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPasswordsThunk,
  fetchPolicyByIdThunk,
} from "../../../services/password-thunk";

import "./ListPasswords.css";
import NavBar from "../../parts/NavBar/NavBar";
import { NavLink } from "react-router-dom";
import { Password } from "../../../models/passwordInterface";

const ListPasswords = () => {
  const { passwords, policy_map } = useSelector((state: any) => state.password);

  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(fetchPasswordsThunk());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const dateDiffInDays = (date1: Date, date2: Date) => {
    const oneDayMs = 24 * 60 * 60 * 1000;

    const utcDate1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate(),
    );
    const utcDate2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate(),
    );

    const timeDiff = Math.abs(utcDate2 - utcDate1);

    return Math.floor(timeDiff / oneDayMs);
  };

  const daysSinceLastRotated = (unixEpochTimeString: string) => {
    const then = new Date(parseInt(unixEpochTimeString) * 1000);
    const now = new Date(Date.now());

    return dateDiffInDays(now, then);
  };

  const getClassByDays = (days: number, policy_id: string) => {
    const policy = policy_map[policy_id];

    if (days > policy.update_window_max) {
      return "red text-center";
    } else if (
      days > policy.update_window_min &&
      days <= policy.update_window_max
    ) {
      return "yellow text-center";
    } else {
      return "green text-center";
    }
  };

  useEffect(() => {
    if (passwords.length > 0) {
      passwords.forEach((password_obj: Password) => {
        dispatch(
          fetchPolicyByIdThunk({
            policyId: password_obj.policy_id,
          }),
        );
      });
    }
  }, [passwords, dispatch]);

  return (
    <div>
      <NavBar />
      <div className="w-5/6 mx-auto">
        <div className="w-1/2 mx-auto px-4 py-8 flex flex-col justify-center items-center mb-10 border border-red-600">
          <p className="text-xl font-bold tracking-widest uppercase">Legend</p>
          <div className="flex flex-row justify-center items-center space-x-6">
            <p className="font-semibold capitalize">
              <span className="red smallbox"></span> Time to rotate
            </p>
            <p className="font-semibold capitalize">
              <span className="yellow smallbox"></span> Almost time to rotate
            </p>
            <p className="font-semibold capitalize">
              <span className="green smallbox"></span> Does not need rotation
            </p>
          </div>
        </div>
        <table className="w-11/12 mx-auto">
          <thead>
            <tr>
              <th>S.No</th>
              <th>Password UID</th>
              <th>AES Key & IV</th>
              <th>Charset Path</th>
              <th>Operations</th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(policy_map).length > 0 &&
              passwords.length > 0 &&
              passwords.map((password_obj: any, idx: number) => {
                return (
                  <tr key={idx}>
                    <td className="text-center font-bold">{idx + 1}</td>
                    <td className="pl-5">{password_obj.pass_uid}</td>
                    <td
                      className={getClassByDays(
                        daysSinceLastRotated(password_obj.aes_last_rotated),
                        password_obj.policy_id,
                      )}
                    >
                      <p className="mb-2">
                        <span>
                          <strong>Last rotated:</strong>{" "}
                          {daysSinceLastRotated(password_obj.aes_last_rotated)}
                        </span>{" "}
                        day(s) ago
                      </p>
                    </td>
                    <td
                      className={getClassByDays(
                        daysSinceLastRotated(password_obj.charset_last_rotated),
                        password_obj.policy_id,
                      )}
                    >
                      <p className="mb-2">
                        <span>
                          <strong>Last rotated:</strong>{" "}
                          {daysSinceLastRotated(
                            password_obj.charset_last_rotated,
                          )}{" "}
                          day(s) ago
                        </span>
                      </p>
                    </td>
                    <td className="text-center">
                      <NavLink
                        className="border bg-gray-400/60 border-gray-600 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-fit text-base px-3 py-2.5 me-2 my-2"
                        to={{
                          pathname: `/password/encrypt/${password_obj.pass_uid}`,
                        }}
                      >
                        Encrypt
                      </NavLink>
                      <NavLink
                        className="border bg-gray-400/60 border-gray-600 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-fit text-base px-3 py-2.5 me-2 my-2"
                        to={{
                          pathname: `/password/decrypt/${password_obj.pass_uid}`,
                        }}
                      >
                        Decrypt
                      </NavLink>
                      <button
                        className="border bg-gray-400/60 border-gray-600 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-fit text-base px-3 py-2.5 me-2 my-2"
                        onClick={() => {
                          window.location.href = `/password/edit/${password_obj.pass_uid}`;
                        }}
                      >
                        Edit Password
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ListPasswords;
