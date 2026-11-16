import * as FileSystem from 'expo-file-system/legacy';

const AUTH_FILE = `${FileSystem.documentDirectory}user_session.json`;

export interface UserSession {
  isLoggedIn: boolean;
  email: string;
  name: string;
  token: string;
  loginTime: number;
}

export const authStorage = {
  saveSession: async (user: { email: string; name?: string; token?: string }): Promise<void> => {
    try {
      const data: UserSession = {
        isLoggedIn: true,
        email: user.email,
        name: user.name || 'Store User',
        token: user.token || 'token_' + Date.now(),
        loginTime: Date.now(),
      };
      await FileSystem.writeAsStringAsync(AUTH_FILE, JSON.stringify(data));
    } catch (e) {
      console.log('[AuthStorage] Save error:', e);
    }
  },

  getSession: async (): Promise<UserSession | null> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(AUTH_FILE);
      if (!fileInfo.exists) return null;
      const content = await FileSystem.readAsStringAsync(AUTH_FILE);
      if (!content) return null;
      return JSON.parse(content);
    } catch (e) {
      return null;
    }
  },

  clearSession: async (): Promise<void> => {
    try {
      const fileInfo = await FileSystem.getInfoAsync(AUTH_FILE);
      if (fileInfo.exists) {
        await FileSystem.deleteAsync(AUTH_FILE, { idempotent: true });
      }
    } catch (e) {
      console.log('[AuthStorage] Clear error:', e);
    }
  },
};
