import { createSlice } from "@reduxjs/toolkit";
import {
  createPasswordThunk,
  decryptPasswordThunk,
  encryptPasswordThunk,
  fetchPasswordsThunk,
  rotateAESKeyAndIVThunk,
  rotateCharsetThunk,
} from "../services/password-thunk";
import { COLS, ROWS } from "../utils/constants";

const getZeros2DArray = (rows, cols) => {
  let data = [];
  for (let i = 0; i < rows * cols; i++) {
    data.push(0);
  }

  return data;
};

const initialState = {
  created: false,
  passwords: [],
  encryptedData: getZeros2DArray(ROWS, COLS),
  decryptedData: "",
};

const passwordSlice = createSlice({
  name: "password",
  initialState,
  reducers: {},
  extraReducers: {
    [createPasswordThunk.fulfilled]: (state, action) => {
      alert(action.payload.data.status);
    },
    [fetchPasswordsThunk.fulfilled]: (state, action) => {
      state.passwords = action.payload.data;
    },
    [rotateAESKeyAndIVThunk.fulfilled]: (state, action) => {
      alert("AES Key and IV rotated successfully");
      const updatedPassword = action.payload.data.password;
      for (let i = 0; i < state.passwords.length; i++) {
        if (state.passwords[i].pass_uid === updatedPassword.pass_uid) {
          state.passwords[i].aes_last_rotated =
            updatedPassword.aes_last_rotated;
        }
      }
    },
    [rotateCharsetThunk.fulfilled]: (state, action) => {
      alert("Charset rotated successfully");
      const updatedPassword = action.payload.data.password;
      for (let i = 0; i < state.passwords.length; i++) {
        if (state.passwords[i].pass_uid === updatedPassword.pass_uid) {
          state.passwords[i].charset_last_rotated =
            updatedPassword.charset_last_rotated;
        }
      }
    },
    [encryptPasswordThunk.fulfilled]: (state, action) => {
      const encryptedPasswordArr = action.payload.data.encryptedPassword
        .split("")
        .map((char) => {
          return parseInt(char);
        });

      const aimLength = ROWS * COLS;
      const paddedArray = Array(aimLength).fill(0);
      encryptedPasswordArr.forEach(
        (value, index) => (paddedArray[index] = value)
      );

      state.encryptedData = paddedArray;
    },
    [decryptPasswordThunk.fulfilled]: (state, action) => {
      state.decryptedData = action.payload.data.decrypted;
    },
  },
});

export default passwordSlice.reducer;
