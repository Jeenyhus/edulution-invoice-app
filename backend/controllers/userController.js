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

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userData = req.body;

    console.log('Updating user:', { id, userData }); // Debug log

    // Check if user exists
    const existingUser = await User.getUserById(id);
    if (!existingUser) {
      console.log('User not found:', id); // Debug log
      return res.status(404).json({ message: 'User not found' });
    }

    // Validate hourly rate
    const hourlyRate = parseFloat(userData.hourlyRate);
    if (isNaN(hourlyRate) || hourlyRate <= 0) {
      return res.status(400).json({ message: 'Invalid hourly rate' });
    }

    // Update user data
    const updatedData = {
      name: userData.name,
      email: userData.email,
      hourlyRate: hourlyRate,
      career: userData.career,
      bankName: userData.bankName,
      branchCode: userData.branchCode,
      accountNumber: userData.accountNumber,
      address: userData.address,
      phoneNumber: userData.phoneNumber,
      role: userData.role
    };

    await User.updateUser(id, updatedData);
    
    // Fetch and return updated user
    const updatedUser = await User.getUserById(id);
    if (!updatedUser) {
      throw new Error('Failed to fetch updated user');
    }

    // Remove sensitive data
    delete updatedUser.password;
    
    console.log('User updated successfully:', updatedUser); // Debug log
    res.json(updatedUser);
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ message: 'Error updating user', error: error.message });
  }
};

module.exports = {
  getUsers,
  getUserById,
  getProfile,
  updateProfile,
  updateUser
}; 