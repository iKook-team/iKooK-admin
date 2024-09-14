import { createAction, createAsyncThunk } from '@reduxjs/toolkit';
import { useLazyForgotPasswordQuery, useLoginMutation } from '../../../app/api.ts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '../../../hooks';
import { toast } from 'react-toastify';
import { ConsolidatedAuthRequest, ConsolidatedAuthResponse } from '../data/dto.ts';
import { saveToken } from './slice.ts';
import { AuthType } from './types.ts';

export function useAuthAction(type: AuthType) {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [postRequest] = useLoginMutation();
  const [forgotPassword] = useLazyForgotPasswordQuery();

  return {
    performAuth: async (request: ConsolidatedAuthRequest) => {
      console.log('Request:', request);
      if (loading) {
        return;
      }

      try {
        setLoading(true);

        const promise =
          type === AuthType.forgotPassword ? forgotPassword(request.email) : postRequest(request);
        const response = (await promise.unwrap()) as ConsolidatedAuthResponse;

        if (type === AuthType.login) {
          dispatch(saveToken(response.access));
          navigate('/');
        } else {
          navigate('/login');
        }
        toast(`Welcome back ${response.first_name}`, {
          type: 'success'
        });
      } catch (e) {
        // @ts-expect-error e is an rtk query error
        toast(e.data.message, {
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    },
    loading
  };
}

export const resetStore = createAction('RESET_STORE');

export const logout = createAsyncThunk('auth/logout', async (_, { dispatch }) => {
  dispatch(resetStore());
  return null;
});
