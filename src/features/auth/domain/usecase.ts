import { useState } from 'react';
import { toast } from 'react-toastify';
import { ConsolidatedAuthRequest, ConsolidatedAuthResponse } from '../data/dto.ts';
import { AuthType } from './types.ts';
import { saveToken, saveUser } from './slice.ts';
import { useAppDispatch } from '../../../app/services/store/hooks.ts';
import fetch from '../../../app/services/api';
import { useMutation } from '@tanstack/react-query';

export function useAuthAction(type: AuthType) {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>();
  const [buttonText, setButtonText] = useState<string>('Login');

  const dispatch = useAppDispatch();

  const isTwoFactor = type === AuthType.login && userId;

  const mutation = useMutation({
    mutationFn: async (request: ConsolidatedAuthRequest) => {
      const response = await fetch({
        url: isTwoFactor ? 'admin/twofactor-confirmation' : 'admin/signin',
        method: 'POST',
        data: request
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

        if (isTwoFactor) {
          dispatch(saveToken(response.data.access));
          dispatch(saveUser(response.data));
          toast(`Welcome back ${response.data.first_name}`, {
            type: 'success'
          });
        } else if (type === AuthType.login) {
          setUserId(response.data.id);
          toast(`Enter the otp sent to your email`, {
            type: 'info'
          });
          setButtonText('Authenticate');
        }
      } catch (_) {
        setButtonText('Login');
        setUserId(undefined);
      } finally {
        setLoading(false);
      }
    },
    loading,
    userId,
    buttonText
  };
}
