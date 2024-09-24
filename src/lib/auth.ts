import jwt from "jsonwebtoken";
import { jwtVerify } from "jose";
import { deleteCookie } from "./utils";

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
    if (error instanceof Error) {
      if (error.name.includes("JWTExpired")) {
        deleteCookie("token");
        window.location.href = "/";
        console.log("Disconnected: JWT token has expired.");
      }
      console.log("Disconnected: JWT token has expired.");
    }

    return null;
  }
};

export const decryptToken = (token: string) => {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error("Failed to decode token:", error);
    return null;
  }
};
