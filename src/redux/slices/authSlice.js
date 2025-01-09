import { createSlice } from "@reduxjs/toolkit";

import { authApi } from "../services/authApi";

const authSlice = createSlice({
  name: "auth",
  initialState: { user: null, token: null },
  reducers: {
    login: (state, action) => {
      state.user = action.payload.data;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      authApi.endpoints.login.matchFulfilled,
      (state, action) => {
        state.user = action.payload.data;
        state.token = action.payload.data.token;
      },
    );
  },
});

export const authSliceMiddleware =
  ({ getState }) =>
  (next) =>
  (action) => {
    const result = next(action);
    if (getState()?.auth?.user) {
      localStorage.setItem("token", getState().auth.user.token);
    }
    if (getState()?.auth?.user) {
      localStorage.setItem("user", JSON.stringify(getState().auth.user));
    }
    return result;
  };

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;

export const selectUser = (state) => state.auth.user;
export const selectToken = (state) => state.auth.token;
