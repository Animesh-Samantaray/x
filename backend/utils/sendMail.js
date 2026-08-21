import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

export const sendMail = async(to , subject , html)=>{
    const formattedTo = Array.isArray(to) ? to.filter(Boolean).join(", ") : to;
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to: formattedTo,
        subject,
        html
    })
};