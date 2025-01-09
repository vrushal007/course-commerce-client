import PropTypes from "prop-types";
import { useDispatch } from "react-redux";
import { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";

import Box from "@mui/material/Box";

import { login } from "src/redux/slices/authSlice";

import Nav from "./nav";
import Main from "./main";
import Header from "./header";


// ----------------------------------------------------------------------

export default function DashboardLayout({ children }) {
  const [openNav, setOpenNav] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    if (user && token) {
      dispatch(login({ data: user, token }));
    }
  }, [user, token, dispatch]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Header onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: "flex",
          flexDirection: { xs: "column", lg: "row" },
        }}
      >
        <Nav openNav={openNav} onCloseNav={() => setOpenNav(false)} />

        <Main>{children}</Main>
      </Box>
    </>
  );
}

DashboardLayout.propTypes = {
  children: PropTypes.node,
};
