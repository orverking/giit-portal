import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api, { withFallback } from '../../services/api';
import { giitContent } from '../../data/giitContent';
import { mockAdminData, mockStudentData, mockTutorData } from '../../data/mockPortal';

export const fetchPublicContent = createAsyncThunk('portal/fetchPublicContent', async () =>
  withFallback(() => api.get('/public/content'), giitContent)
);

export const fetchDashboard = createAsyncThunk('portal/fetchDashboard', async (role = 'student') => {
  const fallback = role === 'admin' ? mockAdminData : role === 'tutor' ? mockTutorData : mockStudentData;
  return withFallback(() => api.get('/courses/dashboard'), fallback);
});

const portalSlice = createSlice({
  name: 'portal',
  initialState: {
    publicContent: giitContent,
    dashboard: null,
    loading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPublicContent.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPublicContent.fulfilled, (state, action) => {
        state.loading = false;
        state.publicContent = action.payload;
      })
      .addCase(fetchDashboard.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboard.fulfilled, (state, action) => {
        state.loading = false;
        state.dashboard = action.payload;
      });
  },
});

export default portalSlice.reducer;
