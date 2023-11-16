import axios from "axios";

import { API_BASE } from "../utils/constants";

export const createPassword = async (passwordUid) => {
  const response = await axios.post(`${API_BASE}/password`, {
    identifier: passwordUid,
  });

  return response;
};

export const fetchPasswords = async () => {
  const response = await axios.get(`${API_BASE}/passwords`);
  return response;
};

export const rotateAESKeyAndIV = async (passUid) => {
  const response = await axios.put(`${API_BASE}/password/aes/${passUid}`);
  return response;
};

export const rotateCharset = async (passUid) => {
  const response = await axios.put(`${API_BASE}/password/charset/${passUid}`);
  return response;
};

export const encryptPassword = async (passUid, password) => {
  console.log(passUid, password);
  const response = await axios.post(`${API_BASE}/password/encrypt/${passUid}`, {
    password,
  });
  return response;
};
