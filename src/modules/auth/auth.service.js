import { eq } from 'drizzle-orm';
import { db } from '../../common/config/db.js';
import ApiError from '../../common/utils/api-error.js';
import { randomBytes, createHmac, createHash } from 'node:crypto'
import { usersTable } from './auth.model.js';
import { generateAccessToken, generateRefreshToken, generateResetToken } from '../../common/utils/jwt.utils.js';

const hashToken = (token) =>
  createHash("sha256").update(token).digest("hex");

const register = async ({ name, email, password}) => {
    const [existingUser] = await db.select().from(usersTable).where(eq(usersTable.email, email));

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

const verifyEmail = async ({ token }) => {
    const hashedToken = hashToken(token);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.verificationToken, hashedToken));

    if (!user) {
        throw ApiError.notFound('Invalid verification token');
    }

    await db.update(usersTable).set({ isVerified: true }).where(eq(usersTable.id, user.id));

    return {
        message: 'Email verified successfully'
    };
}

const forgotPassword = async ({ email }) => {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (!user) {
        throw ApiError.notFound('User not found');
    }
    
    const { rawToken, hashedToken } = generateResetToken()

    const resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);

    await db.update(usersTable)
            .set({ 
                resetPasswordToken: hashedToken, 
                resetPasswordExpires 
            }).where(eq(usersTable.id, user.id));

    // Todo: send email to user with rawToken

    return {
        message: 'Password reset token generated successfully',
        data: {
            resetToken: rawToken,
            expiresIn: resetPasswordExpires
        }
    }
}

const resetPassword = async ({ token, newPassword }) => {
    const hashedToken = hashToken(token);

    const [user] = await db.select().from(usersTable).where(eq(usersTable.resetPasswordToken, hashedToken));

    if (!user) {
        throw ApiError.notFound('Invalid reset token');
    }

    const salt = randomBytes(32).toString('hex');
    const hashedPassword = createHmac('sha256', salt).update(newPassword).digest('hex');

    await db.update(usersTable).set({ password: hashedPassword, salt }).where(eq(usersTable.id, user.id));

    return {
        message: 'Password reset successfully'
    }
}

const login = async ({ email, password }) => {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email));

    if (!user) {
        throw ApiError.notFound('User not found');
    }

    const salt = user.salt
    const hashedPassword = createHmac('sha256', salt).update(password).digest('hex');

    if(user.password !== hashedPassword) throw ApiError.unauthorized("user's email and password is not correct")
    
    if(!user.isVerified) throw ApiError.forbidden("Please verify your email before loggin");

    const accessToken = generateAccessToken({id: user.id})
    const refreshToken = generateRefreshToken({id: user.id})

    return {
        message: 'User Login Successfully',
        data: {
            accessToken,
            refreshToken
        }
    }
}

const logout = async (userId) => {
  await db.update(usersTable)
        .set({ refreshToken: null})
        .where(eq(usersTable.id, userId))
};

const refresh = async (token) => {
  if (!token) throw ApiError.unauthorized("Refresh token missing");
  const decoded = verifyRefreshToken(token);

  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, decoded.id));
  if (!user) throw ApiError.unauthorized("User not found");

  if (user.refreshToken !== hashToken(token)) {
    throw ApiError.unauthorized("Invalid refresh token");
  }

  const accessToken = generateAccessToken({ id: user.id });

  return { accessToken };
};

const getMe = async (userId) => {
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  if (!user) throw ApiError.notfound("User not found");
  return user;
};


export {
    register,
    verifyEmail,
    forgotPassword,
    resetPassword,
    login,
    logout,
    refresh,
    getMe
}
