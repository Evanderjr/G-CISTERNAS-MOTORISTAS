import { createSlice } from "@reduxjs/toolkit";

import * as cisternReducers from "./reducers";

const initialState = {
    form: {
        image: '../../assets/images/cabs/cab1.png',
        capacity: 0,
        amount: 0,
    },
    cisternsInfo: {},
    run: {},
};

export const cisternSlice = createSlice({
    name: "cistern",
    initialState,
    reducers: cisternReducers,
});
