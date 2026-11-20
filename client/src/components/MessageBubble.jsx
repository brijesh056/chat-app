import { formatTime } from "../utils";

export default function MessageBubble({ message, isMine }) {
  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[80%] md:max-w-[65%] px-3.5 py-2 shadow-sm
          ${isMine
            ? "bg-brand-600 text-white rounded-2xl rounded-br-md"
            : "bg-white text-slate-800 rounded-2xl rounded-bl-md"}`}
      >
        <p className="whitespace-pre-wrap break-words">{message.text}</p>
        <p className={`text-[11px] mt-1 text-right ${isMine ? "text-brand-100/80" : "text-slate-400"}`}>
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  );
}
