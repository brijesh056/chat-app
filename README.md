# Chatterbox: Real-Time Chat App (MERN + Socket.io)

React + Tailwind frontend, Express + MongoDB backend, Socket.io for live messages, JWT + bcrypt for auth.

```
chat-app/
├── server/                  # Backend
│   ├── config/              # db.js (MongoDB), cors.js (allowed origins)
│   ├── controllers/         # auth, users, messages logic
│   ├── middleware/auth.js   # JWT protect middleware
│   ├── models/              # User.js, Message.js
│   ├── routes/              # auth, users, messages routes
│   ├── socket/socket.js     # Socket.io server (JWT-checked, online users)
│   ├── server.js
│   └── .env.example
└── client/                  # Frontend (Vite)
    └── src/
        ├── api/             # axios instance + dynamic URLs
        ├── context/         # AuthContext, SocketContext
        ├── components/      # Sidebar, ChatWindow, MessageBubble, ...
        └── pages/           # Login, Register, Chat
```

## 1. Prerequisites
Node.js 18+ and either MongoDB installed locally or a free MongoDB Atlas cluster.

## 2. Run the backend
```bash
cd server
npm install
cp .env.example .env        # Windows: copy .env.example .env
# edit .env: set MONGO_URI and a long random JWT_SECRET
npm run dev                 # http://localhost:5000
```

## 3. Run the frontend (new terminal)
```bash
cd client
npm install
cp .env.example .env        # leave values empty for local development
npm run dev                 # http://localhost:5173
```

## 4. Test real-time messaging with two accounts
1. Open http://localhost:5173 in a normal window and register **Alice**.
2. Open an **incognito window** (separate localStorage) and register **Bob**.
3. In Alice's window click Bob, send "Hi Bob". It appears instantly in Bob's window with an unread badge.
4. Click Alice in Bob's window and reply. Alice sees it immediately.
5. Refresh both windows: history is loaded from MongoDB. Close Bob's window: Alice sees Bob go offline.

## 5. API reference
| Method | Route | Auth | Purpose |
|---|---|---|---|
| POST | /api/auth/register | no | Create account, returns user + JWT |
| POST | /api/auth/login | no | Log in, returns user + JWT |
| GET | /api/auth/me | yes | Restore session |
| GET | /api/users | yes | Other users + last message |
| GET | /api/messages/:userId | yes | Conversation history |
| POST | /api/messages/:userId | yes | Save message and push it via Socket.io |

Socket events: client connects with `auth: { token }`. Server emits `onlineUsers` (array of user ids) and `newMessage` (message object).

## 6. Deployment

### MongoDB Atlas
1. Create a free M0 cluster at mongodb.com/atlas.
2. Database Access: add a user with a password.
3. Network Access: add `0.0.0.0/0` (Render IPs change).
4. Connect > Drivers: copy the URI and replace `<password>`. Add a database name:
   `mongodb+srv://USER:PASS@cluster0.xxxxx.mongodb.net/chat-app?retryWrites=true&w=majority`

### Backend on Render
1. Push the project to GitHub.
2. Render > New > Web Service > pick the repo. Root Directory: `server`. Build: `npm install`. Start: `npm start`.
3. Environment variables: `MONGO_URI` (Atlas URI), `JWT_SECRET` (long random string), `CLIENT_URL` (your Vercel URL, no trailing slash; add the second URL after the first deploy, comma separated if you have several).
4. Deploy and note the URL, e.g. `https://chat-api.onrender.com`. Opening it should show "Chat API is running".
Note: free Render services sleep after inactivity, so the first request can take about 30-60 seconds.

### Frontend on Vercel
1. Vercel > Add New Project > pick the repo. Root Directory: `client`. Framework: Vite.
2. Environment variables: `VITE_API_URL` and `VITE_SOCKET_URL`, both set to the Render URL (no trailing slash).
3. Deploy, then copy the Vercel URL into `CLIENT_URL` on Render and redeploy the backend.

### Common problems
- **CORS error**: `CLIENT_URL` on Render must exactly match your frontend origin (https, no trailing slash).
- **Login works but no live messages**: check `VITE_SOCKET_URL` points to the backend and the backend was redeployed after changing `CLIENT_URL`.
- **Env var changes on Vercel do nothing**: Vite bakes them in at build time, so redeploy the frontend.
