'use client';

import { useAuth } from '@clerk/nextjs';
import { useEffect } from 'react';
import { apiClient } from '@/lib/api';

interface ApiProviderProps {
  children: React.ReactNode;
}

export const ApiProvider = ({ children }: ApiProviderProps) => {
  const { getToken } = useAuth();

  useEffect(() => {
    // Set the token function for the API client
    apiClient.setTokenFunction(async () => {
      try {
        return await getToken();
      } catch (error) {
        console.warn('Failed to get token:', error);
        return null;
      }
    });
  }, [getToken]);

  return <>{children}</>;
};