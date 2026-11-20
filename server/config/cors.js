const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:5173")
  .split(",")
  .map((url) => url.trim().replace(/\/$/, ""))
  .filter(Boolean);

const isDev = process.env.NODE_ENV !== "production";

const corsOptions = {
  origin: (origin, callback) => {
    // In development allow any origin; in production only the listed ones
    if (isDev || !origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true,
};

module.exports = { corsOptions, allowedOrigins };