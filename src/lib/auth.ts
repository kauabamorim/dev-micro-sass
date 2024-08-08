import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";

const JWT_SECRET =
  process.env.JWT_SECRET ||
  "12313131313131313138183193193asdakjnda$3#sadj@31!#!$!$!$!$%!%!%!$#$%$*&*%&%$%#$!@#@!#!";

export const generateToken = (userId: string) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "1h" });
};

export const verifyToken = async (token: string) => {
  try {
    const { payload } = await jwtVerify(
      token,
      new TextEncoder().encode(JWT_SECRET)
    );
    return payload;
  } catch (error) {
    console.error("Token verification failed:", error);
    return null;
  }
};
