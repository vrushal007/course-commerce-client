import { configureStore } from "@reduxjs/toolkit";

import { authApi } from "./services/authApi";
import toastSlice from "./slices/toastSlice";
import { courseApi } from "./services/courseApi";
import authSlice, { authSliceMiddleware } from "./slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    toast: toastSlice,
    [authApi.reducerPath]: authApi.reducer,
    [courseApi.reducerPath]: courseApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      authApi.middleware,
      authSliceMiddleware,
      courseApi.middleware,
    ),
});
