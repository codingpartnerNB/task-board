import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  users: {},
  onlineUsers: [],
  loading: false,
  error: null
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    fetchUsersStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchUsersSuccess: (state, action) => {
      state.users = action.payload;
      state.loading = false;
    },
    fetchUsersFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    userOnline: (state, action) => {
      const user = action.payload;
      state.users[user.id] = user;
      if (!state.onlineUsers.includes(user.id)) {
        state.onlineUsers.push(user.id);
      }
    },
    userOffline: (state, action) => {
      const userId = action.payload;
      state.onlineUsers = state.onlineUsers.filter(id => id !== userId);
    }
  }
});

export const {
  fetchUsersStart,
  fetchUsersSuccess,
  fetchUsersFailure,
  userOnline,
  userOffline
} = usersSlice.actions;

export default usersSlice.reducer;