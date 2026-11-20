import { useCallback, useEffect, useState } from "react";
import api, { getErrorMessage } from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";
import Sidebar from "../components/Sidebar";
import ChatWindow from "../components/ChatWindow";

export default function Chat() {
  const { user, logout } = useAuth();
  const { socket, onlineUsers } = useSocket();

  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [usersError, setUsersError] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [messagesError, setMessagesError] = useState("");

  const [unread, setUnread] = useState({}); // { userId: count }

  // ---- Load users (with last message) ----
  const loadUsers = useCallback(async () => {
    try {
      const { data } = await api.get("/users");
      setUsers(data);
      setUsersError("");
    } catch (err) {
      setUsersError(getErrorMessage(err));
    } finally {
      setUsersLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Someone new registered while we were open? Reload the list.
  useEffect(() => {
    const known = new Set(users.map((u) => u._id));
    const hasUnknown = onlineUsers.some((id) => id !== user._id && !known.has(id));
    if (hasUnknown && !usersLoading) loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onlineUsers]);

  // ---- Load history when a conversation is opened ----
  useEffect(() => {
    if (!selectedUser) return;
    let cancelled = false;

    const loadMessages = async () => {
      setMessagesLoading(true);
      setMessagesError("");
      setMessages([]);
      try {
        const { data } = await api.get(`/messages/${selectedUser._id}`);
        if (!cancelled) setMessages(data);
      } catch (err) {
        if (!cancelled) setMessagesError(getErrorMessage(err));
      } finally {
        if (!cancelled) setMessagesLoading(false);
      }
    };
    loadMessages();

    return () => {
      cancelled = true; // ignore results of an older request
    };
  }, [selectedUser?._id]);

  // Update the sidebar preview of one conversation and move it to the top
  const updateLastMessage = (otherUserId, message, fromMe) => {
    setUsers((prev) => {
      const target = prev.find((u) => u._id === otherUserId);
      if (!target) return prev;
      const updated = {
        ...target,
        lastMessage: { text: message.text, createdAt: message.createdAt, fromMe },
      };
      return [updated, ...prev.filter((u) => u._id !== otherUserId)];
    });
  };

  // ---- Real-time: a message arrives ----
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      const senderId = message.sender;
      updateLastMessage(senderId, message, false);

      if (selectedUser && senderId === selectedUser._id) {
        // Conversation is open: show it (skip if we already have it)
        setMessages((prev) => (prev.some((m) => m._id === message._id) ? prev : [...prev, message]));
      } else {
        setUnread((prev) => ({ ...prev, [senderId]: (prev[senderId] || 0) + 1 }));
      }
    };

    socket.on("newMessage", handleNewMessage);
    return () => socket.off("newMessage", handleNewMessage);
  }, [socket, selectedUser?._id]);

  // ---- Actions ----
  const handleSelectUser = (u) => {
    setSelectedUser(u);
    setUnread((prev) => ({ ...prev, [u._id]: 0 }));
  };

  const handleSend = async (text) => {
    const { data } = await api.post(`/messages/${selectedUser._id}`, { text });
    setMessages((prev) => (prev.some((m) => m._id === data._id) ? prev : [...prev, data]));
    updateLastMessage(selectedUser._id, data, true);
  };

  return (
    <div className="h-full flex bg-white md:p-4 md:bg-slate-100">
      <div className="flex w-full max-w-7xl mx-auto bg-white md:rounded-2xl md:shadow-lg overflow-hidden border border-slate-200">
        {/* Sidebar: always visible on desktop, only when no chat is open on mobile */}
        <div className={`${selectedUser ? "hidden md:flex" : "flex"} w-full md:w-[340px] shrink-0 border-r border-slate-200`}>
          <Sidebar
            me={user}
            users={users}
            loading={usersLoading}
            error={usersError}
            onRetry={loadUsers}
            selectedId={selectedUser?._id}
            onlineUsers={onlineUsers}
            unread={unread}
            onSelect={handleSelectUser}
            onLogout={logout}
          />
        </div>

        <div className={`${selectedUser ? "flex" : "hidden md:flex"} flex-1 min-w-0`}>
          <ChatWindow
            me={user}
            selectedUser={selectedUser}
            messages={messages}
            loading={messagesLoading}
            error={messagesError}
            online={selectedUser ? onlineUsers.includes(selectedUser._id) : false}
            onSend={handleSend}
            onBack={() => setSelectedUser(null)}
          />
        </div>
      </div>
    </div>
  );
}
