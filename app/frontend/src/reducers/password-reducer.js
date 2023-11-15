import { createSlice } from "@reduxjs/toolkit";
import {
  createPasswordThunk,
  fetchPasswordsThunk,
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
      state.created = true;
    },
    [fetchPasswordsThunk.fulfilled]: (state, action) => {
      console.log(action.payload);
      state.passwords = action.payload.data;
    },
  },
});

export default passwordSlice.reducer;
