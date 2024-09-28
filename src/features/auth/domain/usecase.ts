import {
  useLazyForgotPasswordQuery,
  useLoginMutation,
  useTwofactorConfirmationMutation
} from '../../../app/api.ts';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ConsolidatedAuthRequest, ConsolidatedAuthResponse } from '../data/dto.ts';
import { AuthType } from './types.ts';
import { useAppDispatch } from '../../../hooks';
import { saveToken, saveUser } from './slice.ts';

export function useAuthAction(type: AuthType) {
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string>();

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const [postRequest] = useLoginMutation();
  const [forgotPassword] = useLazyForgotPasswordQuery();
  const [twoFactorAuth] = useTwofactorConfirmationMutation();

  const isTwoFactor = type === AuthType.login && userId;

  return {
    performAuth: async (request: ConsolidatedAuthRequest) => {
      if (loading) {
        return;
      }

      try {
        setLoading(true);

        const promise =
          type === AuthType.forgotPassword
            ? forgotPassword(request.email)
            : isTwoFactor
              ? twoFactorAuth(request)
              : postRequest(request);

        const response = (await promise.unwrap()) as ConsolidatedAuthResponse;

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
        } else {
          navigate('/login');
        }
      } catch (e) {
        // @ts-expect-error e is an rtk query error
        toast(e.data.message, {
          type: 'error'
        });
      } finally {
        setLoading(false);
      }
    },
    loading,
    userId
  };
}
