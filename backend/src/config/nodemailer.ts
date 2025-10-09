import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  service: "gamil",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sentOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: `"AuthSoft" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Your Verfication OTP",
    text: `Your OTP code is: ${otp}. It will expire in 10 minutes`,
  };
  await transporter.sendMail(mailOptions);
};
