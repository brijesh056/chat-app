require("dotenv").config();
const http = require("http");
const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");
const { corsOptions } = require("./config/cors");
const { initSocket } = require("./socket/socket");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");

if (!process.env.JWT_SECRET || !process.env.MONGO_URI) {
  console.error("Missing JWT_SECRET or MONGO_URI in .env");
  process.exit(1);
}

const app = express();
const server = http.createServer(app);

app.use(cors(corsOptions));
app.use(express.json());

app.get("/", (req, res) => res.send("Chat API is running"));
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

// Unknown route
app.use((req, res) => res.status(404).json({ message: "Route not found" }));

// Global error handler (e.g. CORS errors)
app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message || "Server error" });
});

initSocket(server);

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});
