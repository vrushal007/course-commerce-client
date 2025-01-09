import { lazy, Suspense } from "react";
import { Outlet, Navigate, useRoutes } from "react-router-dom";

import SignUpPage from "src/pages/signup";
import DashboardLayout from "src/layouts/dashboard";
import CoursesPage from "src/pages/courses";
import { CourseShow } from "src/sections/course/course-show";
import MyCourseView from "src/sections/myCourses/my-course-view";
import AppPage from "src/pages/app";

export const IndexPage = lazy(() => import("src/pages/app"));
export const BlogPage = lazy(() => import("src/pages/blog"));
export const UserPage = lazy(() => import("src/pages/user"));
export const LoginPage = lazy(() => import("src/pages/login"));
export const ProductsPage = lazy(() => import("src/pages/products"));
export const Page404 = lazy(() => import("src/pages/page-not-found"));

// ----------------------------------------------------------------------

export default function Router() {
  const routes = useRoutes([
    {
      element: (
        <DashboardLayout>
          <Suspense>
            <Outlet />
          </Suspense>
        </DashboardLayout>
      ),
      children: [
        { path: "/", element: <IndexPage /> },
        // { path: "user", element: <UserPage /> },
        // { path: "products", element: <ProductsPage /> },
        // { path: "blog", element: <BlogPage /> },
        { path: "course", element: <CoursesPage />, index: true },
        { path: "course/:id", element: <CourseShow /> },
        { path: "my-courses", element: <MyCourseView /> },
      ],
    },
    {
      path: "login",
      element: <LoginPage />,
    },
    {
      path: "sign-up",
      element: <SignUpPage />,
    },
    {
      path: "404",
      element: <Page404 />,
    },
    {
      path: "*",
      element: <Navigate to="/404" replace />,
    },
  ]);

  return routes;
}
