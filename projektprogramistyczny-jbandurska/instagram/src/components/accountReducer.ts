import { createSlice } from '@reduxjs/toolkit';

const accountSlice = createSlice({
  name: 'account',
  initialState: {},
  reducers: {
    updateAccount (state, action) {
      return { ...state, ...action.payload }
    }
  }
})

export const { updateAccount } = accountSlice.actions;
export default accountSlice.reducer;
