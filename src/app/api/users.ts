import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    if (req.method !== "GET") {
      console.log('aaaaaaaassssssssssssassss');
      return res.status(405).end();
    }

    console.log('chegou aqui');
    
    const { email } = req.body;

    const userExists = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });

    if (userExists) {
      return res.status(400).json({ message: "Email already exist." });
    }

    return res.status(300);
  } catch (error) {
    console.log("deuuuu erro");
  }
}
