import { createSlice } from "@reduxjs/toolkit";
import { createPasswordThunk } from "../services/password-thunk";

const initialState = {
  created: false,
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
  },
});

export default passwordSlice.reducer;
