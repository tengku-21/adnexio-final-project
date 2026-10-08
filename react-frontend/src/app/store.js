import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../APIs/auth/authSlice";
import { apiSlice } from "../APIs/api/apiSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,

    [apiSlice.reducerPath]: apiSlice.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});