import { configureStore } from '@reduxjs/toolkit'

import assignmentReducer from './Slice/assignmentSlice'
import authReducer, { storeUser } from './Slice/authSlice'
import notificationReducer from './Slice/notificationSlice'
import submissionReducer from './Slice/submissionSlice'
import userReducer from './Slice/userSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    assignments: assignmentReducer,
    submissions: submissionReducer,
    notifications: notificationReducer,
  },
})

// Keep the signed-in user in localStorage so a refresh keeps the session.
store.subscribe(() => {
  storeUser(store.getState().auth.user)
})

export default store
