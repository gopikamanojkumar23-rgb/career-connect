import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'

import api, { getErrorMessage } from '../../Services/api'

export const fetchSubmissions = createAsyncThunk(
  'submissions/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await api.get('/submissions')

      return data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to load submissions'))
    }
  },
)

export const createSubmission = createAsyncThunk(
  'submissions/create',
  async (payload, { rejectWithValue }) => {
    try {
      const { data } = await api.post('/submissions', {
        ...payload,
        submittedAt: new Date().toISOString().slice(0, 10),
        status: 'Submitted',
        feedback: '',
        rating: 0,
      })

      return data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to submit the work'))
    }
  },
)

export const updateSubmission = createAsyncThunk(
  'submissions/update',
  async ({ id, ...payload }, { rejectWithValue }) => {
    try {
      const { data } = await api.put(`/submissions/${id}`, payload)

      return data
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to update the submission'))
    }
  },
)

export const deleteSubmission = createAsyncThunk(
  'submissions/delete',
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/submissions/${id}`)

      return id
    } catch (error) {
      return rejectWithValue(getErrorMessage(error, 'Unable to remove the submission'))
    }
  },
)

const submissionSlice = createSlice({
  name: 'submissions',
  initialState: {
    items: [],
    status: 'idle',
    error: null,
  },
  reducers: {
    clearSubmissionError(state) {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubmissions.pending, (state) => {
        state.status = 'loading'
        state.error = null
      })
      .addCase(fetchSubmissions.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.items = action.payload
      })
      .addCase(fetchSubmissions.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload
      })
      .addCase(createSubmission.fulfilled, (state, action) => {
        state.items.push(action.payload)
      })
      .addCase(createSubmission.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(updateSubmission.fulfilled, (state, action) => {
        const index = state.items.findIndex(
          (submission) => submission.id === action.payload.id,
        )

        if (index !== -1) {
          state.items[index] = action.payload
        }
      })
      .addCase(updateSubmission.rejected, (state, action) => {
        state.error = action.payload
      })
      .addCase(deleteSubmission.fulfilled, (state, action) => {
        state.items = state.items.filter(
          (submission) => submission.id !== action.payload,
        )
      })
      .addCase(deleteSubmission.rejected, (state, action) => {
        state.error = action.payload
      })
  },
})

export const { clearSubmissionError } = submissionSlice.actions

export default submissionSlice.reducer
