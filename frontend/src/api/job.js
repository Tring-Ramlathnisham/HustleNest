import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { gql } from "@apollo/client";
import client from "../../graphql/apolloClient"; // Apollo Client instance

export const postJob = createAsyncThunk(
  "jobs/postJob",
  async (jobData, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.token; // ✅ Get token from Redux store
      if (!token) {
        return rejectWithValue("User is not authenticated");
      }

      const response = await client.mutate({
        mutation: gql`
          mutation PostJob($title: String!, $description: String!, $budget: Float!, $domain: String!) {
            postJob(title: $title, description: $description, budget: $budget, domain: $domain) {
              id
              title
              description
              budget
              domain
            }
          }
        `,
        variables: jobData,
        context: {
          headers: { Authorization: `Bearer ${token}` }, // ✅ Send token in headers
        },
      });

      return response.data.postJob; // ✅ Return job data on success
    } catch (error) {
      return rejectWithValue(error.message || "Failed to post job");
    }
  }
);

// 🔹 Redux Slice
const jobSlice = createSlice({
  name: "jobs",
  initialState: { jobs: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload);
      })
      .addCase(postJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default jobSlice.reducer;
