import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { generateToken } from "../../../lib/auth";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("reeeeeeeqqqqq: ", req.method, "testeee: ", req);
  if (req.method === "POST") {
    const { email, firstName, lastName, password } = req.body;

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "Email already registered" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await prisma.user.create({
        data: {
          email,
          firstName,
          lastName,
          password: hashedPassword,
        },
      });

      const token = generateToken(newUser.id);

      res.status(201).json({ token: token });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to register user" });
    }
  } else {
    console.log("reeeeeeeqqqqq1111: ", req.method, "testeee: ", req);
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
