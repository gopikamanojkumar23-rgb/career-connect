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

export const createStudentItem = createAsyncThunk(
  "student/create",
  async ({ type, values }, { rejectWithValue }) => {
    try {
      const { data } = await api.post(`/${type}`, values);

      return { type, item: data };
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to save the record"));
    }
  },
);

export const updateStudentItem = createAsyncThunk(
  "student/update",
  async ({ type, id, values }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/${type}/${id}`, values);

      return { type, item: data };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to update the record"),
      );
    }
  },
);

export const deleteStudentItem = createAsyncThunk(
  "student/delete",
  async ({ type, id }, { rejectWithValue }) => {
    try {
      await api.delete(`/${type}/${id}`);

      return { type, id };
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to remove the record"),
      );
    }
  },
);

const initialState = {
  exams: [],
  tasks: [],
  projects: [],
  status: "idle",
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudentContent.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchStudentContent.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.exams = action.payload.exams;
        state.tasks = action.payload.tasks;
        state.projects = action.payload.projects;
      })

      .addCase(fetchStudentContent.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(createStudentItem.fulfilled, (state, action) => {
        const { type, item } = action.payload;

        state[type].push(item);
      })

      .addCase(updateStudentItem.fulfilled, (state, action) => {
        const { type, item } = action.payload;
        const index = state[type].findIndex((row) => row.id === item.id);

        if (index !== -1) {
          state[type][index] = item;
        }
      })

      .addCase(deleteStudentItem.fulfilled, (state, action) => {
        const { type, id } = action.payload;

        state[type] = state[type].filter((row) => row.id !== id);
      })
  },
});

export default studentSlice.reducer;
