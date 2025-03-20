import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// ✅ Async action to post a job
export const postJob = createAsyncThunk(
  "jobs/postJob",
  async (jobData, { getState, rejectWithValue }) => {
    try {
      const token = localStorage.getItem(token); // ✅ Get token from Redux
      console.log("🔹 Token sent to API:", token);

      if (!token) {
        console.error(" Token is missing. User must be logged in!");
        return rejectWithValue("User is not authenticated");
      }

      // ✅ Convert budget to Float
      const formattedJobData = {
        ...jobData,
        budget: parseFloat(jobData.budget),
      };

      const response = await axios.post(
        "http://localhost:5000/graphql",
        {
          query: `
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
          variables: formattedJobData,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // ✅ Include token in headers
            "Content-Type": "application/json",
          },
        }
      );

      // ✅ Validate response
      if (!response.data || !response.data.data) {
        throw new Error("Invalid response from the server");
      }
      alert("Job Posted");
      return response.data.data.postJob; // ✅ Return job data on success
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to post job");
    }
  }
);

// ✅ Job slice with loading, success, and error handling
const jobSlice = createSlice({
  name: "jobs",
  initialState: {
    jobs: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(postJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload); // ✅ Add new job to state
      })
      .addCase(postJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload; // ✅ Store error message
      });
  },
});

export default jobSlice.reducer;
