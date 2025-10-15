import crypto from "crypto";

//generate a secure random refresh token (raw + hashed)
export const generateRefreshToken = () => {
  const refreshToken = crypto.randomBytes(48).toString("hex"); // raw token (sent to user)
  const hashedToken = crypto
    .createHash("sha256")
    .update(refreshToken)
    .digest("hex"); //store in DB

  return { refreshToken, hashedToken };
};

//hash a refresh token for DB comparison
export const hashRefreshToken = (token: string) => {
  return crypto.createHash("sha256").update(token).digest("hex");
};
