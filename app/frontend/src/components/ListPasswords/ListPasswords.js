import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPasswordsThunk,
  rotateAESKeyAndIVThunk,
  rotateCharsetThunk,
} from "../../services/password-thunk";

import "./ListPasswords.css";
import NavBar from "../NavBar/NavBar";

const ListPasswords = () => {
  const { passwords } = useSelector((state) => state.password);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPasswordsThunk());
  }, [dispatch]);

  const rotateAESKeyAndIV = (passUid) => {
    dispatch(
      rotateAESKeyAndIVThunk({
        passUid,
      })
    );
  };

  const rotateCharset = (passUid) => {
    dispatch(
      rotateCharsetThunk({
        passUid,
      })
    );
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
                </td>
                <td>
                  <button onClick={() => rotateCharset(password_obj.pass_uid)}>
                    Rotate CharSet
                  </button>
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
