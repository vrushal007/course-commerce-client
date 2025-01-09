import { faker } from "@faker-js/faker";

import Container from "@mui/material/Container";
import Grid from "@mui/material/Unstable_Grid2";
import { CircularProgress } from "@mui/material";
import Typography from "@mui/material/Typography";

import { useGetEnrolledGraphDataQuery } from "src/redux/services/courseApi";

import Iconify from "src/components/iconify";

import AppTasks from "../app-tasks";
import AppNewsUpdate from "../app-news-update";
import AppOrderTimeline from "../app-order-timeline";
import AppCurrentVisits from "../app-current-visits";
import AppWebsiteVisits from "../app-website-visits";
import AppWidgetSummary from "../app-widget-summary";
import AppTrafficBySite from "../app-traffic-by-site";
import AppCurrentSubject from "../app-current-subject";
import AppConversionRates from "../app-conversion-rates";

// ----------------------------------------------------------------------

export default function AppView() {
  const { data, isLoading, isFetching } = useGetEnrolledGraphDataQuery();

  return (
    <Container maxWidth="xl">
      <Typography variant="h4" sx={{ mb: 5 }}>
        Hi, Welcome back 👋
      </Typography>
      {(isLoading || isFetching) && <CircularProgress />}
      <Grid container spacing={3}>
        <Grid xs={12} md={6} lg={4}>
          <AppCurrentSubject
            title="Current Erollments"
            chart={{
              categories: data?.data?.map((item) => item.title) || [],
              series: [
                {
                  name: "Series 1",
                  data: data?.data?.map((item) => item.totalEnrolled) || [],
                },
              ],
            }}
          />
        </Grid>
      </Grid>
    </Container>
  );
}
