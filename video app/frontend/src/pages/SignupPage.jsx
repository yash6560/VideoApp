import React, { useState } from 'react';
import { ShipWheelIcon } from 'lucide-react'; // Adjust the import based on your icon library
import { Link } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';

const SignupPage = () => {
  const [signupData, setSignupData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const queryClient = useQueryClient();

  // Handle signup form submission
  const { isPending, mutate:signupMutate, error } = useMutation({
    mutationFn: async () => {
      const res = await axiosInstance.post('/auth/signup', signupData);
      return res.data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['authUser'] }),
    
  });

  const handleSignup = (e) => {
    e.preventDefault();
    signupMutate();
  }


  return (
    <div className='min-h-screen flex justify-center items-center p-4 sm:p-6 md:p-8'>
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
      {/* left side */}
      <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
        {/* logo */}
        <div className='mb-4 flex items-center justify-start gap-2'>
          <ShipWheelIcon className='size-9 text-primary' />
          <span className='text-3xl font-bold font-mono bg-clip-text  text-transparent bg-gradient-to-t from-primary to-secondary -tracking-wider'>YashVideo's</span>
        </div>

        {/* ERROR MESSAGE IF ANY */}
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error.response.data.message}</span>
            </div>
          )}

        <div className='w-full'>
          <form onSubmit={handleSignup}>
            <div className='space-y-4'>
              <div>
                <h2 className='text-xl font-semibold'>Create an Account</h2>
                <p className='opacity-70 text-sm'>Join YashVideo's and start your language learning adventure</p>
              </div>
              <div className='space-y-3'>
                {/* fullname */}
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Full Name</span>
                  </label>
                  <input
                    type='text'
                    placeholder='Enter your full name'
                    className='input input-bordered w-full'
                    value={signupData.fullName}
                    onChange={(e) => setSignupData({...signupData, fullName: e.target.value})}
                    required/>
                </div>
                {/* email */}
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Email</span>
                  </label>
                  <input
                    type='email'
                    placeholder='Enter your email address'
                    className='input input-bordered w-full'
                    value={signupData.email}
                    onChange={(e) => setSignupData({...signupData, email: e.target.value})}
                    required/>
                </div>
                {/* password */}
                <div className='form-control w-full'>
                  <label className='label'>
                    <span className='label-text'>Password</span>
                  </label>
                  <input
                    type='password'
                    placeholder='Enter your password'
                    className='input input-bordered w-full'
                    value={signupData.password}
                    onChange={(e) => setSignupData({...signupData, password: e.target.value})}
                    required/>
                </div>
                {/* term condition checkbox */}
                <div className='form-control'>
                  <label className='label cursor-pointer justify-start gap-2'>
                    <input
                    type='checkbox' className='checkbox checkbox-sm' required/>
                    <span>
                    <span className='text-xs leading-tight'>I agree to the{" "}</span>
                    <span className='text-primary hover:underline'>terms of service</span> <span className='text-xs leading-tight'>and{" "}</span> <span className='text-primary hover:underline'>privacy policy</span>
                    </span>
                  </label>
                  
                </div>
              </div>
              <button className='btn btn-primary w-full' type='submit'>{isPending ? "Signing up..." : "Create Account"}</button>
              <div className='text-center mt-4'>
                <p className='text-sm'>
                  Already have an account? <Link to="/login" className='text-primary hover:underline'>Login</Link>
                </p>
              </div>
            </div>
            </form>
        </div>
      </div>
      {/* right side */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/Video call-bro.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect with language partners worldwide</h2>
              <p className="opacity-70">
                Practice conversations, make friends, and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignupPage