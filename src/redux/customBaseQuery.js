import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { logout } from "./slices/authSlice";
import { setToast } from "./slices/toastSlice";
// import { setToast } from "../slices/toastslice";

export const extendedBaseQuery = async (args, api, extraOptions) => {
  const modifiedBaseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    mode: "cors",
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("token");

      if (token) {
        headers.set("authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  try {
    const result = await modifiedBaseQuery(args, api, extraOptions);
    console.log("reas", result);
    if (result.error) {
      if (result.error.status === 401) {
        try {
          localStorage.clear();
          api.dispatch(logout());
          api.dispatch(
            setToast({
              variant: "error",
              message: result?.error?.data?.message ?? result?.error?.error,
              open: true,
            }),
          );
        } catch (error) {
          console.error("Error in logout", error);
        }
      }
    }

    return result;
  } catch (error) {
    console.log("err",error)
    api.dispatch(
      setToast({
        variant: "error",
        message: "Somthing went wrong",
        open: true,
      }),
    );
    return error;
  }
};
