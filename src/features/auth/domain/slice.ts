import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { logout } from './usecase.ts';
import { AuthState } from './types.ts';

const initialState: AuthState = {
  token: ''
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.token = null;
    });
  },
  selectors: {
    isAuthenticated: (state: AuthState) => !!state.token
  }
});

export const { saveToken } = authSlice.actions;
export const { isAuthenticated } = authSlice.selectors;
