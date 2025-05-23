import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from 'redux';
import authReducer from './slices/authSlice';
import boardReducer from './slices/boardSlice';
import usersReducer from './slices/usersSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  board: boardReducer,
  users: usersReducer,
});

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;