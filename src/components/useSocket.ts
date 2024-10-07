import { useEffect, useState, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

interface UseSocketReturn {
  socket: Socket | null;
  isConnected: boolean;
  error: string | null;
}

export function useSocket(url: string): UseSocketReturn {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Create the socket instance
    const socketIo: Socket = io(url, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,  // Limit reconnection attempts
      reconnectionDelay: 1000,  // Delay before reconnecting
    });

    // Set up event listeners
    socketIo.on('connect', () => {
      setIsConnected(true);
      setError(null);  // Reset error when connected
    });

    socketIo.on('disconnect', () => {
      setIsConnected(false);
    });

    socketIo.on('connect_error', (err) => {
      setError(`Connection error: ${err.message}`);
    });

    socketIo.on('reconnect_failed', () => {
      setError('Reconnection failed after maximum attempts.');
    });

    // Store the socket reference
    setSocket(socketIo);
    socketRef.current = socketIo;

    // Clean up on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect');
        socketRef.current.off('disconnect');
        socketRef.current.off('connect_error');
        socketRef.current.disconnect();  // Disconnect the socket
      }
    };
  }, [url]);

  return { socket, isConnected, error };
}
