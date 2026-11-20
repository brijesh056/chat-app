import { useState } from "react";
import { getErrorMessage } from "../api/axios";

export default function MessageInput({ onSend }) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    setSending(true);
    setError("");
    try {
      await onSend(trimmed);
      setText("");
    } catch (err) {
      setError(getErrorMessage(err)); // keep the text so the user can retry
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-slate-200 bg-white px-3 py-3">
      {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
      <div className="flex items-center gap-2">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message"
          maxLength={2000}
          autoFocus
          className="flex-1 rounded-full bg-slate-100 px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-100 focus:bg-white transition"
        />
        <button
          type="submit"
          disabled={!text.trim() || sending}
          className="rounded-full bg-brand-600 hover:bg-brand-700 disabled:opacity-40 disabled:hover:bg-brand-600 text-white font-semibold px-5 py-2.5 transition"
        >
          Send
        </button>
      </div>
    </form>
  );
}
