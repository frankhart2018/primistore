import { createAsyncThunk } from "@reduxjs/toolkit";

import * as passwordService from "./password-service";

export const createPasswordThunk = createAsyncThunk(
  "password/createPassword",
  async (payload) => {
    const response = await passwordService.createPassword(payload.identifier);
    return response;
  }
);
