import Earnings from "../models/Earnings.model.js";


export const getMyEarnings = async (req, res) => {
  try {
    const userId = req.user._id;

    const earnings = await Earnings.findOne({
      user: userId,
    }).populate("user", "name email profilePicture role");

    if (!earnings) {
      return res.status(200).json({
        success: true,
        data: {
          user: userId,
          earnings: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: earnings,
    });
  } catch (error) {
    console.error("Get My Earnings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get earnings",
    });
  }
};


export const getEarningsByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    const earnings = await Earnings.findOne({
      user: userId,
    }).populate("user", "name email profilePicture role");

    if (!earnings) {
      return res.status(200).json({
        success: true,
        data: {
          user: userId,
          earnings: 0,
        },
      });
    }

    return res.status(200).json({
      success: true,
      data: earnings,
    });
  } catch (error) {
    console.error("Get User Earnings Error:", error);

    return res.status(500).json({
      success: false,
      message: "Failed to get user earnings",
    });
  }
};

export default {
  getMyEarnings,
  getEarningsByUserId,
};