import { useEffect, useState, useRef } from 'react';

interface UseSocketReturn {
  socket: WebSocket | null;
  isConnected: boolean;
  error: string | null;
}

export function useSocket(url: string, timeoutDuration = 300000): UseSocketReturn { // timeoutDuration default set to 5 minutes (300000ms)
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Reference to store the timeout

  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current); // Clear any existing timeout
    }
    // Set a new timeout to disconnect after the specified duration of inactivity
    timeoutRef.current = setTimeout(() => {
      if (socketRef.current) {
        console.log('Disconnecting due to inactivity');
        socketRef.current.close(); // Disconnect the WebSocket
        setIsConnected(false);
      }
    }, timeoutDuration);
  };


  useEffect(() => {
    // Create the WebSocket instance
    const ws = new WebSocket(url);

    // Handle connection open event
    ws.onopen = () => {
      setIsConnected(true);
      setError(null);  // Reset error when connected
      console.log('Connected to WebSocket');

      // Optionally send a message after connection
      ws.send(JSON.stringify({ action: 'get_initial_state' })); // Trigger to get the initial state
    };

    // Handle incoming messages
    ws.onmessage = (event) => {
      const data = event.data;
      console.log('Received:', data); // Handle the incoming message
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
        socketRef.current.close(); // Gracefully close WebSocket connection
        setIsConnected(false);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current); // Clear the timeout on unmount
      }
      setIsConnected(false);
    };
  }, [url]);

  return { socket, isConnected, error };
}
