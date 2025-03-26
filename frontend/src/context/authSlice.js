import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  role: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action) => {
       const {user,token,role}=action.payload;
      state.user = user;
      state.token = token;
      state.role = role;

      localStorage.setItem("user",JSON.stringify(user));
      localStorage.setItem("token",token);
      localStorage.setItem("role",role);

    console.log(state);
      
    },
    register: (state, action) => {
      const {user,token,role}=action.payload;
      state.user = user;
      state.token = token;
      state.role = role;

      localStorage.setItem("user",JSON.stringify(user));
      localStorage.setItem("token",token);
      localStorage.setItem("role",role);

      console.log("Register state:",state);
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.role = null;

      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("role");
    },
  },
});

export const { login, register, logout } = authSlice.actions;
export default authSlice.reducer;
