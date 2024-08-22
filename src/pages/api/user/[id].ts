import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { id } = req.query;

  try {
    const user = await prisma.user.findUnique({
      where: { id: id as string },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { password, id: userId, ...userWithoutSensitiveInfo } = user;

    res.status(200).json(userWithoutSensitiveInfo);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
}
