import express from 'express';
import Message from '../models/Message.js';
import mongoose from 'mongoose';

const router = express.Router();

// Get chat history between two users
router.get('/messages/:userId1/:userId2', async (req, res) => {
  try {
    const { userId1, userId2 } = req.params;
    
    const messages = await Message.find({
      $or: [
        { sender: userId1, receiver: userId2 },
        { sender: userId2, receiver: userId1 }
      ]
    }).sort('createdAt');
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching messages' });
  }
});

// Get unread message count for a user
router.get('/unread-count/:userId', async (req, res) => {
  try {
    const unreadCounts = await Message.aggregate([
      {
        $match: {
          receiver: mongoose.Types.ObjectId(req.params.userId),
          isRead: false
        }
      },
      {
        $group: {
          _id: '$sender',
          count: { $sum: 1 }
        }
      }
    ]);
    
    res.json(unreadCounts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching unread counts' });
  }
});

export default router; 