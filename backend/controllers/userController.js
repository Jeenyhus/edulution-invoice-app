const User = require('../models/User');

// Get all users
const getUsers = async (req, res) => {
  try {
    const users = await User.getAllUsers();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get single user
const getUserById = async (req, res) => {
  try {
    const user = await User.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: error.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const profile = await User.getUserById(req.user.id);
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    // Remove sensitive information
    delete profile.password;
    
    res.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { 
      name, 
      email, 
      hourlyRate,
      career,
      bankName,
      branchCode,
      accountNumber,
      address,
      phoneNumber
    } = req.body;

    const userId = req.user.id;

    await User.updateUser(userId, {
      name,
      email,
      hourlyRate,
      career,
      bankName,
      branchCode,
      accountNumber,
      address,
      phoneNumber
    });

    const updatedProfile = await User.getUserById(userId);
    delete updatedProfile.password;

    res.json(updatedProfile);
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getProfile,
  updateProfile
}; 