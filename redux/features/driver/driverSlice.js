import { createSlice } from "@reduxjs/toolkit";

import * as driverReducers from "./reducers";

const initialState = {
    driverInfo: {},
    run: {},
};

export const driverSlice = createSlice({
    name: "driver",
    initialState,
    reducers: driverReducers,
});
