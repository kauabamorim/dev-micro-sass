import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { q } = req.query;

  const query = Array.isArray(q) ? q[0] : q;

  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Query is required" });
  }

  try {
    const results = await prisma.user.findMany({
      where: {
        name: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        name: true,
      },
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching search results:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
