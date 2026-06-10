import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import portalReducer from '../features/portal/portalSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    portal: portalReducer,
  },
});
