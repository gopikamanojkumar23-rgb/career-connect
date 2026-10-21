import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { getErrorMessage } from "../../Services/api";

export const fetchNotifications = createAsyncThunk(
  "notifications/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/notifications");

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to load notifications"),
      );
    }
  },
);

export const createNotification = createAsyncThunk(
  "notifications/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/notifications", {
        ...payload,
        recipientId: payload.recipientId ?? null,
        createdAt: new Date().toISOString(),
        read: false,
      });

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to send the notification"),
      );
    }
  },
);

export const updateNotification = createAsyncThunk(
  "notifications/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/notifications/${id}`, payload);

      return data;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to update the notification"),
      );
    }
  },
);

export const deleteNotification = createAsyncThunk(
  "notifications/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${id}`);

      return id;
    } catch (error) {
      return rejectWithValue(
        getErrorMessage(error, "Unable to remove the notification"),
      );
    }
  },
);

const initialState = {
  items: [],
  status: "idle",
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      .addCase(fetchNotifications.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(createNotification.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(updateNotification.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (notification) => notification.id === action.payload.id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (notification) => notification.id !== action.payload,
        );
      })
  },
});

export default notificationSlice.reducer;
