import { useRef, useState } from "react";

import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import { Box, CircularProgress, TextField } from "@mui/material";
import Typography from "@mui/material/Typography";

import {
  useDeleteCourseMutation,
  useGetCoursesQuery,
} from "src/redux/services/courseApi";

import Iconify from "src/components/iconify";

import CourseForm from "./course-form";
import CourseCard from "./course-card";

// ----------------------------------------------------------------------

export default function CourseView() {
  const [openForm, setOpenForm] = useState(false);
  const [openRow, setOpenRow] = useState(null);
  const [edit, setEdit] = useState(false);

  const onCloseForm = () => {
    setOpenRow(null);
    setEdit(false);
    setOpenForm(false);
  };

  const user = JSON.parse(localStorage.getItem("user"));

  const [search, setSearch] = useState("");

  const searchRef = useRef();

  const { data, isLoading, isFetching } = useGetCoursesQuery({
    search,
  });

  const handleEditCourse = (course) => {
    setOpenRow(course);
    setOpenForm(true);
    setEdit(true);
    console.log(course);
  };

  return (
    <Container>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={5}
      >
        <Typography variant="h4">Course</Typography>

        {user?.role === "admin" && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<Iconify icon="eva:plus-fill" />}
            onClick={() => setOpenForm(true)}
          >
            New Course
          </Button>
        )}
      </Stack>

      <Box
        width={400}
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 5,
          gap: 2,
        }}
      >
        <TextField
          sx={{
            width: "100%",
          }}
          label="Search"
          inputRef={searchRef}
          InputLabelProps={{
            shrink: true,
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearch(searchRef.current.value);
            }
          }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={() => setSearch(searchRef.current.value)}
          onChange={(e) => {
            if (e.target.value === "") setSearch("");
          }}
          sx={{
            height: 40,
          }}
        >
          Search
        </Button>
      </Box>

      {(isLoading || isFetching) && <CircularProgress />}
      {data?.data?.length === 0 && (
        <Typography variant="h5">No course found</Typography>
      )}
      <Grid container spacing={3}>
        {data?.data?.map((course, index) => (
          <Grid key={course.id} xs={12} sm={6} md={3}>
            <CourseCard
              key={course.id}
              course={course}
              index={index}
              onEdit={handleEditCourse}
            />
          </Grid>
        ))}
      </Grid>
      {user?.role === "admin" && (
        <CourseForm
          open={openForm}
          onClose={onCloseForm}
          edit={edit}
          openRow={openRow}
        />
      )}
    </Container>
  );
}
