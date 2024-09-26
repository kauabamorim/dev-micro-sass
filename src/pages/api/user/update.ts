// pages/api/profile/update.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
import { getCookieValue } from '@/lib/utils';
import { decryptToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';
import cookie from 'cookie';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userId, firstName, lastName, username, email, password } = req.body;
        const cookies = cookie.parse(req.headers.cookie || '');
        const token = cookies?.token;

        if (!token) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const decryptedToken = decryptToken(token);
        const userIdFromToken = (decryptedToken as JwtPayload)?.id;

        if (userIdFromToken !== userId) {
            return res.status(403).json({ error: 'Forbidden: You can only update your own profile' });
        }

        try {
            if (username) {
                const existingUserByUsername = await prisma.user.findFirst({
                    where: { username },
                });
                if (existingUserByUsername) {
                    return res.status(400).json({ error: 'Username already in use' });
                }
            }

            if (email) {
                const existingUserByEmail = await prisma.user.findUnique({
                    where: { email },
                });
                if (existingUserByEmail) {
                    return res.status(400).json({ error: 'Email already in use' });
                }
            }

            const updateData: any = {};
            if (firstName) updateData.firstName = firstName;
            if (lastName) updateData.lastName = lastName;
            if (username) updateData.username = username;
            if (email) updateData.email = email;
            if (password) updateData.password = password;

            const updatedUser = await prisma.user.update({
                where: { id: userId },
                data: updateData,
            });

            const { password: _, id, createdAt, updatedAt, emailVerified, ...userWithoutSensitiveInfo } = updatedUser;

            return res.status(200).json({ userWithoutSensitiveInfo });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update profile' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
