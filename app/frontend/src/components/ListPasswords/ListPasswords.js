import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPasswordsThunk,
  rotateAESKeyAndIVThunk,
  rotateCharsetThunk,
} from "../../services/password-thunk";

import "./ListPasswords.css";
import NavBar from "../NavBar/NavBar";
import { TIMEZONE } from "../../utils/constants";
import { Link } from "react-router-dom";

const ListPasswords = () => {
  const { passwords } = useSelector((state) => state.password);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPasswordsThunk());
  }, [dispatch]);

  const rotateAESKeyAndIV = (passUid) => {
    const userConfirmed = window.confirm(
      "Have you copied your current password?"
    );

    if (userConfirmed) {
      dispatch(
        rotateAESKeyAndIVThunk({
          passUid,
        })
      );
    } else {
      alert("Cancelling AES Key and IV rotation!");
    }
  };

  const rotateCharset = (passUid) => {
    const userConfirmed = window.confirm(
      "Have you copied your current password?"
    );

    if (userConfirmed === true) {
      dispatch(
        rotateCharsetThunk({
          passUid,
        })
      );
    } else {
      alert("Cancelling Charset rotation!");
    }
  };

  const parseUnixEpochTimeString = (unixEpochTimeString, targetTimeZone) => {
    const unixEpochTimeInSeconds = parseInt(unixEpochTimeString, 10);

    if (isNaN(unixEpochTimeInSeconds)) {
      console.error("Invalid Unix epoch time string");
      return null;
    }

    const date = new Date(unixEpochTimeInSeconds * 1000); // Convert seconds to milliseconds
    const formattedDateTimeString = date.toLocaleString("en-US", {
      timeZone: targetTimeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    return formattedDateTimeString;
  };

  return (
    <div>
      <NavBar />
      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>Password UID</th>
            <th>AES Key & IV</th>
            <th>Charset Path</th>
            <th>Encrypt/Decrypt</th>
          </tr>
        </thead>
        <tbody>
          {passwords.map((password_obj, idx) => {
            return (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{password_obj.pass_uid}</td>
                <td>
                  <button
                    onClick={() => rotateAESKeyAndIV(password_obj.pass_uid)}
                  >
                    Rotate AES Key and IV
                  </button>
                  <br />
                  <span>
                    <strong>Last rotated:</strong>{" "}
                    {parseUnixEpochTimeString(
                      password_obj.aes_last_rotated,
                      TIMEZONE
                    )}
                  </span>
                </td>
                <td>
                  <button onClick={() => rotateCharset(password_obj.pass_uid)}>
                    Rotate Charset
                  </button>
                  <br />
                  <span>
                    <strong>Last rotated:</strong>{" "}
                    {parseUnixEpochTimeString(
                      password_obj.charset_last_rotated,
                      TIMEZONE
                    )}
                  </span>
                </td>
                <td>
                  <Link
                    to={{
                      pathname: `/password/encrypt/${password_obj.pass_uid}`,
                    }}
                  >
                    Encrypt
                  </Link>
                  <button type="button">Decrypt</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListPasswords;
