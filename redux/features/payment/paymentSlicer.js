import { createSlice } from "@reduxjs/toolkit";

import * as paymentReducers from "./reducers";

const initialState = {
    form: {
    },
    paymentsInfo: {},
    run: {},
};

export const paymentSlice = createSlice({
    name: "payment",
    initialState,
    reducers: paymentReducers,
});
