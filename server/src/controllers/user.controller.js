import {User} from "../models/User.model.js";
import bcrypt from "bcryptjs";
import generateTokenAndSetCookie from "../utils/GenerateToken.js";

export const signup = async (req, res) => {
  try {
    const { fullName, username, password, email,interests } = req.body;

    if (!fullName || !username || !password || !email) {
        return res.status(400).json({ error: "These fields are required." });
      }

    const user = await User.findOne({ $or:[{username}, {email}]});

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      fullName,
      username,
      password: hashedPassword,
      email,
      interests
    });

    if (newUser) {
      const token = generateTokenAndSetCookie(newUser._id, res);
      await newUser.save();

      const userUpdated = await User.findById(newUser._id).select("-password")

      res.status(201).json({userUpdated, token});
    } else {
      res.status(400).json({ error: "Invalid user data" });
    }
  } catch (error) {
    console.log("Error in signup controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const login = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.findOne({ $or:[{username}, {email}] });
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user?.password || ""
    );

    if (!user || !isPasswordCorrect) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const userUpadated = await User.findById(user._id).select("-password")
    const token = generateTokenAndSetCookie(user._id, res);

    res.status(200).json({
      userUpadated , token
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getuser = async (req, res) => {
  try {

    const userId = req.user._id;
    const user = await User.findById(userId).select("-password")

    if(!user) {
      res.status(404).json({message: "User does not found"})
    }
    res.status(201).json(user)
    
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
export const getuserbyId = async (req, res) => {
  try {

    const {userId} = req.params;
    const user = await User.findById(userId).select("-password")

    if(!user) {
      res.status(404).json({message: "User does not found"})
    }
    res.status(201).json(user)
    
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0, httpOnly: true, sameSite: 'Strict' });
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Error in logout controller:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};