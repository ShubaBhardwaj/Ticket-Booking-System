import { eq } from 'drizzle-orm';
import { db } from '../../common/config/db.js';
import ApiError from '../../common/utils/api-error.js';
import { randomBytes, createHmac, createHash } from 'node:crypto'
import { usersTable } from './auth.model.js';
import { generateResetToken } from '../../common/utils/jwt.utils.js';
import ApiResponse from '../../common/utils/api-response.js';

const hashToken = (token) =>
  createHash("sha256").update(token).digest("hex");

export const register = async ({ name, email, password}) => {
    const users = await db.select().from(usersTable).where(eq(usersTable.email, email));

    const existingUser = users[0];
    if (existingUser) {
        throw ApiError.badRequest('Email is already in use');
    }

    const salt = randomBytes(32).toString('hex');
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

    const { rawToken, hashedToken } = generateResetToken()

    const [newUser] = await db.insert(usersTable).values({
            name,
            email,
            password: hashedPassword,
            salt,
            verificationToken: hashedToken
        }).returning({ id: usersTable.id })

    // TODO: send an email to user with token: rawToken


    return {
        message: 'User registered successfully',
        data: {
            userId: newUser.id,
            verificationToken: rawToken
        }
    }
    
}

export const verifyEmail = async ({ token }) => {
    const hashedToken = hashToken(token);

    const users = await db.select().from(usersTable).where(eq(usersTable.verificationToken, hashedToken));
    const user = users[0];

    if (!user) {
        throw ApiError.notFound('Invalid verification token');
    }

    await db.update(usersTable).set({ isVerified: true }).where(eq(usersTable.id, user.id));

    return {
        message: 'Email verified successfully'
    };
}

