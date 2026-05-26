

const User = require("../models/User");


const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while fetching users", error: error.message });
  }
};


const updateUserRole = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

   
    if (req.body.role) {
      if (!["user", "admin"].includes(req.body.role)) {
        return res.status(400).json({ success: false, message: "role must be 'user' or 'admin'" });
      }
      user.role = req.body.role;
    } else {
      user.role = user.role === "admin" ? "user" : "admin"; // toggle
    }

    const updatedUser = await user.save();
    res.status(200).json({
      success: true,
      data: {
        _id: updatedUser._id,
        username: updatedUser.username,
        role: updatedUser.role,
        isAdmin: updatedUser.role === "admin",
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while updating user", error: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: "You cannot delete your own admin account" });
    }

    await user.deleteOne();
    res.status(200).json({ success: true, message: "User successfully deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error while deleting user", error: error.message });
  }
};

module.exports = { getAllUsers, updateUserRole, deleteUser };
