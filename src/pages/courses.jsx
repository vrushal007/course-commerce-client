import { Helmet } from "react-helmet-async";

import CourseView from "src/sections/course/course-view";


// ----------------------------------------------------------------------

export default function CoursesPage() {
  return (
    <>
      <Helmet>
        <title> Courses | Minimal UI </title>
      </Helmet>

      <CourseView />
    </>
  );
}
