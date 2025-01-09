import { useRef, useState } from "react";
import { useSelector } from "react-redux";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import { CircularProgress, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";

import {
  useGetCoursesByUserQuery,
  useGetCoursesQuery,
} from "src/redux/services/courseApi";

import CourseCard from "../course/course-card";

// ----------------------------------------------------------------------

export default function MyCourseView() {
  const user = JSON.parse(localStorage.getItem("user"));

  const { data, isLoading, isFetching } = useGetCoursesByUserQuery({
    id: user.id,
  });

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">My Course</Typography>
      </Stack>

      {(isLoading || isFetching) && <CircularProgress />}
      {data?.data?.length === 0 && (
        <Typography variant="h5">No course found</Typography>
      )}
      <Grid container spacing={3}>
        {data?.data?.map((course, index) => (
          <Grid key={course.id} xs={12} sm={6} md={3}>
            <CourseCard key={course.id} course={course} index={index} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
