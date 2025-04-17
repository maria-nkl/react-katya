// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import counterReducer from './features/counterSlice'; // пример
import authReducer from './features/authSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    counter: counterReducer
  }
});
