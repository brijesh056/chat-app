const User = require("../models/User");
const Message = require("../models/Message");

// GET /api/users
// Returns every other user plus the last message of each conversation.
// Users you chatted with most recently come first.
exports.getUsers = async (req, res) => {
  try {
    const me = req.user._id;
    const users = await User.find({ _id: { $ne: me } }).select("name email").lean();

    // One query: latest message per conversation partner
    const lastMessages = await Message.aggregate([
      { $match: { $or: [{ sender: me }, { receiver: me }] } },
      { $sort: { createdAt: -1 } },
      {
        $group: {
          _id: { $cond: [{ $eq: ["$sender", me] }, "$receiver", "$sender"] },
          text: { $first: "$text" },
          createdAt: { $first: "$createdAt" },
          sender: { $first: "$sender" },
        },
      },
    ]);

    const lastMap = {};
    lastMessages.forEach((m) => (lastMap[m._id.toString()] = m));

    const result = users.map((u) => {
      const last = lastMap[u._id.toString()];
      return {
        ...u,
        lastMessage: last
          ? {
              text: last.text,
              createdAt: last.createdAt,
              fromMe: last.sender.toString() === me.toString(),
            }
          : null,
      };
    });

    // Recent conversations first, then the rest alphabetically
    result.sort((a, b) => {
      if (a.lastMessage && b.lastMessage) {
        return new Date(b.lastMessage.createdAt) - new Date(a.lastMessage.createdAt);
      }
      if (a.lastMessage) return -1;
      if (b.lastMessage) return 1;
      return a.name.localeCompare(b.name);
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
