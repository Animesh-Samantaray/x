import User from "../models/User.model";

export const send_otp_for_reset_password=async(email)=>{
try {
    const otp = Math.floor(Math.random()*90000 + 100000).toString();
    const user = await User.findOne({email});
    user.passwordResetOTP=otp;
    user.passwordResetOTPExpire=Date.now() + 10;
} catch (error) {
    
}
}