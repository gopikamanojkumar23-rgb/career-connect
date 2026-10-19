import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  assignments: [],
  submissions: [],
  loading: false,
  error: null,
};

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {
    setAssignments: (state, action) => {
      state.assignments = action.payload;
    },

    addAssignment: (state, action) => {
      state.assignments.push(action.payload);
    },

    updateAssignment: (state, action) => {
      const index = state.assignments.findIndex(
        (assignment) => assignment.id === action.payload.id
      );

      if (index !== -1) {
        state.assignments[index] = action.payload;
      }
    },

    deleteAssignment: (state, action) => {
      state.assignments = state.assignments.filter(
        (assignment) => assignment.id !== action.payload
      );
    },

    setSubmissions: (state, action) => {
      state.submissions = action.payload;
    },

    addSubmission: (state, action) => {
      state.submissions.push(action.payload);
    },

    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setError: (state, action) => {
      state.error = action.payload;
    },
  },
});

export const {setAssignments,addAssignment,updateAssignment,deleteAssignment,setSubmissions,addSubmission,setLoading,setError} = assignmentSlice.actions;
export default assignmentSlice.reducer;