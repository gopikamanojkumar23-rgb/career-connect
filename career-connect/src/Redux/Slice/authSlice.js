import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import api, { getErrorMessage } from '../../Services/api'

const USER_KEY = 'cc_user'

// The signed-in user is kept in localStorage so a refresh keeps the session.
// The backend is a json-server mock, so there is no real token yet.
export function readStoredUser() {
  try {
    const raw = window.localStorage.getItem(USER_KEY)

    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function storeUser(user) {
  try {
    if (user) {
      window.localStorage.setItem(USER_KEY, JSON.stringify(user))
    } else {
      window.localStorage.removeItem(USER_KEY)
    }
  } catch {
    // Storage can be unavailable (private mode). The session still works in memory.
  }
}

function withoutPassword(user) {
  const copy = { ...user }

  delete copy.password

  return copy
}

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/users', { params: { email } })

      const user = data.find(
        (item) => item.email === email && item.password === password,
      )

      if (!user) {
        return rejectWithValue('Invalid email or password')
      }

      if (user.status === 'Suspended') {
        return rejectWithValue('This account has been suspended. Contact the admin.')
      }

      return withoutPassword(user)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to sign in'))
    }
  },
)

export const register = createAsyncThunk(
  'auth/register',
  async ({ name, email, password, phone, course }, { rejectWithValue }) => {
    try {
      const { data: existing } = await api.get('/users', { params: { email } })

      if (existing.length > 0) {
        return rejectWithValue('An account with this email already exists')
      }

      const { data } = await api.post('/users', {
        name,
        email,
        password,
        phone,
        course,
        role: 'Student',
        status: 'Active',
        joined: new Date().toISOString().slice(0, 10),
      })

      return withoutPassword(data)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to create the account'))
    }
  },
)

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async ({ email, name, picture }, { rejectWithValue }) => {
    try {
      const { data: existing } = await api.get('/users', { params: { email } })

      // Existing accounts keep their role and course.
      if (existing.length > 0) {
        return withoutPassword(existing[0])
      }

      // First time signing in, so the account is created as a student.
      const { data } = await api.post('/users', {
        name,
        email,
        phone: '',
        password: '',
        picture: picture || '',
        role: 'Student',
        course: 'Web Development',
        status: 'Active',
        joined: new Date().toISOString().slice(0, 10),
      })

      return withoutPassword(data)
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Google sign-in failed'))
    }
  },
)

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: readStoredUser(),
    status: 'idle',
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null
      state.error = null
    },
    clearAuthError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(register.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(loginWithGoogle.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.user = action.payload
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
  },
})

export const { logout, clearAuthError } = authSlice.actions

export default authSlice.reducer
