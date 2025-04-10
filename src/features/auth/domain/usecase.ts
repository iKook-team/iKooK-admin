import { useState } from 'react';
import { toast } from 'react-toastify';
import { ConsolidatedAuthRequest, ConsolidatedAuthResponse } from '../data/dto.ts';
import fetch from '../../../app/services/api';
import { useMutation } from '@tanstack/react-query';
import useAuthStore from './store.ts';

export function useAuthAction() {
  const [loading, setLoading] = useState(false);
  const [buttonText, setButtonText] = useState<string>('Login');

  const mutation = useMutation({
    mutationFn: async (request: ConsolidatedAuthRequest) => {
      const response = await fetch({
        url: 'users/auth/login/',
        method: 'POST',
        data: {
          ...request,
          user_type: 'Admin'
        }
      });
      return response.data as ConsolidatedAuthResponse;
    }
  });

  return {
    performAuth: async (request: ConsolidatedAuthRequest) => {
      if (loading) {
        return;
      }

      try {
        setLoading(true);

        const response = await mutation.mutateAsync(request);

        useAuthStore.getState().login({
          user: response.data,
          access: response.data.access_token,
          refresh: response.data.refresh_token
        });
        toast(`Welcome back ${response.data.first_name}`, {
          type: 'success'
        });
      } catch (_) {
        setButtonText('Login');
      } finally {
        setLoading(false);
      }
    },
    loading,
    buttonText
  };
}
