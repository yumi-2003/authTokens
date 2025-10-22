import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sentOtpEmail = async (email: string, otp: string) => {
  const mailOptions = {
    from: `"AuthenSoft" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "🔐 AuthenSoft - Your OTP Verification Code",
    text: `Hello,

Your One-Time Password (OTP) is: ${otp}

Please use this code to verify your account. It will expire in 1 minute.

If you did not request this, please ignore this email.

Thank you,
AuthenSoft Support Team
`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #e0d6c9; border-radius: 10px; overflow: hidden;">
        <div style="background-color: #8B4513; padding: 20px; color: white; text-align: center;">
          <h2 style="margin: 0;">AuthenSoft Verification</h2>
        </div>
        <div style="padding: 25px; color: #3c2f2f; background-color: #fffaf5;">
          <p>Hi there,</p>
          <p>We received a request to verify your account. Please use the following One-Time Password (OTP) to complete your verification:</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <span style="
              display: inline-block;
              font-size: 26px;
              letter-spacing: 5px;
              background: #f5e6d3;
              padding: 15px 25px;
              border-radius: 8px;
              border: 1px solid #d3b899;
              color: #5a3e1b;
              font-weight: bold;
            ">
              ${otp}
            </span>
          </div>
          
          <p><b>Note:</b> This OTP will expire in <strong>1 minute</strong> for security reasons.</p>
          <p>If you did not initiate this request, you can safely ignore this email.</p>
          
          <p style="margin-top: 30px;">Best regards,<br><strong>The AuthSoft Team</strong></p>
        </div>
        <div style="background-color: #f0e5dc; padding: 15px; text-align: center; font-size: 12px; color: #7a5c3c;">
          © ${new Date().getFullYear()} AuthenSoft. All rights reserved.
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};
