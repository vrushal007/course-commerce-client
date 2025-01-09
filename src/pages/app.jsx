import { Helmet } from "react-helmet-async";
import { Navigate } from "react-router-dom";

import { AppView } from "src/sections/overview/view";

// ----------------------------------------------------------------------

export default function AppPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (user?.role !== "admin") {
    return <Navigate to="/course" replace />;
  }
  
  return (
    <>
      <Helmet>
        <title> Dashboard | Minimal UI </title>
      </Helmet>

      <AppView />
    </>
  );
}
