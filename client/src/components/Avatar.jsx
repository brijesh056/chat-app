// Colored circle with the user's initial. Color is picked from the name.
const colors = ["bg-sky-500", "bg-violet-500", "bg-amber-500", "bg-rose-500", "bg-emerald-500", "bg-indigo-500", "bg-orange-500"];

export default function Avatar({ name = "?", online, size = "md" }) {
  const color = colors[name.charCodeAt(0) % colors.length];
  const dim = size === "sm" ? "h-9 w-9 text-sm" : "h-11 w-11 text-base";

  return (
    <div className="relative shrink-0">
      <div className={`${dim} ${color} rounded-full flex items-center justify-center font-semibold text-white`}>
        {name.charAt(0).toUpperCase()}
      </div>
      {online !== undefined && (
        <span
          className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${online ? "bg-green-500" : "bg-slate-300"}`}
          title={online ? "Online" : "Offline"}
        />
      )}
    </div>
  );
}
