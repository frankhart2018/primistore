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
} from "../services/password-thunk";
import { COLS, ROWS } from "../utils/constants";
interface Password {
  pass_uid: string;
  aes_last_rotated: string;
  charset_last_rotated :string;
  
}
interface UpdatedPassword {
  pass_uid: string;
  aes_last_rotated: string;
  

}

const getZeros2DArray = (rows:number, cols:number) => {
  let data = [];
  for (let i = 0; i < rows * cols; i++) {
    data.push(0);
  }

  return data;
};

interface DeviceInfo {
  
  [key: string]: any; 
}
interface InitialState {
  created: boolean;
  passwords: Password[];
  encryptedData: number[];
  decryptedData: string;
  rawData: string;
  deviceInfo: DeviceInfo;
  backupName: string | null;
  backupData: any | null;
  backupRestorationSuccess: boolean;
}
const initialState:InitialState = {
  created: false,
  passwords: [],
  encryptedData: getZeros2DArray(ROWS, COLS),
  decryptedData: "",
  rawData: "",
  deviceInfo: {},
  backupName: null,
  backupData: null,
  backupRestorationSuccess: false,
};

const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {
    clearEncryptedData: (state) => {
      state.encryptedData = getZeros2DArray(ROWS, COLS);
    }
  },
  extraReducers: {
    [createPasswordThunk.fulfilled.toString()]: (state, action) => {
      const payload = action.payload;
      const msg =
        "data" in payload ? payload.data.status : payload.response.data.error;
      alert(msg);
    },
    [fetchPasswordsThunk.fulfilled.toString()]: (state, action) => {
      state.passwords = action.payload.data;
    },
    [rotateAESKeyAndIVThunk.fulfilled.toString()]: (state, action) => {
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
    },
    [rotateCharsetThunk.fulfilled.toString()]: (state, action) => {
      alert("Charset rotated successfully");
      const updatedPassword = action.payload.data.password;
      for (let i = 0; i < state.passwords.length; i++) {
        if (state.passwords[i].pass_uid === updatedPassword.pass_uid) {
          state.passwords[i].charset_last_rotated =
            updatedPassword.charset_last_rotated;
        }
      }
    },
    [encryptPasswordThunk.fulfilled.toString()]: (state, action) => {
      const payload = action.payload;

      if ("data" in payload) {
        const encryptedPasswordArr = action.payload.data.encryptedPassword
          .split("")
          .map((char:string) => {
            return parseInt(char);
          });

        const aimLength = ROWS * COLS;
        const paddedArray = Array(aimLength).fill(0);
        encryptedPasswordArr.forEach(
          (value:number, index:number) => (paddedArray[index] = value)
        );

        state.encryptedData = paddedArray;
      } else {
        alert(payload.response.data.error);
      }
    },
    [decryptPasswordThunk.fulfilled.toString()]: (state, action) => {
      const payload = action.payload;

      if ("data" in payload) {
        state.decryptedData = action.payload.data.decrypted;
        state.rawData = action.payload.data.raw;
      } else {
        alert(payload.response.data.error);
      }
    },
    [deletePasswordThunk.fulfilled.toString()]: (state, action) => {
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
    },
    [getDeviceInfoThunk.fulfilled.toString()]: (state, action) => {
      const payload = action.payload;

      if ("data" in payload) {
        state.deviceInfo = payload.data.info;
      } else {
        state.deviceInfo = {};
      }
    },
    [generateBackupThunk.fulfilled.toString()]: (state, action) => {
      const payload = action.payload;

      if ("data" in payload) {
        state.backupName = payload.data.output;
      } else {
        alert(payload.response.data.error);
      }
    },
    [downloadBackupThunk.fulfilled.toString()]: (state, action) => {
      const payload = action.payload;

      if ("data" in payload) {
        state.backupData = payload.data;
      } else {
        alert(payload.response.data.error);
      }
    },
    [uploadBackupThunk.fulfilled.toString()]: (state, action) => {
      const payload = action.payload;

      if ("data" in payload) {
        state.backupRestorationSuccess = true;
        alert("Successfully restored from backup!");
      } else {
        alert(payload.response.data.error);
      }
    },
  },
});
export const { clearEncryptedData } = passwordSlice.actions;
export default passwordSlice.reducer;
