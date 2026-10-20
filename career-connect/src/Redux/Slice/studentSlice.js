import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api, { getErrorMessage } from "../../Services/api";

/**
 * Everything a student is told about: exam dates, tasks and projects.
 * Assignments and submissions live in their own slices.
 */
export const fetchStudentContent = createAsyncThunk(
  "student/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const [exams, tasks, projects] = await Promise.all([
        api.get("/exams"),
        api.get("/tasks"),
        api.get("/projects"),
      ]);

      return {
        exams: exams.data,
        tasks: tasks.data,
        projects: projects.data,
      };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load your study plan"),
      );
    }
  },
);

const initialState = {
  exams: [],
  tasks: [],
  projects: [],
  status: "idle",
  error: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    clearStudentError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentContent.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchStudentContent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.exams = action.payload.exams;
        state.tasks = action.payload.tasks;
        state.projects = action.payload.projects;
      })

      .addCase(fetchStudentContent.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { clearStudentError } = studentSlice.actions;
export default studentSlice.reducer;
