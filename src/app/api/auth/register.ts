import { hash } from "bcryptjs";
import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { email, firstName, lastName, password } = req.body;

    try {
      const prisma = new PrismaClient();
      const hashedPassword = await hash(password, 10);

      console.log("Creating user:", { email, firstName, lastName });

    //   const user = await prisma.user.create({
    //     data: {
    //       email,
    //       firstName,
    //       lastName,
    //       password: hashedPassword,
    //     },
    //   });

    //   console.log("User created:", user);

    //   res.status(200).json({ message: "User created", user });
    } catch (error) {
      console.error("Error creating user:", error);
      res.status(500).json({ error: "User creation failed" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
