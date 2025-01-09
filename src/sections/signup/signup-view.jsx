import * as yup from "yup";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useSnackbar } from "notistack";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import LoadingButton from "@mui/lab/LoadingButton";
import { alpha, useTheme } from "@mui/material/styles";
import InputAdornment from "@mui/material/InputAdornment";

import { useRouter } from "src/routes/hooks";

import { bgGradient } from "src/theme/css";
import { useSignUpMutation } from "src/redux/services/authApi";

import Logo from "src/components/logo";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

export default function SignupView() {
  const theme = useTheme();

  const router = useRouter();

  const [showNewPassword, setShowNewPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [signup, { isLoading }] = useSignUpMutation();

  const { enqueueSnackbar } = useSnackbar();

  const SignupSchema = yup.object().shape({
    name: yup.string().required("Name is required"),
    email: yup
      .string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    contactNumber: yup.string().required("Contact number is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
      .string()
      .required("Confirm password is required")
      .oneOf([yup.ref("password"), null], "Passwords must match"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(SignupSchema),
  });

  const handleClick = async (values) => {
    try {
      const resultAction = await signup(values);
      if (resultAction?.data?.success) {
        enqueueSnackbar("Sign up successfully", { variant: "success" });
        router.push("/", { replace: true });
      }
    } catch (err) {
      enqueueSnackbar(err?.error ?? err?.data?.message, { variant: "error" });
      console.log("Failed to signin: ", err);
    }
  };

  const renderForm = (
    <form onSubmit={handleSubmit(handleClick)}>
      <Stack spacing={3}>
        <TextField
          name="name"
          label="Name"
          {...register("name", { required: true })}
          error={Boolean(errors.name)}
          helperText={errors.name?.message}
        />

        <TextField
          name="email"
          label="Email address"
          {...register("email", { required: true })}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />

        <TextField
          name="contactNumber"
          label="Contact Number"
          {...register("contactNumber", { required: true })}
          error={Boolean(errors.contactNumber)}
          helperText={errors.contactNumber?.message}
        />

        <TextField
          name="password"
          label="New Password"
          {...register("password", { required: true })}
          type={showNewPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={showNewPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />

        <TextField
          name="confirmPassword"
          label="Confirm Password"
          {...register("confirmPassword", { required: true })}
          type={showConfirmPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  <Iconify
                    icon={
                      showConfirmPassword ? "eva:eye-fill" : "eva:eye-off-fill"
                    }
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={Boolean(errors.confirmPassword)}
          helperText={errors.confirmPassword?.message}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 1 }}
      >
        <Typography variant="body2" sx={{ mt: 2, mb: 5 }}>
          Have an account?
          <Link to="/login">Login</Link>
        </Typography>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isLoading}
      >
        Sign Up
      </LoadingButton>
    </form>
  );

  return (
    <Box
      sx={{
        ...bgGradient({
          color: alpha(theme.palette.background.default, 0.9),
          imgUrl: "/assets/background/overlay_4.jpg",
        }),
        height: 1,
      }}
    >
      <Logo
        sx={{
          position: "fixed",
          top: { xs: 16, md: 24 },
          left: { xs: 16, md: 24 },
        }}
      />

      <Stack alignItems="center" justifyContent="center" sx={{ height: 1 }}>
        <Card
          sx={{
            p: 5,
            width: 1,
            maxWidth: 420,
          }}
        >
          <Typography variant="h4" mb={2}>
            Sign Up
          </Typography>
          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
