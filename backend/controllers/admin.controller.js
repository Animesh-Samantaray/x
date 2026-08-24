import User from "../models/User.model.js";
import LearnerProfile from "../models/LearnerProfile.model.js";
import CreatorProfile from "../models/CreatorProfile.model.js";
import ExpertProfile from "../models/ExpertProfile.model.js";
import AdminProfile from "../models/AdminProfile.model.js";

 
// GET MY ADMIN PROFILE
 
export const getAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await AdminProfile.findOne({ user: userId }).populate(
      "user",
      "name email profilePicture role"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Admin profile not found."
      });
    }

    return res.status(200).json({
      success: true,
      profile
    });
  } catch (error) {
    console.error("Get Admin Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

 
// UPDATE MY ADMIN PROFILE
 
export const updateAdminProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const { department, permissions } = req.body;

    const profile = await AdminProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Admin profile not found."
      });
    }

    if (department !== undefined) profile.department = department;
    if (permissions !== undefined) profile.permissions = permissions;
    profile.lastActive = Date.now();

    await profile.save();

    const populated = await AdminProfile.findById(profile._id).populate(
      "user",
      "name email profilePicture role"
    );

    return res.status(200).json({
      success: true,
      message: "Admin profile updated successfully.",
      profile: populated
    });
  } catch (error) {
    console.error("Update Admin Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

 
// GET ALL USERS (ADMIN ONLY IN ROUTE)
 
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    
    return res.status(200).json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error("Admin Get All Users Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

 
// GET USER BY ID (ADMIN ONLY IN ROUTE)
 
export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    let profile;
    if (user.role === "learner") {
      profile = await LearnerProfile.findOne({ user: id });
      if (!profile) profile = await LearnerProfile.create({ user: id });
    } else if (user.role === "creator") {
      profile = await CreatorProfile.findOne({ user: id });
      if (!profile) profile = await CreatorProfile.create({ user: id });
    } else if (user.role === "expert") {
      profile = await ExpertProfile.findOne({ user: id });
      if (!profile) profile = await ExpertProfile.create({ user: id });
    } else if (user.role === "admin") {
      profile = await AdminProfile.findOne({ user: id });
      if (!profile) profile = await AdminProfile.create({ user: id });
    }

    const populatedProfile = await profile.populate("user", "name email profilePicture role isVerified");

    return res.status(200).json({
      success: true,
      profile: populatedProfile
    });
  } catch (error) {
    console.error("Admin Get User By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

 
// UPDATE USER (ADMIN ONLY IN ROUTE)
 
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const {
      name,
      role,
      profilePicture,
      isVerified,
      bio,
      skills,
      interests,
      learningGoals,
      education,
      location,
      socialLinks,
      headline,
      expertise,
      experience,
      website,
      qualifications,
      languages,
      hourlyRate,
      isAvailable,
      department,
      permissions
    } = req.body;

    if (role !== undefined) {
      const allowedRoles = ["learner", "creator", "expert", "admin"];
      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          success: false,
          message: "Invalid role value"
        });
      }

      if (role !== targetUser.role) {
        if (id === req.user.id && targetUser.role === "admin") {
          return res.status(400).json({
            success: false,
            message: "Self role transition is not allowed for security reasons"
          });
        }

        // Cleanup old profile
        if (targetUser.role === "learner") await LearnerProfile.findOneAndDelete({ user: id });
        if (targetUser.role === "creator") await CreatorProfile.findOneAndDelete({ user: id });
        if (targetUser.role === "expert") await ExpertProfile.findOneAndDelete({ user: id });
        if (targetUser.role === "admin") await AdminProfile.findOneAndDelete({ user: id });

        // Instantiate new profile
        if (role === "learner") await LearnerProfile.create({ user: id });
        if (role === "creator") await CreatorProfile.create({ user: id });
        if (role === "expert") await ExpertProfile.create({ user: id });
        if (role === "admin") await AdminProfile.create({ user: id });

        targetUser.role = role;
      }
    }

    if (name !== undefined) targetUser.name = name;
    if (profilePicture !== undefined) targetUser.profilePicture = profilePicture;
    if (isVerified !== undefined) targetUser.isVerified = isVerified;

    await targetUser.save();

    // Update the corresponding profile
    let profile;
    if (targetUser.role === "learner") {
      profile = await LearnerProfile.findOne({ user: id });
      if (!profile) profile = await LearnerProfile.create({ user: id });

      if (bio !== undefined) profile.bio = bio;
      if (skills !== undefined) profile.skills = skills;
      if (interests !== undefined) profile.interests = interests;
      if (learningGoals !== undefined) profile.learningGoals = learningGoals;
      if (education !== undefined) profile.education = education;
      if (location !== undefined) profile.location = location;
      if (socialLinks !== undefined) profile.socialLinks = socialLinks;
      await profile.save();
    } else if (targetUser.role === "creator") {
      profile = await CreatorProfile.findOne({ user: id });
      if (!profile) profile = await CreatorProfile.create({ user: id });

      if (headline !== undefined) profile.headline = headline;
      if (bio !== undefined) profile.bio = bio;
      if (skills !== undefined) profile.skills = skills;
      if (expertise !== undefined) profile.expertise = expertise;
      if (experience !== undefined) profile.experience = experience;
      if (education !== undefined) profile.education = education;
      if (website !== undefined) profile.website = website;
      if (socialLinks !== undefined) profile.socialLinks = socialLinks;
      if (isVerified !== undefined) profile.isVerified = isVerified;
      await profile.save();
    } else if (targetUser.role === "expert") {
      profile = await ExpertProfile.findOne({ user: id });
      if (!profile) profile = await ExpertProfile.create({ user: id });

      if (headline !== undefined) profile.headline = headline;
      if (bio !== undefined) profile.bio = bio;
      if (expertise !== undefined) profile.expertise = expertise;
      if (skills !== undefined) profile.skills = skills;
      if (experience !== undefined) profile.experience = experience;
      if (qualifications !== undefined) profile.qualifications = qualifications;
      if (languages !== undefined) profile.languages = languages;
      if (hourlyRate !== undefined) profile.hourlyRate = hourlyRate;
      if (isAvailable !== undefined) profile.isAvailable = isAvailable;
      if (socialLinks !== undefined) profile.socialLinks = socialLinks;
      if (isVerified !== undefined) profile.isVerified = isVerified;
      await profile.save();
    } else if (targetUser.role === "admin") {
      profile = await AdminProfile.findOne({ user: id });
      if (!profile) profile = await AdminProfile.create({ user: id });

      if (department !== undefined) profile.department = department;
      if (permissions !== undefined) profile.permissions = permissions;
      profile.lastActive = Date.now();
      await profile.save();
    }

    const populatedProfile = await profile.populate("user", "name email profilePicture role isVerified");

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      profile: populatedProfile
    });

  } catch (error) {
    console.error("Admin Update User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

 
// DELETE USER (ADMIN ONLY IN ROUTE)
 
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "Admin cannot delete their own account"
      });
    }

    const targetUser = await User.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Cascade delete role profiles
    await LearnerProfile.findOneAndDelete({ user: id });
    await CreatorProfile.findOneAndDelete({ user: id });
    await ExpertProfile.findOneAndDelete({ user: id });
    await AdminProfile.findOneAndDelete({ user: id });

    // Delete User
    await User.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "User and associated profiles deleted successfully"
    });

  } catch (error) {
    console.error("Admin Delete User Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};
