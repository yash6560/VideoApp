import React from 'react'
import { useParams } from 'react-router-dom';
import { useQueryClient, useQuery } from '@tanstack/react-query'
import { useState } from 'react';
import useAuthUser from '../hooks/useAuthUser';
import { useEffect } from 'react';
import { StreamChat } from 'stream-chat';
import {axiosInstance} from '../lib/axios';
import ChatLoader from '../components/ChatLoader';
import CallButton from '../components/CallButton';

import { Chat, Channel, ChannelHeader, MessageInput, MessageList, Thread, Window } from 'stream-chat-react';



const ChatPage = () => {

  const { id:targetUserId } = useParams();

  const [chatClient, setChatClient] = useState(null);
  const [channel, setChannel] = useState(null);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuthUser();

  const { data:tokenData } = useQuery({
    queryKey: ['streamToken'],
    queryFn: async () => {
      try {
        const response = await axiosInstance.get('/chat/token');
        return response.data;
      } catch (error) {
        console.error('Error fetching Stream token:', error);
        throw error;
      }
    },
    enabled: !!authUser, // Only run this query if authUser is available
    // retry: false,
  });

  useEffect(() => {
    const initChat = async () => {
      if(!tokenData?.token || !authUser) {
        return;
      }

      try {
        console.log('Initializing chat client with token:', tokenData.token);

        const client = StreamChat.getInstance(import.meta.env.VITE_STREAM_API_KEY);
        await client.connectUser(
          {
            id: authUser._id,
            name: authUser.fullName,
            image: authUser.profilePic,
          },
          tokenData.token,
        );

        // create channel 
        const channelId = [authUser._id, targetUserId].sort().join('-');
        
        // Create a channel using your own id for that channel.
        const channel = client.channel("messaging", channelId, {
          members: [authUser._id, targetUserId],
        });

        // fetch the channel state, subscribe to future updates
        await channel.watch();

        setChatClient(client);
        setChannel(channel);
        setLoading(false);

      } catch (error) {
        console.error('Error initializing chat client:', error);

      } finally {
        setLoading(false);

      }
    };

    initChat();
  }, [authUser, tokenData, targetUserId]);

  const handleVideoCall = () => {
    if(channel) {
      const callUrl = `${window.location.origin}/call/${channel.id}`;

      channel.sendMessage({
        text: `Video call link: ${callUrl}`,
        attachments: [
          {
            type: 'video_call',
            title: 'Join Video Call',
            url: callUrl,
          },
        ],
      });

      toast.success('Video call link sent in chat!');
    }
  }

  if(loading || !chatClient || !channel) return <ChatLoader/>
  
  return (
    <div className='h-[93vh]'>
      <Chat client={chatClient}>
      <Channel channel={channel}>
        <div className='relative w-full'>
          <CallButton  handleVideoCall={handleVideoCall}/>
          <Window>
            <ChannelHeader />
            <MessageList />
            <MessageInput focus />
          </Window>
        </div>
        <Thread />
      </Channel>
    </Chat>
    </div>
  )
}

export default ChatPage