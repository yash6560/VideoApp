import React, { useState } from 'react'
import useAuthUser from '../hooks/useAuthUser'
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import toast from 'react-hot-toast';
import { CameraIcon, Loader2Icon, MapPinIcon, ShipWheelIcon, ShuffleIcon } from 'lucide-react';
import { LANGUAGES } from '../constants';

const OnboardingPage = () => {
  const { authUser } = useAuthUser();

  const [formState, setFormState] = useState({
    fullName : authUser?.fullName || '',
    bio : authUser?.bio || '',
    nativeLanguage : authUser?.nativeLanguage || '',
    learningLanguage : authUser?.learningLanguage || '',
    location : authUser?.location || '',
    profilePic : authUser?.profilePic || '',
  });

  const queryClient = useQueryClient();

  const { mutate:onboardingMutation, isPending } = useMutation({
    mutationFn : async () => {
      const res = await axiosInstance.post('/auth/onboarding', formState);
      return res.data;
    },
    onSuccess: () => {
      toast.success("data updated successfully");
      queryClient.invalidateQueries({ queryKey : ["authUser"] });
    },
    onError: (err) => {
      console.error(err);
      toast.error(err.response.data.message);
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault();
    onboardingMutation();
  }

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1;
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;

    setFormState({...formState, profilePic: randomAvatar});
    toast.success("Random avatar generated successfully");
  }

  return (
    <div className='min-h-screen bg-base-100 flex items-center justify-center p-4'>
      <div className=' card bg-base-200 w-full max-w-3xl shadow-xl'>
        <div className=' card-body p-6 sm:p-8'>
            <h1 className='text-2xl sm:text-3xl font-bold text-center mb-6'>Complate Your Profile</h1>
            <form onSubmit={handleSubmit} className='space-y-6'>
              {/* profile pic */}
              <div className=' flex flex-col items-center justify-center space-y-4'>
                {/* profile pic */}
                <div className='size-32 rounded-full bg-base-300 overflow-hidden'>
                  {
                  formState.profilePic ? 
                  (<img src={formState.profilePic} alt='Profile preview' className='w-full h-full object-cover'/>) : 
                  (<div className='flex items-center justify-center h-full'>
                    <CameraIcon className='size-12 text-base-content opacity-40' />
                  </div>)
                  }
                </div>
                {/* CTA */}
                <div className='flex items-center gap-2'>
                  <button className='btn btn-accent' type='button' onClick={handleRandomAvatar}><ShuffleIcon className='mr-2 size-4'/>Generate New Avatar</button>
                </div>
                
              </div>
              {/* full name */}
                <div className=' form-control'>
                  <label className='label'>
                    <span className='label-text'>Full Name</span>
                  </label>
                  <input
                    type='text'
                    placeholder='Enter your full name'
                    className='input input-bordered w-full'
                    value={formState.fullName}
                    onChange={(e) => setFormState({ ...formState, fullName: e.target.value })}
                    name='fullName'
                  />
                </div>
                {/* Bio */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Bio</span>
                  </label>
                  <textarea
                    placeholder='Enter your Bio'
                    className='textarea textarea-bordered h-24'
                    value={formState.bio}
                    onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                    name='bio'
                  />
                </div>
                {/* Languages */}
                <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Native Language</span>
                  </label>
                  <select
                    className='select select-bordered w-full'
                    value={formState.nativeLanguage}
                    onChange={(e) => setFormState({ ...formState, nativeLanguage: e.target.value })}
                    name='nativeLanguage'>
                      <option value=''>Select Your Native Language</option>
                      {
                        LANGUAGES.map((lang) => (
                          <option key={`native-${lang}`} value={lang.toLowerCase()}> {lang} </option>
                        ))
                      }
                    </select>
                </div>
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Learning Language</span>
                  </label>
                  <select
                    className='select select-bordered w-full'
                    value={formState.learningLanguage}
                    onChange={(e) => setFormState({ ...formState, learningLanguage: e.target.value })}
                    name='learningLanguage'>
                      <option value=''>Select Your Learning Language</option>
                      {
                        LANGUAGES.map((lang) => (
                          <option key={`native-${lang}`} value={lang.toLowerCase()}> {lang} </option>
                        ))
                      }
                    </select>
                </div>
                </div>
                {/* Location */}
                <div className='form-control'>
                  <label className='label'>
                    <span className='label-text'>Location</span>
                  </label>
                  <div className='relative'>
                    <MapPinIcon className='absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-base-content opacity-70' />
                    <input
                      type='text'
                      placeholder='City, Country'
                      className='input input-bordered pl-10 w-full'
                      value={formState.location}
                      onChange={(e) => setFormState({ ...formState, location: e.target.value })}
                      name='location'/>
                  </div>
                </div>

                {/* Submit button */}
                <button className='btn btn-primary w-full' disabled={isPending} type='submit'>
                  {!isPending ? (
                    <>
                      <ShipWheelIcon className='mr-2 size-5' />
                      Complete Onboarding
                    </>
                  ) : (
                  <>
                  <Loader2Icon className='mr-2 size-5 animate-spin' /> Onboarding...
                  </>
                  ) }
                </button>
            </form>
          </div></div>
    </div>
  )
}

export default OnboardingPage