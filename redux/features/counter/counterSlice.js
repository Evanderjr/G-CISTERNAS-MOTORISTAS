import { createSlice } from "@reduxjs/toolkit";

import * as counterReducers from "./reducers";

const initialState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: counterReducers,
});
