import { useState } from "react";
import { useSnackbar } from "notistack";
import { useParams } from "react-router-dom";

import { LoadingButton } from "@mui/lab";
import { CheckBox, Lock } from "@mui/icons-material";
import {
  Stack,
  styled,
  Checkbox,
  MenuItem,
  Container,
  Typography,
  LinearProgress,
  CircularProgress,
  FormControlLabel,
  linearProgressClasses,
} from "@mui/material";

import {
  useEnrollUserMutation,
  useGetCourseByUserQuery,
  useCompleteLectureMutation,
} from "src/redux/services/courseApi";

import Label from "src/components/label";

export const CourseShow = () => {
  const { id } = useParams();

  const { enqueueSnackbar } = useSnackbar();

  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);

  const {
    data: course,
    isLoading,
    isFetching,
    error,
  } = useGetCourseByUserQuery({ id });

  const [enrollUser, { isLoading: isEnrolling }] = useEnrollUserMutation();

  const [completeLecture, { isLoading: isLectureCompleting }] =
    useCompleteLectureMutation();

  const handleEnrollUser = async () => {
    try {
      const resultAction = await enrollUser({ id });
      if (resultAction?.data?.success) {
        enqueueSnackbar("Enrolled Successfully", { variant: "success" });
      }
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  const completeToggleLectureHandler = async (lectureId, value) => {
    try {
      const resultAction = await completeLecture({
        lectureId,
      });
    } catch (err) {
      enqueueSnackbar(err.message, { variant: "error" });
    }
  };

  if (isLoading)
    return (
      <Container>
        <CircularProgress />
      </Container>
    );

  if (error) return <Container>Something Went Wrong</Container>;

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Container
        sx={{
          flex: 3,
        }}
      >
        {course?.data?.Enrollments?.length ? (
          <iframe
            width="560"
            height="315"
            src={course?.data?.LectureLinks[currentLectureIndex]?.link}
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowfullscreen
          />
        ) : (
          <img src={course?.data?.thumbnail} alt={course?.data?.title} />
        )}

        <Stack mb={2}>
          <Typography variant="h4">{course?.data?.title}</Typography>
        </Stack>
        <Stack mb={2}>
          <Typography variant="h6">Description :</Typography>
          <Typography>{course?.data?.description}</Typography>
        </Stack>

        <Stack
          mb={2}
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "flex-start",
            flexDirection: "row",
          }}
        >
          {course?.data?.category?.map((category, index) => (
            <Label key={index}>{category}</Label>
          ))}
        </Stack>

        <Stack mb={2}>
          <Typography variant="h6">Table of Contents:</Typography>
          {course?.data?.LectureLinks?.map((link, index) => (
            <Typography key={index}>
              {index + 1}. {link?.label}
            </Typography>
          ))}
        </Stack>
        {!course?.data?.Enrollments?.length && (
          <LoadingButton
            variant="contained"
            loading={isEnrolling}
            onClick={handleEnrollUser}
          >
            Enroll Now
          </LoadingButton>
        )}
      </Container>
      <Container
        sx={{
          flex: 1,
        }}
      >
        {course?.data?.Enrollments?.length ? (
          <>
            <Container
              sx={{
                maxHeight: "70vh",
              }}
            >
              {course?.data?.Enrollments?.length &&
                course?.data?.LectureLinks?.map((link, index) => (
                  <MenuItem
                    key={index}
                    onClick={() => setCurrentLectureIndex(index)}
                    selected={currentLectureIndex === index}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          checked={
                            course?.data?.LectureCompletions?.find(
                              (compLec) => compLec.lectureId === link?.id,
                            ).isCompleted
                          }
                        />
                      }
                      onClick={(ev) => {
                        completeToggleLectureHandler(link?.id);
                      }}
                    />
                    {link?.label}
                  </MenuItem>
                ))}
            </Container>
            <Container>
              <Typography my={1} variant="h6">
                Completion Percentage
              </Typography>
              <BorderLinearProgress
                variant="determinate"
                value={course?.data?.completionPercentage}
              />
            </Container>
          </>
        ) : (
          <Container
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
              gap: 2,
            }}
          >
            <Lock
              sx={{
                height: 50,
                width: 50,
              }}
            />
            <Typography variant="h4" textAlign={"center"}>
              Please enroll to access the course
            </Typography>
          </Container>
        )}
      </Container>
    </Container>
  );
};

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor:
      theme.palette.grey[theme.palette.mode === "light" ? 200 : 800],
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: theme.palette.mode === "light" ? "#1a90ff" : "#308fe8",
  },
}));
