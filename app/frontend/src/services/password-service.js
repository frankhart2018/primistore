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
