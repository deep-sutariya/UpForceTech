import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
  name: 'user',
  initialState: { name: '', email: '', mobile:'', role: '', isLoggedIn: false },
  reducers: {
    loginUser: (state, action) => {
      const { name, email, mobile, role } = action.payload;
      Object.assign(state, { name, email, mobile, role, isLoggedIn: true });
    },
    logoutUser: (state) => {
      Object.assign(state, { name: '', email: '', mobile:'', role: '', isLoggedIn: false });
    },
  },
});

export const { loginUser, logoutUser } = userSlice.actions;
export default userSlice.reducer;
