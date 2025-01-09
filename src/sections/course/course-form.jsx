import * as yup from "yup";
import PropTypes from "prop-types";
import { useSnackbar } from "notistack";
import { useEffect, useState } from "react";
import { yupResolver } from "@hookform/resolvers/yup";
import { useFieldArray, useForm } from "react-hook-form";

import { Add } from "@mui/icons-material";
// components
import { LoadingButton } from "@mui/lab";
// @mui
import {
  Box,
  Chip,
  Stack,
  Drawer,
  Button,
  Divider,
  TextField,
  Container,
  Typography,
  IconButton,
  Autocomplete,
  FormHelperText,
  CircularProgress,
} from "@mui/material";

import { useResponsive } from "src/hooks/use-responsive";

import {
  useCreateCourseMutation,
  useEditCourseMutation,
  useGetCourseByUserQuery,
} from "src/redux/services/courseApi";

import Iconify from "src/components/iconify";
import Scrollbar from "src/components/scrollbar";

CourseForm.propTypes = {
  open: PropTypes.bool,
  onOpen: PropTypes.func,
  onClose: PropTypes.func,
  edit: PropTypes.bool,
  openRow: PropTypes.object,
};

export default function CourseForm({ open, onClose, edit, openRow }) {
  const { enqueueSnackbar } = useSnackbar();
  console.log(openRow, edit);
  const isMedium = useResponsive("down", "md");

  const CourseSchema = yup.object().shape({
    title: yup.string().required("Title is required"),
    description: yup.string().required("Description is required"),
    category: yup
      .array()
      .of(yup.string())
      .min(1, "Tags is required")
      .typeError("Tags is required"),
    lectureLinks: yup
      .array()
      .of(
        yup.object().shape({
          label: yup.string().required("Label is required"),
          link: yup.string().required("Link is required"),
        }),
      )
      .min(1, "Course Links is required")
      .typeError("Course Links is required"),
    price: yup.number().required("Price is required"),
    instructorName: yup.string().required("Instructor is required"),
    totalDuration: yup.string().required("Total Duration is required"),
    thumbnail: yup.string().required("Thumbnail is required"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
    watch,
    control,
  } = useForm({
    resolver: yupResolver(CourseSchema),
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lectureLinks",
  });

  useEffect(() => {
    if (fields.length === 0) {
      append("");
    }
  }, [open]);

  const addCourseLinkHandler = () => {
    if (!Object.keys(errors).length) {
      append("");
    }
  };

  const deleteCourseLinkHandler = (index) => {
    if (fields.length === 1) return;
    remove(index);
  };

  const [createBlog, { isLoading }] = useCreateCourseMutation();
  const [editBlog, { isLoading: isEditLoading }] = useEditCourseMutation();

  useEffect(() => {
    if (edit && openRow) {
      setValue("title", openRow?.title);
      setValue("description", openRow?.description);
      setValue("category", openRow?.category);
      setValue("lectureLinks", openRow?.lectureLinks);
      setValue("price", openRow?.price);
      setValue("instructorName", openRow?.instructorName);
      setValue("totalDuration", openRow?.totalDuration);
      setValue("thumbnail", openRow?.thumbnail);
    } else {
      reset();
      fields.forEach((item, index) => {
        remove(index);
      });
    }
  }, [open, reset, openRow, edit, setValue]);

  const handleClick = async (values) => {
    try {
      let resultAction;
      if (edit) {
        resultAction = await editBlog({
          ...values,
          id: openRow?.id,
        });
      } else {
        resultAction = await createBlog({
          ...values,
        });
      }
      if (resultAction?.data?.success) {
        enqueueSnackbar(resultAction?.data?.message, { variant: "success" });
        reset();
        onClose();
      }
    } catch (err) {
      enqueueSnackbar(err?.error, { variant: "error" });
      console.error("Failed to create devices: ", err);
    }
  };

  console.log("errors", errors);

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMedium ? "100%" : "80%",
          border: "none",
          overflow: "hidden",
          maxWidth: 500,
        },
      }}
    >
      <Scrollbar>
        <Stack spacing={3} sx={{ p: 3 }}>
          <div>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 0.5,
              }}
            >
              <Typography variant="subtitle1" gutterBottom>
                {edit ? "Edit" : "Create"} Blog
              </Typography>
              <IconButton onClick={onClose}>
                <Iconify icon="eva:close-fill" />
              </IconButton>
            </Box>
            <Divider />
          </div>
          <form onSubmit={handleSubmit(handleClick)}>
            <Stack spacing={3}>
              <TextField
                name="itemName"
                label="Item Name"
                {...register("itemName", { required: true })}
                error={Boolean(errors.itemName)}
                helperText={errors.itemName && errors.itemName.message}
              />

              <TextField
                name="description"
                label="Description"
                multiline
                rows={4}
                {...register("description", { required: true })}
                error={Boolean(errors.description)}
                helperText={errors.description && errors.description.message}
              />

              <TextField
                name="deliveryLocation"
                label="Delivery Location"
                {...register("deliveryLocation", { required: true })}
                error={Boolean(errors.deliveryLocation)}
                helperText={
                  errors.deliveryLocation && errors.deliveryLocation.message
                }
              />

              <TextField
                name="expectedPrice"
                label="Expected Price"
                {...register("expectedPrice", { required: true })}
                error={Boolean(errors.expectedPrice)}
                helperText={
                  errors.expectedPrice && errors.expectedPrice.message
                }
              />

              <LoadingButton
                type="submit"
                variant="contained"
                sx={{
                  mt: 3,
                  mb: 2,
                  width: isMedium ? "100%" : 240,
                }}
                loading={isLoading || isEditLoading}
              >
                Submit
              </LoadingButton>
            </Stack>
          </form>
        </Stack>
      </Scrollbar>
    </Drawer>
  );
}
