const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const socketIo = require("socket.io");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/rentd", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Socket.io for real-time chat
io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // Join room for specific conversation
  socket.on("join_conversation", (conversationId) => {
    socket.join(conversationId);
  });

  // Handle real-time messages
  socket.on("send_message", (data) => {
    socket.to(data.conversationId).emit("receive_message", data);
  });

  // Tech team notifications
  socket.on("join_tech_team", (teamId) => {
    socket.join(`tech_team_${teamId}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Make io accessible to routes
app.set("io", io);

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/properties", require("./routes/properties"));
app.use("/api/payments", require("./routes/payments"));
app.use("/api/messages", require("./routes/messages"));
app.use("/api/tech", require("./routes/techteam"));
app.use("/api/kanban", require("./routes/kanban"));

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Rent-D Backend API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      properties: "/api/properties",
      payments: "/api/payments",
      messages: "/api/messages",
      tech: "/api/tech",
      kanban: "/api/kanban",
    },
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}`);
});
