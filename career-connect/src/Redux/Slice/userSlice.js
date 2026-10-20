import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import api, { getErrorMessage } from "../../Services/api";

export const fetchUsers = createAsyncThunk(
  "users/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get("/users");

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to load users"));
    }
  },
);

export const createUser = createAsyncThunk(
  "users/create",
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post("/users", {
        ...payload,
        joined: new Date().toISOString().slice(0, 10),
      });

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to add the user"));
    }
  },
);

export const updateUser = createAsyncThunk(
  "users/update",
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/users/${id}`, payload);

      return data;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to update the user"));
    }
  },
);

export const deleteUser = createAsyncThunk(
  "users/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/users/${id}`);

      return id;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, "Unable to remove the user"));
    }
  },
);

const initialState = {
  items: [],
  status: "idle",
  error: null,
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      .addCase(createUser.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(createUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (user) => user.id === action.payload.id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.payload;
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((user) => user.id !== action.payload);
      })

      .addCase(deleteUser.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearUserError } = userSlice.actions;
export default userSlice.reducer;
