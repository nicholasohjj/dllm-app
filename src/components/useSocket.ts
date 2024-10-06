import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

export function useSocket(url: string) {
  const [socket, setSocket] = useState<Socket | null>(null)
  const [isConnected, setIsConnected] = useState(false)

  useEffect(() => {
    const socketIo: Socket = io(url, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
    })

    socketIo.on('connect', () => setIsConnected(true))
    socketIo.on('disconnect', () => setIsConnected(false))

    setSocket(socketIo)

    return () => {
      if (socketIo) {
        socketIo.disconnect()
      }
    }
  }, [url])

  return { socket, isConnected }
}
