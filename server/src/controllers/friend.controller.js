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
export const getFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friends = await User.findById(userId).populate('friends')


    res.status(200).json({ friends});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const recommendFriendsByInterests = async (req, res) => {
  try {
    const userId = req.user._id;

    // Find the current user
    const user = await User.findById(userId).populate('friends');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Create a set of friends' IDs for easy lookup
    const userFriendSet = new Set(user.friends.map(friend => friend._id.toString()));

    // Find users with similar interests and not already friends
    const recommendations = await User.find({
      _id: { $ne: userId, $nin: Array.from(userFriendSet) }, // Exclude current user and friends
      interests: { $in: user.interests } // Match users with similar interests
    }).select('username fullName email interests'); // Select only the required fields

    // Limit recommendations to 10
    const limitedRecommendations = recommendations.slice(0, 10);

    res.status(200).json(limitedRecommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





