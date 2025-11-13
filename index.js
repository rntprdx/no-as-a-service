// const express = require('express');
// const rateLimit = require('express-rate-limit');
// const fs = require('fs');

// const app = express();
// app.set('trust proxy', true);
// const PORT = process.env.PORT || 3000;

// // Load reasons from JSON
// const reasons = JSON.parse(fs.readFileSync('./reasons.json', 'utf-8'));

// // Rate limiter: 120 requests per minute per IP
// const limiter = rateLimit({
//   windowMs: 60 * 1000, // 1 minute
//   max: 120,
//   keyGenerator: (req, res) => {
//     return req.headers['cf-connecting-ip'] || req.ip; // Fallback if header missing (or for non-CF)
//   },
//   message: { error: "Too many requests, please try again later. (120 reqs/min/IP)" }
// });

// app.use(limiter);

// // Random rejection reason endpoint
// app.get('/no', (req, res) => {
//   const reason = reasons[Math.floor(Math.random() * reasons.length)];
//   res.json({ reason });
// });

// // Start server
// app.listen(PORT, '0.0.0.0',() => {
//   console.log(`No-as-a-Service is running on port http://0.0.0.0:${PORT}/no`);
// });

const express = require("express");
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const path = require("path");
const reasons = require("./reasons.json");

const app = express();

// Enable CORS for external access
app.use(cors());

// Serve static files (our HTML)
app.use(express.static(path.join(__dirname, "public")));

// Rate limiting
const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120,
  message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

// API Route
app.get("/no", (req, res) => {
  const randomReason = reasons[Math.floor(Math.random() * reasons.length)];
  res.json({ reason: randomReason });
});

// Port setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("🚀 No-as-a-Service is running!");
  console.log(`📡 Local:   http://localhost:${PORT}`);
  console.log(`🌐 Network: http://${getLocalIP()}:${PORT}`);
  console.log("");
});

function getLocalIP() {
  const os = require("os");
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "0.0.0.0";
}
