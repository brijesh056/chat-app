// Shared shell for the Login and Register pages
export default function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-full grid lg:grid-cols-2">
      {/* Left: brand panel (hidden on small screens) */}
      <div className="hidden lg:flex flex-col justify-between bg-brand-900 text-white p-12">
        <div className="flex items-center gap-3">
          <ChatIcon />
          <span className="text-xl font-bold">Chatterbox</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight max-w-md">
            Talk to anyone, the moment you think of it.
          </h2>
          <p className="mt-4 text-brand-100/80 max-w-md">
            Messages arrive instantly and stay saved, so every conversation is there when you come back.
          </p>
        </div>
        <p className="text-sm text-brand-100/60">Built with MongoDB, Express, React, Node and Socket.io</p>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-2 mb-8 lg:hidden text-brand-700">
            <ChatIcon dark />
            <span className="text-lg font-bold">Chatterbox</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
          <p className="mt-1 mb-6 text-slate-500">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

function ChatIcon({ dark }) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={dark ? "#0d6f5a" : "white"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.5 8.5 0 0 1-3.6-.8L3 21l1.9-5.4A8.4 8.4 0 1 1 21 11.5Z" />
    </svg>
  );
}
