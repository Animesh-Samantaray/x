import { hashPassword } from "../helper/hashPassword";
import User from "../models/User.model";
import resetPasswordTemplate from "../utils/resetPasswordOtpTemplete";
import { sendMail } from "../utils/sendMail";

export const send_otp_for_reset_password=async(email)=>{
try {
    const otp = Math.floor(Math.random()*90000 + 100000).toString();
    const user = await User.findOne({email});
    user.passwordResetOTP=otp;
    user.passwordResetOTPExpire=new Date(Date.now() + 10*60*1000);
    await user.save();

    await sendMail(
        email,
        "Password reset OTP",
        resetPasswordTemplate(otp)
    );

    return res.status(200).json({
      success: true,
      message: "Password reset OTP sent successfully.",
    });
} catch (error) {
    console.error("Send Reset OTP Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
}
}


export const changePassword=async (email , otp , newPassword)=>{
    try {
        const user=await User.findOne(email);
        if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (!user.passwordResetOTP || !user.passwordResetOTPExpire) {
      return res.status(400).json({
        success: false,
        message: "Please request a password reset OTP first.",
      });
    }

  
    if (Date.now() > user.passwordResetOTPExpire) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one.",
      });
    }

   
    if (user.passwordResetOTP !== inputOtp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }
        
        const password = await hashPassword(newPassword);
        user.password=password;
        user.passwordResetOTP=undefined;
        user.passwordResetOTPExpire=undefined

    } catch (error) {
        console.error("Change Password Error:", error);

    return res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
    }
}