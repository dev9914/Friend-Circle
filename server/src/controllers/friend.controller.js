import { User } from "../models/User.model.js";

export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    const users = await User.find({
      $or: [
        { username: { $regex: query, $options: 'i' } },
        { fullName: { $regex: query, $options: 'i' } },
      ],
    }).select('-password');

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const sendFriendRequest = async (req, res) => {
  try {
    const { recipientId } = req.body;
    const senderId = req.user._id;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingRequest = recipient.friendRequests.find(
      (req) => req.sender.toString() === senderId.toString() && req.status === 'pending'
    );

    if (existingRequest) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    recipient.friendRequests.push({ sender: senderId });
    await recipient.save();

    res.status(200).json({ message: 'Friend request sent' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { senderId } = req.body;
    const recipientId = req.user._id;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    const request = recipient.friendRequests.find(
      (req) => req.sender.toString() === senderId.toString() && req.status === 'pending'
    );


    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    request.status = 'accepted';
    recipient.friends.push(senderId);
    await recipient.save();

    const sender = await User.findById(senderId);
    if (sender) {
      sender.friends.push(recipientId);
      await sender.save();
    }

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const rejectFriendRequest = async (req, res) => {
  try {
    const {senderId } = req.body;
    const recipientId = req.user._id;

    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'User not found' });
    }

    const request = recipient.friendRequests.find(
      (req) => req.sender.toString() === senderId.toString() && req.status === 'pending'
    );


    if (!request) {
      return res.status(404).json({ message: 'Friend request not found' });
    }

    request.status = 'rejected';
    await recipient.save();

    res.status(200).json({ message: 'Friend request rejected' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const recommendFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId).populate('friends');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const recommendations = [];
    const userFriendSet = new Set(user.friends.map(f => f._id.toString()));
    for (const friend of user.friends) {
      for (const friendOfFriend of friend.friends) {
        if (!userFriendSet.has(friendOfFriend.toString())) {
          const friendData = await User.findById(friendOfFriend).populate('friends').select('name interests');
          const commonInterests = friendData.interests.filter(interest => user.interests.includes(interest));

          if (commonInterests.length > 0) {
            recommendations.push({
              friend: friendData,
              commonInterests: commonInterests,
            });
          }
        }
      }
    }

    const limitedRecommendations = recommendations.slice(0, 10); // Limit to 10 recommendations

    res.status(200).json(limitedRecommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

