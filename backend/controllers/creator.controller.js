import CreatorProfile from "../models/CreatorProfile.model.js";

 
// GET MY PROFILE
 
export const getCreatorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await CreatorProfile.findOne({ user: userId }).populate(
      "user",
      "name email profilePicture role"
    );

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Creator profile not found."
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Creator Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

 
// GET ALL CREATORS
 
export const getAllCreators = async (req, res) => {
  try {
    const profiles = await CreatorProfile.find()
      .populate("user", "name email profilePicture role")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: profiles.length,
      profiles,
    });
  } catch (error) {
    console.error("Get All Creators Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

 

 
export const getCreatorById = async (req, res) => {
  try {
    const { id } = req.params;

    let profile = await CreatorProfile.findById(id).populate(
      "user",
      "name email profilePicture role"
    );

    if (!profile) {
      profile = await CreatorProfile.findOne({ user: id }).populate(
        "user",
        "name email profilePicture role"
      );
    }

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Creator profile not found.",
      });
    }

    return res.status(200).json({
      success: true,
      profile,
    });
  } catch (error) {
    console.error("Get Creator By ID Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

 
// UPDATE PROFILE
 
export const updateCreatorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await CreatorProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Creator profile not found."
      });
    }

    const {
      headline,
      bio,
      skills,
      expertise,
      experience,
      education,
      website,
      socialLinks,
      isVerified,
    } = req.body;

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

    const populated = await CreatorProfile.findById(profile._id).populate(
      "user",
      "name email profilePicture role"
    );

    return res.status(200).json({
      success: true,
      message: "Creator profile updated successfully.",
      profile: populated
    });

  } catch (error) {
    console.error("Update Creator Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

 
// DELETE PROFILE
 
export const deleteCreatorProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const profile = await CreatorProfile.findOne({ user: userId });
    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "Creator profile not found."
      });
    }

    await CreatorProfile.findOneAndDelete({ user: userId });

    return res.status(200).json({
      success: true,
      message: "Creator profile deleted successfully.",
    });
  } catch (error) {
    console.error("Delete Creator Profile Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};
