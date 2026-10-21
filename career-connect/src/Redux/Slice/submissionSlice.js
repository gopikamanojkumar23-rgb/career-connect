import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api, { getErrorMessage } from "../../Services/api";

export const fetchSubmissions = createAsyncThunk(
  "submissions/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/submissions");

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load submissions"),
      );
    }
  },
);

export const createSubmission = createAsyncThunk(
  "submissions/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/submissions", {
        ...payload,
        submittedAt: new Date().toISOString().slice(0, 10),
        status: "Submitted",
        feedback: "",
        rating: 0,
      });

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to submit the work"));
    }
  },
);

export const updateSubmission = createAsyncThunk(
  "submissions/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/submissions/${id}`, payload);

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to update the submission"),
      );
    }
  },
);

export const deleteSubmission = createAsyncThunk(
  "submissions/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/submissions/${id}`);

      return id;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to remove the submission"),
      );
    }
  },
);

const initialState = {
  items: [],
  status: "idle",
};

const submissionSlice = createSlice({
  name: "submissions",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      .addCase(fetchSubmissions.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(createSubmission.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(updateSubmission.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (submission) => submission.id === action.payload.id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(deleteSubmission.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (submission) => submission.id !== action.payload,
        );
      })
  },
});

export default submissionSlice.reducer;
