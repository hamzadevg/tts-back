import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import generateToken from '../utils/generateToken.js';

// @desc    Register a new user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, token: generateToken(user._id) });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Auth user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
       if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ 
        _id: user._id, 
        name: user.name, 
        email: user.email, 
        isAdmin: user.isAdmin, 
        token: generateToken(user._id) 
      });
    } else {
      res.status(401).json({ message: 'Invalid email or password' });
    }

  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) res.json(user);
    else res.status(404).json({ message: 'User not found' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};

// @desc    Update user profile (Name, Email, Avatar, Address)
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.name = req.body.name || user.name;
      user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;
      
      // Email change logic
      if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
          return res.status(400).json({ message: 'This email is already in use.' });
        }
        user.email = req.body.email;
      }

      if (req.body.address) {
        user.address = { ...user.address, ...req.body.address };
      }

      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
      }
      
      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email,
        avatar: updatedUser.avatar, address: updatedUser.address, token: generateToken(updatedUser._id),
      });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) { res.status(500).json({ message: error.message }); }
};