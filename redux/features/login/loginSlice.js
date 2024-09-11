import { createSlice } from "@reduxjs/toolkit";

import * as counterReducers from "./reducers";

const initialState = {
  form: {
    
  },
  loggedUser: {},
  registerResponse: {},
  run: {},
};

export const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: counterReducers,
});
