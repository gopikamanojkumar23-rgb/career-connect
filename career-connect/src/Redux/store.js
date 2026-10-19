import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./Slice/authSlice";
import userReducer from "./Slice/userSlice";
import assignmentReducer from "./Slice/assignmentSlice";

const store = configureStore({
  reducer: {authReducer,userReducer,assignmentReducer},
});

export default store;