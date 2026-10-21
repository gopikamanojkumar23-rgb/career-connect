import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getErrorMessage } from "../../Services/api";

export const fetchAssignments = createAsyncThunk(
  "assignments/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/assignments");

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load assignments"),
      );
    }
  },
);

export const createAssignment = createAsyncThunk(
  "assignments/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/assignments", {
        ...payload,
        maxMarks: Number(payload.maxMarks) || 100,
        createdAt: new Date().toISOString().slice(0, 10),
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to create the assignment"),
      );
    }
  },
);

export const updateAssignment = createAsyncThunk(
  "assignments/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data: current } = await api.get(`/assignments/${id}`);
      const { data } = await api.put(`/assignments/${id}`, { ...current, ...payload });

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to update the assignment"),
      );
    }
  },
);

export const deleteAssignment = createAsyncThunk(
  "assignments/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/assignments/${id}`);

      return id;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to remove the assignment"),
      );
    }
  },
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const assignmentSlice = createSlice({
  name: "assignments",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchAssignments.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchAssignments.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      .addCase(fetchAssignments.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(createAssignment.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(createAssignment.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateAssignment.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (assignment) => assignment.id === action.payload.id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(updateAssignment.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteAssignment.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (assignment) => assignment.id !== action.payload,
        );
      })

      .addCase(deleteAssignment.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default assignmentSlice.reducer;
