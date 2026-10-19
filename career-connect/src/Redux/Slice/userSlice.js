import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  profile: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },

    addUser: (state, action) => {
      state.users.push(action.payload);
    },

    updateUser: (state, action) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );

      if (index !== -1) {
        state.users[index] = action.payload;
      }
    },

    deleteUser: (state, action) => {
      state.users = state.users.filter(
        (user) => user.id !== action.payload
      );
    },

    setProfile: (state, action) => {
      state.profile = action.payload;
    },

    updateProfile: (state, action) => {
      state.profile = {
        ...state.profile,
        ...action.payload,
    };
    },
  },
});

export const {setUsers,addUser,updateUser,deleteUser,setProfile,updateProfile} = userSlice.actions;
export default userSlice.reducer;