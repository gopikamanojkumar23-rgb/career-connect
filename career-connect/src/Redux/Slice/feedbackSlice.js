import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api, { getErrorMessage } from "../../Services/api";

export const fetchFeedback = createAsyncThunk(
  "feedback/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/feedback");

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load the feedback"),
      );
    }
  },
);

export const createFeedback = createAsyncThunk(
  "feedback/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/feedback", {
        ...payload,
        createdAt: new Date().toISOString(),
        reply: "",
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to send the feedback"),
      );
    }
  },
);

export const updateFeedback = createAsyncThunk(
  "feedback/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data: current } = await api.get(`/feedback/${id}`);
      const { data } = await api.put(`/feedback/${id}`, { ...current, ...payload });

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to update the feedback"),
      );
    }
  },
);

export const deleteFeedback = createAsyncThunk(
  "feedback/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/feedback/${id}`);

      return id;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to remove the feedback"),
      );
    }
  },
);

const initialState = {
  items: [],
  status: "idle",
};

const feedbackSlice = createSlice({
  name: "feedback",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedback.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchFeedback.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      .addCase(fetchFeedback.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(createFeedback.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(updateFeedback.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(deleteFeedback.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item.id !== action.payload);
      });
  },
});

export default feedbackSlice.reducer;
