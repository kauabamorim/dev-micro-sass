// pages/api/profile/update.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from "@prisma/client";
import { getCookieValue } from '@/lib/utils';
import { decryptToken } from '@/lib/auth';
import { JwtPayload } from 'jsonwebtoken';

const prisma = new PrismaClient();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const { userId, firstName, lastName, username, email, password } = req.body;
        // const decrip = decryptToken('');
        // const userIdFromToken = (decrip as JwtPayload)?.id;

        try {
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

            return res.status(200).json({ message: 'Profile updated successfully', user: updatedUser });
        } catch (error) {
            return res.status(500).json({ error: 'Failed to update profile' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).json({ message: `Method ${req.method} Not Allowed` });
    }
}
