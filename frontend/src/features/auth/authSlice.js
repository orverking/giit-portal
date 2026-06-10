import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../services/api';

const savedUser = localStorage.getItem('giit-user');

export const login = createAsyncThunk('auth/login', async (payload, thunkAPI) => {
  try {
    const response = await api.post('/auth/login', payload);
    return response.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const register = createAsyncThunk('auth/register', async (payload, thunkAPI) => {
  try {
    const response = await api.post('/auth/register', payload);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const fetchMe = createAsyncThunk('auth/fetchMe', async (_, thunkAPI) => {
  try {
    const response = await api.get('/auth/me');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

export const updateProfile = createAsyncThunk('auth/updateProfile', async (payload, thunkAPI) => {
  try {
    const response = await api.put('/auth/profile', payload);
    return response.data.user;
  } catch (error) {
    return thunkAPI.rejectWithValue(error);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: savedUser ? JSON.parse(savedUser) : null,
    loading: false,
    error: null,
    registrationMessage: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      localStorage.removeItem('giit-token');
      localStorage.removeItem('giit-user');
    },
    clearAuthError: (state) => {
      state.error = null;
      state.registrationMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('giit-token', action.payload.token);
        localStorage.setItem('giit-user', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Login failed';
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.registrationMessage = action.payload.message;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Registration failed';
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = { ...state.user, ...action.payload };
        localStorage.setItem('giit-user', JSON.stringify(state.user));
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        localStorage.setItem('giit-token', action.payload.token);
        localStorage.setItem('giit-user', JSON.stringify(action.payload));
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Profile update failed';
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
