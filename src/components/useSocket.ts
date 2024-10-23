import { useEffect, useState, useRef, useCallback } from 'react';

interface UseSocketReturn {
  socket: WebSocket | null;
  isConnected: boolean;
  error: string | null;
}

export function useSocket(url: string, socketTimeoutDuration = 300000, userInactivityDuration = 600000): UseSocketReturn {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const socketTimeoutRef = useRef<NodeJS.Timeout | null>(null); // For WebSocket inactivity timeout
  const userInactivityTimeoutRef = useRef<NodeJS.Timeout | null>(null); // For user inactivity timeout

  const resetSocketTimeout = useCallback(() => {
    if (socketTimeoutRef.current) {
      clearTimeout(socketTimeoutRef.current);
    }
    socketTimeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        console.log('Disconnecting WebSocket due to inactivity');
        socketRef.current.close(); // Disconnect WebSocket due to inactivity
        setIsConnected(false);
      }
    }, socketTimeoutDuration);
  }, [socketTimeoutDuration]);

  const resetUserInactivityTimeout = useCallback(() => {
    if (userInactivityTimeoutRef.current) {
      clearTimeout(userInactivityTimeoutRef.current);
    }
    userInactivityTimeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        console.log('Disconnecting WebSocket due to user inactivity');
        socketRef.current.close(); // Disconnect WebSocket due to user inactivity
        setIsConnected(false);
      }
    }, userInactivityDuration);
  }, [userInactivityDuration]);

  const resetAllTimeouts = useCallback(() => {
    resetSocketTimeout(); // Reset WebSocket timeout
    resetUserInactivityTimeout(); // Reset user inactivity timeout
  }, [resetSocketTimeout, resetUserInactivityTimeout]);


  useEffect(() => {
    // Create the WebSocket instance
    const ws = new WebSocket(url);

    // Handle connection open event
    ws.onopen = () => {
      setIsConnected(true);
      setError(null);
      console.log('Connected to WebSocket');
      ws.send(JSON.stringify({ action: 'get_initial_state' })); // Trigger to get the initial state
      resetAllTimeouts(); // Reset both timeouts on open
    };

    // Handle incoming messages
    ws.onmessage = (event) => {
      const data = event.data;
      console.log('Received:', data);
      resetSocketTimeout(); // Reset only the WebSocket timeout on message
    };

    // Handle connection close event
    ws.onclose = () => {
      setIsConnected(false);
      console.log('Disconnected from WebSocket');
    };

    // Handle errors
    ws.onerror = (err) => {
      setError('WebSocket error occurred');
      console.error('WebSocket error:', err);
    };

    // Store the WebSocket reference
    setSocket(ws);
    socketRef.current = ws;

    // Clean up the WebSocket on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.close(); // Close WebSocket
      }
      if (socketTimeoutRef.current) {
        clearTimeout(socketTimeoutRef.current); // Clear WebSocket timeout
      }
      if (userInactivityTimeoutRef.current) {
        clearTimeout(userInactivityTimeoutRef.current); // Clear user inactivity timeout
      }
    };
  }, [url, resetAllTimeouts, resetSocketTimeout]);

  useEffect(() => {
    const handleUserActivity = () => {
      resetAllTimeouts(); // Reset timeouts when the user interacts with the page
    };

    // Add event listeners for user activity (desktop and mobile)
    window.addEventListener('mousemove', handleUserActivity); // Mouse movement
    window.addEventListener('keydown', handleUserActivity); // Keyboard input
    window.addEventListener('touchstart', handleUserActivity); // Touch interaction (for mobile)
    window.addEventListener('touchend', handleUserActivity); // Touch interaction (for mobile)

    // Cleanup event listeners on unmount
    return () => {
      window.removeEventListener('mousemove', handleUserActivity);
      window.removeEventListener('keydown', handleUserActivity);
      window.removeEventListener('touchstart', handleUserActivity);
      window.removeEventListener('touchend', handleUserActivity);
    };
  }, [resetAllTimeouts]);


  return { socket, isConnected, error };
}
