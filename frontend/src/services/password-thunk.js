import { createAsyncThunk } from "@reduxjs/toolkit";

import * as passwordService from "./password-service";

export const createPasswordThunk = createAsyncThunk(
  "password/createPassword",
  async (payload) => {
    try {
      const response = await passwordService.createPassword(payload.identifier);
      return response;
    } catch (e) {
      return e;
    }
  }
);

export const fetchPasswordsThunk = createAsyncThunk(
  "password/fetchPasswords",
  async () => {
    const response = await passwordService.fetchPasswords();
    return response;
  }
);

export const rotateAESKeyAndIVThunk = createAsyncThunk(
  "password/rotateAESKeyAndIV",
  async (payload) => {
    try {
      const response = await passwordService.rotateAESKeyAndIV(payload.passUid);
      return response;
    } catch (e) {
      return e;
    }
  }
);

export const rotateCharsetThunk = createAsyncThunk(
  "password/rotateCharset",
  async (payload) => {
    const response = await passwordService.rotateCharset(payload.passUid);
    return response;
  }
);

export const encryptPasswordThunk = createAsyncThunk(
  "password/encryptPassword",
  async (payload) => {
    try {
      const response = await passwordService.encryptPassword(
        payload.passUid,
        payload.password
      );
      return response;
    } catch (e) {
      return e;
    }
  }
);

export const decryptPasswordThunk = createAsyncThunk(
  "password/decryptPassword",
  async (payload) => {
    try {
      const response = await passwordService.decryptPassword(
        payload.passUid,
        payload.pmsFile
      );
      return response;
    } catch (e) {
      return e;
    }
  }
);

export const deletePasswordThunk = createAsyncThunk(
  "password/deletePassword",
  async (payload) => {
    try {
      const response = await passwordService.deletePassword(payload.passUid);
      return response;
    } catch (e) {
      return e;
    }
  }
);

export const getDeviceInfoThunk = createAsyncThunk(
  "password/getDeviceInfo",
  async () => {
    try {
      const response = await passwordService.getDeviceInfo();
      return response;
    } catch (e) {
      return e;
    }
  }
);

export const generateBackupThunk = createAsyncThunk(
  "password/generateBackup",
  async (payload) => {
    try {
      const response = await passwordService.generateBackup(payload.password);
      return response;
    } catch (e) {
      return e;
    }
  }
);

export const downloadBackupThunk = createAsyncThunk(
  "password/downloadBackup",
  async (payload) => {
    try {
      const response = await passwordService.downloadBackup(payload.backupName);
      return response;
    } catch (e) {
      return e;
    }
  }
);

export const uploadBackupThunk = createAsyncThunk(
  "password/uploadBackup",
  async (payload) => {
    try {
      const response = await passwordService.uploadBackup(
        payload.backupFile,
        payload.password
      );
      return response;
    } catch (e) {
      return e;
    }
  }
);
