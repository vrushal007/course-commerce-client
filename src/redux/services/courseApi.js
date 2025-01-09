import { createApi } from "@reduxjs/toolkit/query/react";

import { extendedBaseQuery } from "../customBaseQuery";

export const courseApi = createApi({
  reducerPath: "courseApi",
  baseQuery: extendedBaseQuery,
  tagTypes: ["Course"],
  endpoints: (builder) => ({
    getCourses: builder.query({
      query: (params) => {
        const query = {};
        console.log(params);
        if (params?.search) query.search = params.search;

        return {
          url: `courses?${new URLSearchParams(query).toString()}`,
          method: "GET",
        };
      },
      providesTags: ["Course"],
    }),
    createCourse: builder.mutation({
      query: (body) => ({
        url: "courses",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

    editCourse: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `courses/${id}`,
        method: "PUT",
        body,
      }),
      invalidatesTags: ["Course"],
    }),

    deleteCourse: builder.mutation({
      query: ({ id }) => ({
        url: `courses/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Course"],
    }),
    getCourseByUser: builder.query({
      query: (params) => ({
        url: `courses/${params.id}`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    getCoursesByUser: builder.query({
      query: ({ id }) => ({
        url: `courses/byUserId/${id}`,
        method: "GET",
      }),
      providesTags: ["Course"],
    }),
    enrollUser: builder.mutation({
      query: ({ id }) => ({
        url: `courses/${id}/enroll`,
        method: "POST",
      }),
      invalidatesTags: ["Course"],
    }),
    completeLecture: builder.mutation({
      query: ({ courseId, lectureId }) => ({
        url: `courses/lecture/${lectureId}/completeToggle`,
        method: "POST",
      }),
      invalidatesTags: ["Course"],
    }),
    getEnrolledGraphData: builder.query({
      query: () => ({
        url: `courses/graph/enrolled`,
        method: "GET",
      }),
    }),
  }),
});

export const {
  useGetCoursesQuery,
  useCreateCourseMutation,
  useEditCourseMutation,
  useDeleteCourseMutation,
  useGetCourseByUserQuery,
  useGetCoursesByUserQuery,
  useEnrollUserMutation,
  useCompleteLectureMutation,
  useGetEnrolledGraphDataQuery,
} = courseApi;
