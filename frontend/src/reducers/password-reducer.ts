import { createSlice } from "@reduxjs/toolkit";
import {
  createPasswordThunk,
  decryptPasswordThunk,
  deletePasswordThunk,
  generateBackupThunk,
  encryptPasswordThunk,
  fetchPasswordsThunk,
  getDeviceInfoThunk,
  rotateAESKeyAndIVThunk,
  rotateCharsetThunk,
  downloadBackupThunk,
  uploadBackupThunk,
  createPolicyThunk,
  fetchPoliciesThunk,
  fetchPolicyByIdThunk,
  getPasswordPolicyIdThunk,
} from "../services/password-thunk";
import { InitialState } from "../models/passwordInterface";
import { COLS, ROWS } from "../utils/constants";

const getZeros2DArray = (rows: number, cols: number) => {
  let data = [];
  for (let i = 0; i < rows * cols; i++) {
    data.push(0);
  }

  return data;
};

const initialState: InitialState = {
  created: false,
  passwords: [],
  encryptedData: getZeros2DArray(ROWS, COLS),
  decryptedData: "",
  rawData: "",
  deviceInfo: {},
  backupName: null,
  backupData: null,
  backupRestorationSuccess: false,
  policies: null,
  policy_map: {},
  currentPolicy: null,
};

const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    clearEncryptedData: (state) => {
      state.encryptedData = getZeros2DArray(ROWS, COLS);
    },
    clearBackupInfo: (state) => {
      state.backupName = null;
      state.backupData = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createPasswordThunk.fulfilled, (state, action: any) => {
      const payload = action.payload;
      const msg =
        "data" in payload ? payload.data.status : payload.response.data.error;
      alert(msg);
    });

    builder.addCase(fetchPasswordsThunk.fulfilled, (state, action: any) => {
      state.passwords = action.payload.data;
    });

    builder.addCase(rotateAESKeyAndIVThunk.fulfilled, (state, action: any) => {
      const payload = action.payload;

      if ("data" in payload) {
        alert("AES Key and IV rotated successfully");
        const updatedPassword = payload.data.password;
        for (let i = 0; i < state.passwords.length; i++) {
          if (state.passwords[i].pass_uid === updatedPassword.pass_uid) {
            state.passwords[i].aes_last_rotated =
              updatedPassword.aes_last_rotated;
          }
        }
      } else {
        alert(payload.response.data.error);
      }
    });

    builder.addCase(rotateCharsetThunk.fulfilled, (state, action: any) => {
      alert("Charset rotated successfully");
      const updatedPassword = action.payload.data.password;
      for (let i = 0; i < state.passwords.length; i++) {
        if (state.passwords[i].pass_uid === updatedPassword.pass_uid) {
          state.passwords[i].charset_last_rotated =
            updatedPassword.charset_last_rotated;
        }
      }
    });

    builder.addCase(encryptPasswordThunk.fulfilled, (state, action: any) => {
      const payload = action.payload;

      if ("data" in payload) {
        const encryptedPasswordArr = action.payload.data.encryptedPassword
          .split("")
          .map((char: string) => {
            return parseInt(char);
          });

        const aimLength = ROWS * COLS;
        const paddedArray = Array(aimLength).fill(0);
        encryptedPasswordArr.forEach(
          (value: number, index: number) => (paddedArray[index] = value),
        );

        state.encryptedData = paddedArray;
      } else {
        alert(payload.response.data.error);
      }
    });

    builder.addCase(decryptPasswordThunk.fulfilled, (state, action: any) => {
      const payload = action.payload;

      if ("data" in payload) {
        state.decryptedData = action.payload.data.decrypted;
        state.rawData = action.payload.data.raw;
      } else {
        alert(payload.response.data.error);
      }
    });

    builder.addCase(deletePasswordThunk.fulfilled, (state, action: any) => {
      const payload = action.payload;

      if ("data" in payload) {
        alert(`Status: ${payload.data.status}`);
        let newPasswords = [];
        const deletedPassUid = payload.data.pass_uid;
        for (let i = 0; i < state.passwords.length; i++) {
          if (state.passwords[i].pass_uid !== deletedPassUid) {
            newPasswords.push({ ...state.passwords[i] });
          }
        }
        state.passwords = newPasswords;
      } else {
        alert(payload.response.data.error);
      }
    });

    builder.addCase(getDeviceInfoThunk.fulfilled, (state, action: any) => {
      const payload = action.payload;

      if ("data" in payload) {
        state.deviceInfo = payload.data.info;
      } else {
        state.deviceInfo = {};
      }
    });

    builder.addCase(generateBackupThunk.fulfilled, (state, action: any) => {
      const payload = action.payload;

      if ("data" in payload) {
        state.backupName = payload.data.output;
      } else {
        alert(payload.response.data.error);
      }
    });

    builder.addCase(downloadBackupThunk.fulfilled, (state, action: any) => {
      const payload = action.payload;

      if ("data" in payload) {
        state.backupData = payload.data;
      } else {
        alert(payload.response.data.error);
      }
    });

    builder.addCase(uploadBackupThunk.fulfilled, (state, action: any) => {
      const payload = action.payload;

      if ("data" in payload) {
        state.backupRestorationSuccess = true;
        alert("Successfully restored from backup!");
      } else {
        alert(payload.response.data.error);
      }
    });

    builder.addCase(createPolicyThunk.fulfilled, (state, action: any) => {
      const payload = action.payload;

      if ("data" in payload) {
        alert("Policy created successfully");
      } else {
        alert(payload.response.data.error);
      }
    });

    builder.addCase(fetchPoliciesThunk.fulfilled, (state, action: any) => {
      const payload = action.payload;

      if ("data" in payload) {
        state.policies = payload.data;
      } else {
        alert(payload.response.data.error);
      }
    });

    builder.addCase(fetchPolicyByIdThunk.fulfilled, (state, action: any) => {
      const payload = action.payload;

      if ("data" in payload) {
        const data = payload.data;
        state.policy_map[data._id] = payload.data;
      } else {
        alert(payload.response.data.error);
      }
    });

    builder.addCase(
      getPasswordPolicyIdThunk.fulfilled,
      (state, action: any) => {
        const payload = action.payload;

        if ("data" in payload) {
          state.currentPolicy = payload.data.policy_id;
        } else {
          alert(payload.response.data.error);
        }
      },
    );
  },
});
export const { clearEncryptedData, clearBackupInfo } = passwordSlice.actions;
export default passwordSlice.reducer;
