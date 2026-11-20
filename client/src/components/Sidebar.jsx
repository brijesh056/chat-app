import { useMemo, useState } from "react";
import Avatar from "./Avatar";
import Spinner from "./Spinner";
import { formatListTime } from "../utils";

export default function Sidebar({ me, users, loading, error, onRetry, selectedId, onlineUsers, unread, onSelect, onLogout }) {
  const [search, setSearch] = useState("");

  const filtered = useMemo(
    () => users.filter((u) => u.name.toLowerCase().includes(search.trim().toLowerCase())),
    [users, search]
  );

  return (
    <aside className="flex flex-col w-full bg-white">
      {/* Header: current user + logout */}
      <div className="flex items-center justify-between px-4 py-3 bg-brand-900 text-white">
        <div className="flex items-center gap-3 min-w-0">
          <Avatar name={me.name} size="sm" />
          <div className="min-w-0">
            <p className="font-semibold truncate">{me.name}</p>
            <p className="text-xs text-brand-100/70 truncate">{me.email}</p>
          </div>
        </div>
        <button onClick={onLogout} title="Log out"
          className="p-2 rounded-lg hover:bg-white/10 transition text-sm font-medium">
          Log out
        </button>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-slate-100">
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search people by name"
          className="w-full rounded-lg bg-slate-100 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-brand-100 focus:bg-white transition"
        />
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto thin-scroll">
        {loading && (
          <div className="flex justify-center py-10"><Spinner /></div>
        )}

        {!loading && error && (
          <div className="p-6 text-center text-sm">
            <p className="text-red-600 mb-3">{error}</p>
            <button onClick={onRetry} className="text-brand-700 font-semibold hover:underline">Try again</button>
          </div>
        )}

        {!loading && !error && users.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500">
            No one else has joined yet. Register a second account in another browser to start chatting.
          </p>
        )}

        {!loading && !error && users.length > 0 && filtered.length === 0 && (
          <p className="p-6 text-center text-sm text-slate-500">No one matches "{search}".</p>
        )}

        {filtered.map((u) => {
          const online = onlineUsers.includes(u._id);
          const count = unread[u._id] || 0;
          const active = selectedId === u._id;

          return (
            <button key={u._id} onClick={() => onSelect(u)}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-slate-50
                ${active ? "bg-brand-50" : "hover:bg-slate-50"}`}>
              <Avatar name={u.name} online={online} />
              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="font-semibold truncate">{u.name}</p>
                  {u.lastMessage && (
                    <span className={`text-xs shrink-0 ${count ? "text-brand-600 font-semibold" : "text-slate-400"}`}>
                      {formatListTime(u.lastMessage.createdAt)}
                    </span>
                  )}
                </div>
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-slate-500 truncate">
                    {u.lastMessage
                      ? `${u.lastMessage.fromMe ? "You: " : ""}${u.lastMessage.text}`
                      : online ? "Online" : "Say hello"}
                  </p>
                  {count > 0 && (
                    <span className="shrink-0 min-w-5 h-5 px-1.5 rounded-full bg-brand-600 text-white text-xs font-semibold flex items-center justify-center">
                      {count}
                    </span>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
