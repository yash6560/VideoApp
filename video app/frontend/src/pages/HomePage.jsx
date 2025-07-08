import React, { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { axiosInstance } from '../lib/axios';
import { Link } from 'react-router-dom';
import { CheckCircleIcon, MapPinIcon, UserPlusIcon, UsersIcon } from 'lucide-react';
import FriendsCard, { getLanguageFlag } from '../components/FriendsCard';
import NoFriendsFound from '../components/NoFriendsFound';

const HomePage = () => {
  const queryClient = useQueryClient();
  const [outgoingRequestsIds, setOutgoingRequestsIds] = useState(new Set());

  // Get user friends
  const { data: friendsData, isLoading: loadingFriends } = useQuery({
    queryKey: ['friends'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/friends');
      return res.data;
    }
  });

  const friends = Array.isArray(friendsData) ? friendsData : [];

  // Get recommended users
const { isLoading: loadingUsers, data: recommendedData } = useQuery({
  queryKey: ['recommendedUsers'],
  queryFn: async () => {
    const res = await axiosInstance.get('/users/');
    return res.data.data;
  }
});

const recommendedUsers = Array.isArray(recommendedData) ? recommendedData : [];


  // Get outgoing friend requests
  const { data: outgoingFriendReqs = [] } = useQuery({
    queryKey: ['outgoingFriendReqs'],
    queryFn: async () => {
      const res = await axiosInstance.get('/users/outgoing-friends-request');
      return res.data.outgoingReqs;
    }
  });

  // Mutation to send friend request
  const { mutate: sendrequestMutation, isPending } = useMutation({
    mutationFn: async (userId) => {
      const res = await axiosInstance.post(`/users/friends-request/${userId}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['outgoingFriendReqs'] });
    }
  });

  // Track outgoing request user IDs
  useEffect(() => {
    const outgoingIds = new Set();
    if (outgoingFriendReqs && outgoingFriendReqs.length > 0) {
      outgoingFriendReqs.forEach((req) => {
        outgoingIds.add(req.recipient._id);
      });
      setOutgoingRequestsIds(outgoingIds);
    }
  }, [outgoingFriendReqs]);


  // for capitalize the first letter of a string
  const capitialize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  return (
    <div className='p-4 sm:p-6 lg:p-8'>
      <div className='container mx-auto space-y-10'>
        <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
          <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Your Friends</h2>
          <Link to="/notifications" className="btn btn-outline btn-sm">
            <UsersIcon className="mr-2 size-4" />
            Friend Requests
          </Link>
        </div>

        {loadingFriends ? (
          <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg' />
          </div>
        ) : friends.length === 0 ? (
          <NoFriendsFound/>
        ) : (
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'>
            {friends.map((friend) => (
              <FriendsCard key={friend._id} friend={friend} />
            ))}
          </div>
        )}

        {/* recommended friends */}
        <section>
          <div className='mb-6 sm:mb-8'>
            <div className='flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4'>
              <div>
                <h2 className='text-2xl sm:text-3xl font-bold tracking-tight'>Meet New Learners</h2>
                <p className='opacity-70'>Discover perfect exchange partner based on your profile</p>
              </div>
            </div>
          </div>

          { loadingUsers ? (
            <div className='flex justify-center py-12'>
            <span className='loading loading-spinner loading-lg' />
          </div>
          ) : recommendedUsers.length === 0 ? (
            <div className="card bg-base-200 p-6 text-center">
              <h3 className="font-semibold text-lg mb-2">No recommendations available</h3>
              <p className="text-base-content opacity-70">
                Check back later for new language partners!
              </p>
            </div>
          ) : (
            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'>
              {recommendedUsers.map((user) => {
                const hasRequestBeenSent = outgoingRequestsIds.has(user._id);

                return (
                  <div key={user._id} className='card bg-base-200 hover:shadow-lg transition-all duration-300'>
                    <div className='card-body p-5 space-y-4'>
                      <div className='flex gap-3 items-center'>
                        <div className='avatar size-12'>
                          <img src={user.profilePic} alt={user.fullName} />
                        </div>
                        <div>
                          <h3 className='font-semibold text-lg truncate'>{user.fullName}</h3>
                          {user.location && (
                            <div className='flex items-center text-xs opacity-70 mt-1'>
                              <MapPinIcon className='mr-1 size-3' />
                              {user.location}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className='flex flex-wrap gap-1.5'>
                        <span className=' badge badge-secondary'>
                          { getLanguageFlag(user.nativeLanguage)}
                          Native: {capitialize(user.nativeLanguage)}
                        </span>
                        <span className=' badge badge-outline'>
                          {getLanguageFlag(user.learningLanguage)}
                          Learning: {capitialize(user.learningLanguage)}
                        </span>
                      </div>

                      {user.bio && <p className='text-sm opacity-70'>{user.bio}</p>}

                      <button className={`btn w-full mt-2 ${ hasRequestBeenSent ? "btn-disabled" : "btn-primary"}`} onClick={() => sendrequestMutation(user._id)} disabled={hasRequestBeenSent || isPending}>
                        { hasRequestBeenSent ? (
                          <>
                            <CheckCircleIcon className='mr-2 size-4' /> 
                            Request Sent
                          </>
                        ) : (
                          <>
                            <UserPlusIcon className='mr-2 size-4' /> 
                            Send Friend Request
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
