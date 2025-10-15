import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";

interface JwtPayload {
  sub: string; // user id as string
  role: string;
  name: string;
  system: string;
  iat: number;
  exp: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: Types.ObjectId;
        role: string;
        name: string;
      };
    }
  }
}

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const secret = process.env.JWT_SECRET!;

    //verify the token
    const decoded = jwt.verify(token, secret) as JwtPayload;

    //attch user data to request
    req.user = {
      id: new Types.ObjectId(decoded.sub),
      role: decoded.role,
      name: decoded.name,
    };
    next();
  } catch (error) {
    console.error("JWT verification error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
