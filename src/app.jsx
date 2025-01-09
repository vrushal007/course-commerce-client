/* eslint-disable perfectionist/sort-imports */
import { useSnackbar } from "notistack";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import "src/global.css";

import { useScrollToTop } from "src/hooks/use-scroll-to-top";

import Router from "src/routes/sections";
import ThemeProvider from "src/theme";
import { setToast } from "./redux/slices/toastSlice";
import { login } from "./redux/slices/authSlice";

// ----------------------------------------------------------------------

export default function App() {
  useScrollToTop();

  const { enqueueSnackbar } = useSnackbar();

  const { open, message, variant } = useSelector((state) => state.toast);
  const dispatch = useDispatch();

  useEffect(() => {
    if (open) {
      enqueueSnackbar(message, { variant });

      dispatch(
        setToast({
          open: false,
          message: "",
          variant: "default",
        }),
      );
    }
  }, [open, message, variant, enqueueSnackbar, dispatch]);

  return (
    <ThemeProvider>
      <Router />
    </ThemeProvider>
  );
}
