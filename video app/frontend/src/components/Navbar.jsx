import React from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { Link, useLocation } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BellIcon, LogOutIcon } from 'lucide-react';
import TheamSector from './TheamSector';
import { axiosInstance } from '../lib/axios';

const Navbar = () => {
  const { authUser } = useAuthUser();

  const location = useLocation();
  const currentPath = location.pathname;

  const isChatPage = location.pathname.startsWith('/chat');

//   for logout

const queryClient = useQueryClient();

const { mutate: logoutMutation } = useMutation({
    mutationFn : async () =>  {
        const res = await axiosInstance.post('auth/logout');
        return res.data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['authUser']});
    }
})


  return (
    <nav className='bg-base-200 border-b border-base-300 sticky top-0 z-30 h-16 flex items-center'>
        <div className='container mx-auto px-4 sm:px-6 lg:px-8'>
            <div className='flex items-center justify-end w-full'>
                { isChatPage && (
                    <div className='pl-5'>
                        <Link to="/" className="flex items-center gap-2.5">
                            <ShipWheelIcon className="size-9 text-primary" />
                            <span className="text-2xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider">YashVideo's</span>
                        </Link>
                    </div>
                )}
                <div className='flex items-center gap-3 sm:gap-4'>
                    <Link to='/notifications'>
                        <button className='btn btn-ghost btn-circle'>
                            <BellIcon className='h-6 w-6 text-base-content opacity-70'/>
                        </button>
                    </Link>
                </div>

                <TheamSector/>

                <div className="avatar">
                    <div className="w-9 rounded-full">
                    <img src={authUser?.profilePic} alt="Avtar Profile" rel='noreferrer' />
                    </div>
                </div>

                <button className='btn btn-ghost btn-circle' onClick={logoutMutation}>
                            <LogOutIcon className='h-6 w-6 text-base-content opacity-70'/>
                        </button>
            </div>
        </div>
    </nav>
  )
}

export default Navbar