import LearnerProfile from "../models/LearnerProfile.model.js";

 
// GET MY PROFILE
 
export const getLearnerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await LearnerProfile.findOne({ user: userId }).populate(
      "user",
      "name email profilePicture role"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found."
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Learner Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

 
// GET ALL LEARNERS
 
export const getAllLearners = async (req, res) => {
  try {
    const profiles = await LearnerProfile.find()
      .populate("user", "name email profilePicture role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    console.error("Get All Learners Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

 
// GET PARTICULAR LEARNER BY USER ID OR PROFILE ID
 
export const getLearnerById = async (req, res) => {
  try {
    const { id } = req.params;

    let profile = await LearnerProfile.findById(id).populate(
      "user",
      "name email profilePicture role"
    );

    if (!profile) {
      profile = await LearnerProfile.findOne({ user: id }).populate(
        "user",
        "name email profilePicture role"
      );
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Learner By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

 
// UPDATE PROFILE
 
export const updateLearnerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await LearnerProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found."
      });
    }

    const {
      bio,
      skills,
      interests,
      learningGoals,
      education,
      location,
      socialLinks,
    } = req.body;

    if (bio !== undefined) profile.bio = bio;
    if (skills !== undefined) profile.skills = skills;
    if (interests !== undefined) profile.interests = interests;
    if (learningGoals !== undefined) profile.learningGoals = learningGoals;
    if (education !== undefined) profile.education = education;
    if (location !== undefined) profile.location = location;
    if (socialLinks !== undefined) profile.socialLinks = socialLinks;

    await profile.save();

    const populated = await LearnerProfile.findById(profile._id).populate(
      "user",
      "name email profilePicture role"
    );

    return res.status(200).json({
      success: true,
      message: "Learner profile updated successfully.",
      profile: populated
    });

  } catch (error) {
    console.error("Update Learner Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

 
// DELETE PROFILE
 
export const deleteLearnerProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await LearnerProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Learner profile not found."
      });
    }

    await LearnerProfile.findOneAndDelete({ user: userId });

    return res.status(200).json({
      success: true,
      message: "Learner profile deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Learner Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};