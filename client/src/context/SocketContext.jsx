import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../api/config";
import { useAuth } from "./AuthContext";

const SocketContext = createContext({ socket: null, onlineUsers: [] });
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const { token, user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  // Connect when logged in, disconnect on logout
  useEffect(() => {
    if (!user || !token) return;

    const newSocket = io(SOCKET_URL, { auth: { token } });
    newSocket.on("onlineUsers", setOnlineUsers);
    setSocket(newSocket);

    return () => {
      newSocket.off("onlineUsers", setOnlineUsers);
      newSocket.disconnect();
      setSocket(null);
      setOnlineUsers([]);
    };
  }, [user?._id, token]);

  return (
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
}
