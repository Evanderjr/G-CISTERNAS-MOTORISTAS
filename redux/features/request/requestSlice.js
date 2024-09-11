import { createSlice } from "@reduxjs/toolkit";

import * as requestReducers from "./reducers";

const initialState = {
  form: {},
  requestInfo: {},
  run: {},
};

export const requestSlice = createSlice({
  name: "request",
  initialState,
  reducers: requestReducers,
});