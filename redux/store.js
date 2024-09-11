import { configureStore } from "@reduxjs/toolkit";
import { counterSlice } from "./features/counter/counterSlice";
import { loginSlice } from "./features/login/loginSlice";
import { requestSlice } from "./features/request/requestSlice";
import { driverSlice } from "./features/driver/driverSlice";

export const store = configureStore({
  reducer: {
    counter: counterSlice.reducer,
    login: loginSlice.reducer,
    request: requestSlice.reducer,
    driver: driverSlice.reducer,
  },

  middleware: (getDefaultMiddleware) => getDefaultMiddleware({
    immutableCheck: { warnAfter: 50 },
    serializableCheck: { warnAfter: 50 },
  })
});
