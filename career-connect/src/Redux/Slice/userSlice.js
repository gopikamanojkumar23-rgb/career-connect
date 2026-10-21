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
      const { data: current } = await api.get(`/users/${id}`);
      const { data } = await api.put(`/users/${id}`, { ...current, ...payload });

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
};

const userSlice = createSlice({
  name: "users",
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = "loading";
      })

      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })

      .addCase(fetchUsers.rejected, (state) => {
        state.status = "failed";
      })

      .addCase(createUser.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })

      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (user) => user.id === action.payload.id,
        );

        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })

      .addCase(deleteUser.fulfilled, (state, action) => {
        state.items = state.items.filter((user) => user.id !== action.payload);
      })
  },
});

export default userSlice.reducer;
