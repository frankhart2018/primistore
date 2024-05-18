import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  deletePasswordThunk,
  fetchPasswordsThunk,
  rotateAESKeyAndIVThunk,
  rotateCharsetThunk,
} from "../../../services/password-thunk";

import "./ListPasswords.css";
import NavBar from "../../parts/NavBar/NavBar";
import { NavLink } from "react-router-dom";

interface PasswordState {
  passwords: string[];
}

interface RootState {
  password: PasswordState;
}
interface Password {
  pass_uid: string;
  aes_last_rotated: string;
  charset_last_rotated: any;
}

const ListPasswords = () => {
  const { passwords } = useSelector((state: any) => state.password);

  const dispatch = useDispatch<any>();

  useEffect(() => {
    dispatch(fetchPasswordsThunk());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const rotateAESKeyAndIV = (passUid: string) => {
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

  const rotateCharset = (passUid: string) => {
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

  const getClassByDays = (days: number) => {
    if (days > 30) {
      return "red text-center";
    } else if (days > 20 && days <= 30) {
      return "yellow text-center";
    } else {
      return "green text-center";
    }
  };

  const deletePassword = (passUid: string) => {
    const userConfirmed = window.confirm(`Deleting password for ${passUid}`);

    if (userConfirmed === true) {
      dispatch(
        deletePasswordThunk({
          passUid,
        }),
      );
    } else {
      alert(`Retaining password for ${passUid}`);
    }
  };

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
            {passwords.map((password_obj: any, idx: number) => {
              return (
                <tr key={idx}>
                  <td className="text-center font-bold">{idx + 1}</td>
                  <td className="pl-5">{password_obj.pass_uid}</td>
                  <td
                    className={getClassByDays(
                      daysSinceLastRotated(password_obj.aes_last_rotated),
                    )}
                  >
                    <button
                      onClick={() => rotateAESKeyAndIV(password_obj.pass_uid)}
                      className="border bg-gray-400/60 border-gray-600 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-fit text-base px-3 py-2.5 me-2 my-2"
                    >
                      Rotate AES Key and IV
                    </button>
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
                    )}
                  >
                    <button
                      onClick={() => rotateCharset(password_obj.pass_uid)}
                      className="border bg-gray-400/60 border-gray-600 hover:bg-gray-900 hover:text-white focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-full w-fit text-base px-3 py-2.5 me-2 my-2"
                    >
                      Rotate Charset
                    </button>
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
                      onClick={() => deletePassword(password_obj.pass_uid)}
                    >
                      Delete
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
