import { Request, Response } from 'express';
import { usersDB } from '../db';
import { DEFAULT_ADMIN_EMAIL, DEFAULT_ADMIN_PASS } from '../seed';

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

    // Check user in database or fallback to guaranteed seed
    let user: any = await usersDB.findOne({ email: loginUser });

    // If matching default credentials even before seed runs
    if (!user && loginUser === DEFAULT_ADMIN_EMAIL.toLowerCase()) {
      user = {
        email: DEFAULT_ADMIN_EMAIL.toLowerCase(),
        password: DEFAULT_ADMIN_PASS,
        name: 'अंकित वर्मा (Ankit Verma)',
        role: 'admin',
      };
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
        id: user._id || 'admin_1',
        email: user.email,
        name: user.name || 'अंकित वर्मा (Ankit Verma)',
        role: user.role || 'admin',
        token: 'token_' + Date.now(),
      },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Internal login error',
    });
  }
};
