import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AuthState } from './types.ts';
import { CurrentUser } from '../data/model.ts';

const initialState: AuthState = {
  token: '',
  id: '',
  first_name: '',
  last_name: '',
  role: '',
  roles: []
};

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    saveToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
    },
    saveUser: (state, action: PayloadAction<CurrentUser>) => {
      state.id = action.payload.id;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.role = action.payload.role;
      state.roles = action.payload.roles;
    }
  },
  selectors: {
    isAuthenticated: (state: AuthState) => !!state.token,
    getCurrentUser: (state: AuthState): CurrentUser => state,
    getToken: (state: AuthState) => state.token
  }
});

export const { saveToken, saveUser } = authSlice.actions;
export const { isAuthenticated, getCurrentUser, getToken } = authSlice.selectors;
