import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import jobReducer from "./jobSlice";
import proposalReducer from "./proposalSlice";
import projectReducer from "./projectSlice";
import notificationReducer from "./notificationSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    proposals: proposalReducer,
    projects: projectReducer,
    notifications: notificationReducer,
  },
});

export default store;
