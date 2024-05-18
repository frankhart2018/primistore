import axios from "axios";

import {
  IMAGE_DECRYPTOR_API_BASE,
  PASSWORD_MANAGER_API_BASE,
} from "../utils/constants";

export const createPassword = async (passwordUid: string, policy_id: string) => {
  const response = await axios.post(`${PASSWORD_MANAGER_API_BASE}/password`, {
    identifier: passwordUid,
    policy_id,
  });

  return response;
};

export const fetchPasswords = async () => {
  const response = await axios.get(`${PASSWORD_MANAGER_API_BASE}/passwords`);
  return response;
};

export const rotateAESKeyAndIV = async (passUid: string) => {
  const response = await axios.put(
    `${PASSWORD_MANAGER_API_BASE}/password/aes/${passUid}`,
  );
  return response;
};

export const rotateCharset = async (passUid: string) => {
  const response = await axios.put(
    `${PASSWORD_MANAGER_API_BASE}/password/charset/${passUid}`,
  );
  return response;
};

export const encryptPassword = async (passUid: string, password: string) => {
  const response = await axios.post(
    `${PASSWORD_MANAGER_API_BASE}/password/encrypt/${passUid}`,
    {
      password,
    },
  );
  return response;
};

export const decryptPassword = async (passUid: string, pmsFile: File) => {
  const formData = new FormData();
  formData.append("file", pmsFile);

  const response = await axios.post(
    `${IMAGE_DECRYPTOR_API_BASE}/password/decrypt/${passUid}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "json",
    },
  );
  return response;
};

export const deletePassword = async (passUid: string) => {
  const response = await axios.delete(
    `${PASSWORD_MANAGER_API_BASE}/password/${passUid}`,
  );
  return response;
};

export const getDeviceInfo = async () => {
  const response = await axios.get(`${PASSWORD_MANAGER_API_BASE}/device/info`);
  return response;
};

export const generateBackup = async (password: string) => {
  const response = await axios.post(
    `${PASSWORD_MANAGER_API_BASE}/device/backup/generate`,
    {
      password,
    },
  );

  return response;
};

export const downloadBackup = async (backupName: string) => {
  const response = await axios.get(
    `${PASSWORD_MANAGER_API_BASE}/device/backup/download/${backupName}`,
    {
      responseType: "blob",
    },
  );

  return response;
};

export const uploadBackup = async (backupFile: File, password: string) => {
  const formData = new FormData();
  formData.append("file", backupFile);
  formData.append("password", password);

  const response = await axios.post(
    `${PASSWORD_MANAGER_API_BASE}/device/backup/upload`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      responseType: "json",
    },
  );
  return response;
};

export const createPolicy = async (
  policyName: string,
  updateWindowMin: number,
  updateWindowMax: number,
) => {
  const response = await axios.post(`${PASSWORD_MANAGER_API_BASE}/policy`, {
    policy_name: policyName,
    update_window_min: updateWindowMin,
    update_window_max: updateWindowMax,
  });

  return response;
};

export const fetchPolicies = async () => {
  const response = await axios.get(`${PASSWORD_MANAGER_API_BASE}/policy`);
  return response;
};