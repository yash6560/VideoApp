import React from 'react'
import { useQuery } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';

const useAuthUser = () => {
  const authUser= useQuery({queryKey: ["authUser"],
      queryFn: async () => {
        try {
          const response = await axiosInstance.get('/auth/me');
          return response.data;
        } catch (error) {
          return null;
        }
        
      },
      retry: false,
    })

    return { isLoading: authUser.isLoading, authUser: authUser.data?.user }
}

export default useAuthUser