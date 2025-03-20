import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { fetchProjectsAPI, updateProjectStatusAPI } from "../api/project";

export const fetchProjects = createAsyncThunk("projects/fetchProjects", async () => {
  return await fetchProjectsAPI();
});

export const updateProjectStatus = createAsyncThunk("projects/updateProjectStatus", async ({ projectId, status }) => {
  return await updateProjectStatusAPI(projectId, status);
});

const projectSlice = createSlice({
  name: "projects",
  initialState: { projects: [] },
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProjects.fulfilled, (state, action) => {
      state.projects = action.payload;
    });
    builder.addCase(updateProjectStatus.fulfilled, (state, action) => {
      const updatedProject = action.payload;
      state.projects = state.projects.map((proj) => (proj.id === updatedProject.id ? updatedProject : proj));
    });
  },
});

export default projectSlice.reducer;
