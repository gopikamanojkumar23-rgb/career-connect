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
  error: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    clearNotificationError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(createNotification.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(createNotification.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateNotification.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (notification) => notification.id === action.payload.id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(updateNotification.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (notification) => notification.id !== action.payload,
        );
      })

      .addCase(deleteNotification.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearNotificationError } = notificationSlice.actions;
export default notificationSlice.reducer;
