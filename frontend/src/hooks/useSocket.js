import { useEffect, useMemo } from 'react';
import { io } from 'socket.io-client';

export const useSocket = (user) => {
  const socket = useMemo(() => {
    if (!user?._id) return null;
    return io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      transports: ['websocket'],
    });
  }, [user?._id]);

  useEffect(() => {
    if (!socket || !user?._id) return undefined;
    socket.emit('register-user', user._id);
    return () => socket.disconnect();
  }, [socket, user?._id]);

  return socket;
};
