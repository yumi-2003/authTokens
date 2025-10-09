import jwt from "jsonwebtoken";
import { Types } from "mongoose";

export const generateToken = (
  userId: Types.ObjectId,
  role: string,
  name: string
): string => {
  const secret = process.env.JWT_SECRET!;
  const expiresIn = "1h"; // token valid for 1 hour

  const token = jwt.sign(
    {
      sub: userId.toString(), // convert ObjectId → string
      role,
      name,
      system: "AuthService",
      iat: Math.floor(Date.now() / 1000),
    },
    secret,
    { expiresIn }
  );

  return token;
};
