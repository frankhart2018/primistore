import { createSlice } from "@reduxjs/toolkit";
import {
  createPasswordThunk,
  fetchPasswordsThunk,
  rotateAESKeyAndIVThunk,
  rotateCharsetThunk,
} from "../services/password-thunk";

const initialState = {
  created: false,
  passwords: [],
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
    },
    [rotateCharsetThunk.fulfilled]: (state, action) => {
      alert("Charset rotated successfully");
    },
  },
});

export default passwordSlice.reducer;
