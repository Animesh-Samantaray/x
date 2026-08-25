import ExpertProfile from "../models/ExpertProfile.model.js";

 
// GET MY PROFILE
 
export const getExpertProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await ExpertProfile.findOne({ user: userId }).populate(
      "user",
      "name email profilePicture role"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Expert profile not found."
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Expert Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

 
// GET ALL EXPERTS
 
export const getAllExperts = async (req, res) => {
  try {
    const profiles = await ExpertProfile.find()
      .populate("user", "name email profilePicture role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    console.error("Get All Experts Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

 
// GET PARTICULAR EXPERT 
 
export const getExpertById = async (req, res) => {
  try {
    const { id } = req.params;

    let profile = await ExpertProfile.findById(id).populate(
      "user",
      "name email profilePicture role"
    );

    if (!profile) {
      profile = await ExpertProfile.findOne({ user: id }).populate(
        "user",
        "name email profilePicture role"
      );
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Expert profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Expert By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

 
// UPDATE PROFILE
 
export const updateExpertProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await ExpertProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Expert profile not found."
      });
    }

    const {
      headline,
      bio,
      expertise,
      skills,
      experience,
      qualifications,
      languages,
      hourlyRate,
      isAvailable,
      socialLinks,
      isVerified,
    } = req.body;

    if (headline !== undefined) profile.headline = headline;
    if (bio !== undefined) profile.bio = bio;
    if (skills !== undefined) profile.skills = skills;
    if (expertise !== undefined) profile.expertise = expertise;
    if (experience !== undefined) profile.experience = experience;
    if (qualifications !== undefined) profile.qualifications = qualifications;
    if (languages !== undefined) profile.languages = languages;
    if (hourlyRate !== undefined) profile.hourlyRate = hourlyRate;
    if (isAvailable !== undefined) profile.isAvailable = isAvailable;
    if (socialLinks !== undefined) profile.socialLinks = socialLinks;
    if (isVerified !== undefined) profile.isVerified = isVerified;

    await profile.save();

    const populated = await ExpertProfile.findById(profile._id).populate(
      "user",
      "name email profilePicture role"
    );

    return res.status(200).json({
      success: true,
      message: "Expert profile updated successfully.",
      profile: populated
    });

  } catch (error) {
    console.error("Update Expert Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

 
// DELETE PROFILE
 
export const deleteExpertProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await ExpertProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Expert profile not found."
      });
    }

    await ExpertProfile.findOneAndDelete({ user: userId });

    return res.status(200).json({
      success: true,
      message: "Expert profile deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Expert Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
