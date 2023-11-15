import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPasswordsThunk } from "../../services/password-thunk";

import "./ListPasswords.css";

const ListPasswords = () => {
  const { passwords } = useSelector((state) => state.password);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchPasswordsThunk());
  }, [dispatch]);

  return (
    <div>
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
                  {password_obj.aes_key}-{password_obj.aes_iv}
                </td>
                <td>{password_obj.charset_path}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ListPasswords;
