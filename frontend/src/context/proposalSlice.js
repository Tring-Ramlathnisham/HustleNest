import { createSlice } from "@reduxjs/toolkit";

const proposalSlice = createSlice({
  name: "proposal",
  initialState: [],
  reducers: {
    setProposals: (state, action) => action.payload,
  },
});

export const { setProposals } = proposalSlice.actions;
export default proposalSlice.reducer;
