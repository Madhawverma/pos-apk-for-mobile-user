import { Request, Response } from 'express';
import { UserModel } from '../models/User';
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASS, DEFAULT_ADMIN_NAME } from '../seed';

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, identifier, password } = req.body;
    const loginUser = (email || identifier || '').trim().toLowerCase();
    const loginPass = (password || '').trim();

    if (!loginUser || !loginPass) {
      res.status(400).json({
        success: false,
        error: 'Email and password are required',
      });
      return;
    }

    let user = await UserModel.findOne({ email: loginUser });

    // Fallback if database is fresh and matching env
    if (!user && loginUser === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
      user = await UserModel.create({
        email: DEFAULT_ADMIN_EMAIL.toLowerCase(),
        password: DEFAULT_ADMIN_PASS,
        name: DEFAULT_ADMIN_NAME,
        role: 'admin',
      });
    }

    if (!user || user.password !== loginPass) {
      res.status(401).json({
        success: false,
        error: 'Invalid email or password. Please check your credentials.',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        id: user.id || user._id,
        email: user.email,
        name: user.name || DEFAULT_ADMIN_NAME,
        role: user.role || 'admin',
        mustChangePassword: !!(user as any).mustChangePassword,
        token: 'token_' + Date.now(),
        sessionExpiresIn: 3600, // 1 hour session valid
        expiresAt: Date.now() + 3600 * 1000,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const changePassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, oldPassword, newPassword } = req.body;
    const userEmail = (email || '').trim().toLowerCase();
    const cleanOld = (oldPassword || '').trim();
    const cleanNew = (newPassword || '').trim();

    if (!userEmail || !cleanOld || !cleanNew) {
      res.status(400).json({
        success: false,
        error: 'Email, current password, and new password are required.',
      });
      return;
    }

    if (cleanNew.length < 4) {
      res.status(400).json({
        success: false,
        error: 'New password must be at least 4 characters long.',
      });
      return;
    }

    const user: any = await UserModel.findOne({ email: userEmail });
    if (!user || user.password !== cleanOld) {
      res.status(401).json({
        success: false,
        error: 'Current password is incorrect.',
      });
      return;
    }

    user.password = cleanNew;
    user.mustChangePassword = false;
    await user.save();

    res.json({
      success: true,
      message: 'Password successfully updated!',
      data: {
        email: user.email,
        name: user.name,
        mustChangePassword: false,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};
