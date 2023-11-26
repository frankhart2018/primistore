import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPasswordsThunk,
  rotateAESKeyAndIVThunk,
  rotateCharsetThunk,
} from "../../../services/password-thunk";

import "./ListPasswords.css";
import NavBar from "../../parts/NavBar/NavBar";
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

  const dateDiffInDays = (date1, date2) => {
    const oneDayMs = 24 * 60 * 60 * 1000;

    const utcDate1 = Date.UTC(
      date1.getFullYear(),
      date1.getMonth(),
      date1.getDate()
    );
    const utcDate2 = Date.UTC(
      date2.getFullYear(),
      date2.getMonth(),
      date2.getDate()
    );

    const timeDiff = Math.abs(utcDate2 - utcDate1);

    return Math.floor(timeDiff / oneDayMs);
  };

  const daysSinceLastRotated = (unixEpochTimeString) => {
    const then = new Date(parseInt(unixEpochTimeString) * 1000);
    const now = new Date(Date.now());

    return dateDiffInDays(now, then);
  };

  const getClassByDays = (days) => {
    if (days > 30) {
      return "red";
    } else if (days > 20 && days <= 30) {
      return "yellow";
    } else {
      return "green";
    }
  };

  return (
    <div>
      <NavBar />
      <br />
      <div style={{ textAlign: "left" }}>
        Color scheme:
        <br />
        <span className="red smallbox"></span> Time to rotate &nbsp;
        <span className="yellow smallbox"></span> Almost time to rotate &nbsp;
        <span className="green smallbox"></span> Does not need rotation
      </div>
      <br />
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
                <td
                  className={getClassByDays(
                    daysSinceLastRotated(password_obj.aes_last_rotated)
                  )}
                >
                  <button
                    onClick={() => rotateAESKeyAndIV(password_obj.pass_uid)}
                  >
                    Rotate AES Key and IV
                  </button>
                  <br />
                  <span>
                    <strong>Last rotated:</strong>{" "}
                    {daysSinceLastRotated(password_obj.aes_last_rotated)}
                  </span>{" "}
                  day(s) ago
                </td>
                <td
                  className={getClassByDays(
                    daysSinceLastRotated(password_obj.charset_last_rotated)
                  )}
                >
                  <button onClick={() => rotateCharset(password_obj.pass_uid)}>
                    Rotate Charset
                  </button>
                  <br />
                  <span>
                    <strong>Last rotated:</strong>{" "}
                    {daysSinceLastRotated(password_obj.charset_last_rotated)}{" "}
                    day(s) ago
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
                  &nbsp;
                  <Link
                    to={{
                      pathname: `/password/decrypt/${password_obj.pass_uid}`,
                    }}
                  >
                    Decrypt
                  </Link>
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
