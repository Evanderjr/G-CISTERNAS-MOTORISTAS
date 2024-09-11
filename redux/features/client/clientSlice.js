import { createSlice } from "@reduxjs/toolkit";

import * as clientReducers from "./reducers";

const initialState = {
    form: {
        firstName: "", 
        lastName: "", 
        phone: "",
        email: "",
    },
    clientInfo: {},
    allClientsInfo: {},
    run: {},
};

export const clientSlice = createSlice({
    name: "client",
    initialState,
    reducers: clientReducers,
});
