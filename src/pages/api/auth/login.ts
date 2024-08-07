import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, password } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (!existingUser) {
        return res.status(400).json({ error: "Email not registered" });
      }

      if (!existingUser.password) {
        return res
          .status(500)
          .json({ error: "Password not found in database" });
      }

      const isPasswordMatch = await bcrypt.compare(
        password,
        existingUser.password
      );

      if (!isPasswordMatch) {
        return res.status(401).json({ error: "Invalid password" });
      }

      res.status(200).json({ message: "Login successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to authenticate user" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
