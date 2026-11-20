const mongoose = require("mongoose");
const Message = require("../models/Message");
const User = require("../models/User");
const { emitToUser } = require("../socket/socket");

// GET /api/messages/:userId  -> full conversation with that user
exports.getMessages = async (req, res) => {
  try {
    const me = req.user._id;
    const other = req.params.userId;

    if (!mongoose.isValidObjectId(other)) {
      return res.status(400).json({ message: "Invalid user id" });
    }

    const messages = await Message.find({
      $or: [
        { sender: me, receiver: other },
        { sender: other, receiver: me },
      ],
    }).sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/messages/:userId  body: { text }
// Saves the message in MongoDB, then pushes it to the receiver in real time.
exports.sendMessage = async (req, res) => {
  try {
    const me = req.user._id;
    const other = req.params.userId;
    const text = (req.body.text || "").trim();

    if (!mongoose.isValidObjectId(other)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    if (!text) return res.status(400).json({ message: "Message cannot be empty" });
    if (!(await User.exists({ _id: other }))) {
      return res.status(404).json({ message: "Receiver not found" });
    }

    const message = await Message.create({ sender: me, receiver: other, text });

    // Real-time delivery to the receiver (all their open tabs/devices)
    emitToUser(other, "newMessage", message);

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
