import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { useLogout } from './usecase.ts';
import { AuthState } from './types.ts';
import { User } from '../data/model.ts';

const initialState: User & {
  token: string | null;
} = {
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
    saveUser: (state, action: PayloadAction<User>) => {
      state.id = action.payload.id;
      state.first_name = action.payload.first_name;
      state.last_name = action.payload.last_name;
      state.role = action.payload.role;
      state.roles = action.payload.roles;
    }
  },
  extraReducers: (builder) => {
    builder.addCase(useLogout.fulfilled, (state) => {
      state.token = null;
    });
  },
  selectors: {
    isAuthenticated: (state: AuthState) => !!state.token,
    getUser: (state: AuthState) => state
  }
});

export const { saveToken, saveUser } = authSlice.actions;
export const { isAuthenticated, getUser } = authSlice.selectors;
