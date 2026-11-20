import { useEffect, useRef } from "react";
import Avatar from "./Avatar";
import Spinner from "./Spinner";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { formatDay } from "../utils";

export default function ChatWindow({ me, selectedUser, messages, loading, error, online, onSend, onBack }) {
  const bottomRef = useRef(null);

  // Always scroll to the newest message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Nothing selected yet (desktop only)
  if (!selectedUser) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center bg-slate-50 p-8">
        <div className="h-16 w-16 rounded-full bg-brand-100 flex items-center justify-center mb-4">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="#0d6f5a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.4A8.4 8.4 0 1 1 21 11.5Z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-slate-800">Pick someone to chat with</h2>
        <p className="text-slate-500 mt-1 max-w-xs">Choose a person from the list and your messages will show up here.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
      {/* Header */}
      <header className="flex items-center gap-3 px-3 md:px-4 py-3 bg-white border-b border-slate-200">
        <button onClick={onBack} className="md:hidden p-2 -ml-1 rounded-lg hover:bg-slate-100 transition" aria-label="Back to chats">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
        </button>
        <Avatar name={selectedUser.name} online={online} size="sm" />
        <div className="min-w-0">
          <p className="font-semibold truncate">{selectedUser.name}</p>
          <p className={`text-xs ${online ? "text-green-600" : "text-slate-400"}`}>{online ? "Online" : "Offline"}</p>
        </div>
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto thin-scroll px-3 md:px-6 py-4 space-y-2">
        {loading && <div className="flex justify-center py-10"><Spinner /></div>}

        {!loading && error && <p className="text-center text-sm text-red-600 py-10">{error}</p>}

        {!loading && !error && messages.length === 0 && (
          <p className="text-center text-sm text-slate-500 py-10">
            No messages yet. Say hello to {selectedUser.name}.
          </p>
        )}

        {messages.map((m, i) => {
          const showDay = i === 0 || new Date(m.createdAt).toDateString() !== new Date(messages[i - 1].createdAt).toDateString();
          return (
            <div key={m._id} className="space-y-2">
              {showDay && (
                <div className="flex justify-center py-1">
                  <span className="text-xs bg-white text-slate-500 rounded-full px-3 py-1 shadow-sm">{formatDay(m.createdAt)}</span>
                </div>
              )}
              <MessageBubble message={m} isMine={m.sender === me._id} />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <MessageInput onSend={onSend} />
    </div>
  );
}
