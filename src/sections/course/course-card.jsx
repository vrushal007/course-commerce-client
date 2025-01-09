import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { fCurrency } from "src/utils/format-number";

import Label from "src/components/label";
import { ColorPreview } from "src/components/color-utils";
import { Button, Grid } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { useDeleteCourseMutation } from "src/redux/services/courseApi";
import { LoadingButton } from "@mui/lab";

// ----------------------------------------------------------------------

export default function CourseCard({ course, onEdit, onDelete }) {
  const renderStatus = (
    <Label
      variant="filled"
      color={(course?.status === "sale" && "error") || "info"}
      sx={{
        zIndex: 9,
        top: 16,
        right: 16,
        position: "absolute",
        textTransform: "uppercase",
      }}
    >
      {course?.status}
    </Label>
  );

  const renderImg = (
    <Box
      component="img"
      alt={course.name}
      src={course.thumbnail}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: "cover",
        position: "absolute",
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      {/* <Typography
        component="span"
        variant="body1"
        sx={{
          color: "text.disabled",
          textDecoration: "line-through",
        }}
      > */}
      {/* {course.price && fCurrency(course.price)} */}
      {/* </Typography> */}
      {/* &nbsp; */}
      {fCurrency(course.price)}
    </Typography>
  );

  const router = useRouter();

  const user = JSON.parse(localStorage.getItem("user"));

  const [deleteCourse, { isLoading }] = useDeleteCourseMutation();

  return (
    <Card>
      <Box sx={{ pt: "100%", position: "relative" }}>
        {course.status && renderStatus}

        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 3 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
            {course.title}
          </Link>

          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
          >
            {/* <ColorPreview colors={course.colors} /> */}
            {renderPrice}
          </Stack>
        </Stack>
        <Typography
          variant="subtitle2"
          sx={{
            color: "text.secondary",
          }}
        >
          {course?.instructorName}
        </Typography>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            flexWrap: "wrap",
          }}
        >
          {course?.category?.map((tag) => (
            <Label key={tag}>{tag}</Label>
          ))}
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            router.push(`/course/${course.id}`);
          }}
        >
          {user?.role === "user" && !course.isEnrolled ? "Enroll Now" : "View"}
        </Button>
        {user?.role === "admin" && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              onEdit(course);
            }}
          >
            Edit
          </Button>
        )}
        {user?.role === "admin" && (
          <LoadingButton
            variant="contained"
            color="error"
            onClick={() => {
              deleteCourse({ id: course.id });
            }}
            loading={isLoading}
          >
            Delete
          </LoadingButton>
        )}
      </Stack>
    </Card>
  );
}

CourseCard.propTypes = {
  course: PropTypes.object,
};
