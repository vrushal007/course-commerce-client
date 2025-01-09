import * as yup from "yup";
import { useState } from "react";
import { Link } from "react-router-dom";
// import { Link } from "react-router-dom";
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
import { useLoginMutation } from "src/redux/services/authApi";

import Logo from "src/components/logo";
import Iconify from "src/components/iconify";

// ----------------------------------------------------------------------

export default function LoginView() {
  const theme = useTheme();

  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);

  const [login, { isLoading }] = useLoginMutation();

  const { enqueueSnackbar } = useSnackbar();

  const LoginSchema = yup.object().shape({
    email: yup
      .string()
      .email("Email must be a valid email address")
      .required("Email is required"),
    password: yup.string().required("Password is required"),
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(LoginSchema),
  });

  const handleClick = async (values) => {
    try {
      // console.log('Form submit: ', values);
      const resultAction = await login(values);
      console.log("resultAction: ", resultAction);
      if (resultAction?.data?.success) {
        enqueueSnackbar("Login successfully", { variant: "success" });
        router.push("/", { replace: true });
      } else {
        enqueueSnackbar(
          resultAction?.error?.data?.message ?? resultAction?.error?.message,
          { variant: "error" },
        );
      }
    } catch (err) {
      enqueueSnackbar(err?.error ?? err?.data?.message, { variant: "error" });
      console.log("Failed to login: ", err);
    }
  };
  const renderForm = (
    <form onSubmit={handleSubmit(handleClick)}>
      <Stack spacing={3}>
        <TextField
          name="email"
          label="Email address"
          {...register("email", { required: true })}
          error={Boolean(errors.email)}
          helperText={errors.email?.message}
        />

        <TextField
          name="password"
          label="Password"
          {...register("password", { required: true })}
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword(!showPassword)}
                  edge="end"
                  aria-label="toggle password visibility"
                >
                  <Iconify
                    icon={showPassword ? "eva:eye-fill" : "eva:eye-off-fill"}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
          error={Boolean(errors.password)}
          helperText={errors.password?.message}
        />
      </Stack>

      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ my: 1 }}
      >
        <Typography variant="body2" sx={{ mt: 2, mb: 5, gap: 1 }}>
          Don’t have an account?
          <Link to="/sign-up">Get started</Link>
        </Typography>
      </Stack>

      <LoadingButton
        fullWidth
        size="large"
        type="submit"
        variant="contained"
        loading={isLoading}
      >
        Login
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
            Sign in
          </Typography>
          {renderForm}
        </Card>
      </Stack>
    </Box>
  );
}
