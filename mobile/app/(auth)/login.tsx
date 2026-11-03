import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  ScrollView,
  StatusBar,
  Dimensions,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Modal,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Defs,
  LinearGradient as SvgLinearGradient,
  Stop,
  Rect,
  Path,
} from 'react-native-svg';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  Check,
  ArrowRight,
  ShieldCheck,
  Timer,
  Settings,
} from 'lucide-react-native';
import { apiService } from '../../src/services/apiService';

const { width } = Dimensions.get('window');

// Local background image of the optical showroom
const loginBg = require('../../assets/login_bg.jpg');

/**
 * 4-color authentic Google "G" Logo vector
 */
function GoogleIcon({ size = 20 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <Path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.25 21.36 7.34 24 12 24z"
      />
      <Path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.97 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
      />
      <Path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.25 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </Svg>
  );
}

/**
 * Optical Eyeglasses Outline Logo matching the screenshot emblem
 */
function GlassesLogo({
  width = 54,
  height = 24,
  color = '#0A3925',
}: {
  width?: number;
  height?: number;
  color?: string;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 64 26" fill="none">
      {/* Left Lens */}
      <Rect
        x="3"
        y="3"
        width="24"
        height="20"
        rx="10"
        stroke={color}
        strokeWidth="2.8"
      />
      {/* Arched Bridge */}
      <Path
        d="M27 10 C30 7, 34 7, 37 10"
        stroke={color}
        strokeWidth="2.8"
        strokeLinecap="round"
      />
      {/* Right Lens */}
      <Rect
        x="37"
        y="3"
        width="24"
        height="20"
        rx="10"
        stroke={color}
        strokeWidth="2.8"
      />
      {/* Temples */}
      <Path d="M3 11 L1 11" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
      <Path d="M61 11 L63 11" stroke={color} strokeWidth="2.8" strokeLinecap="round" />
    </Svg>
  );
}

/**
 * Flowing Silk Wave Background (Emerald Green) at bottom of screen
 */
function WaveBackground() {
  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <Svg width="100%" height="100%" viewBox="0 0 400 900" preserveAspectRatio="none">
        <Defs>
          <SvgLinearGradient id="bgGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#053020" stopOpacity="0.8" />
            <Stop offset="35%" stopColor="#04281B" stopOpacity="1" />
            <Stop offset="100%" stopColor="#021C13" stopOpacity="1" />
          </SvgLinearGradient>
          <SvgLinearGradient id="wave1" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#0D593E" stopOpacity="0.9" />
            <Stop offset="100%" stopColor="#04281B" stopOpacity="0.3" />
          </SvgLinearGradient>
          <SvgLinearGradient id="wave2" x1="100%" y1="0%" x2="0%" y2="100%">
            <Stop offset="0%" stopColor="#084933" stopOpacity="0.75" />
            <Stop offset="100%" stopColor="#021810" stopOpacity="0.95" />
          </SvgLinearGradient>
        </Defs>

        <Rect width="400" height="900" fill="url(#bgGrad)" />

        {/* Organic curved waves */}
        <Path
          d="M-50,640 C60,560 190,690 450,570 L450,900 L-50,900 Z"
          fill="url(#wave1)"
        />
        <Path
          d="M-20,700 C120,620 240,770 430,660 L430,900 L-20,900 Z"
          fill="url(#wave2)"
        />
        <Path
          d="M0,750 C140,700 260,800 420,730 L420,900 L0,900 Z"
          fill="#021911"
          fillOpacity="0.8"
        />
      </Svg>
    </View>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);

  // Force Change Password Modal State
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [changingPassword, setChangingPassword] = useState(false);
  const [loggedInEmail, setLoggedInEmail] = useState('');
  const [savedOldPassword, setSavedOldPassword] = useState('');

  const handleLogin = async () => {
    const cleanId = identifier.trim();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      Alert.alert('Required', 'Please enter your email and password.');
      return;
    }

    setLoading(true);
    try {
      // Validate credentials against backend server
      const res = await apiService.login({
        email: cleanId,
        password: cleanPass,
      });

      if (res && res.token) {
        if (res.mustChangePassword) {
          setLoggedInEmail(cleanId);
          setSavedOldPassword(cleanPass);
          setShowPasswordChangeModal(true);
        } else {
          router.replace('/(tabs)/dashboard');
        }
      } else {
        Alert.alert(
          'Login Failed',
          'Invalid email or password. Please check your credentials.'
        );
      }
    } catch (e: any) {
      Alert.alert('Error', 'Unable to reach backend server. Please check your network.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNewPassword = async () => {
    const cleanNew = newPasswordInput.trim();
    const cleanConfirm = confirmPasswordInput.trim();

    if (!cleanNew) {
      Alert.alert('Required', 'Please enter your new password.');
      return;
    }
    if (cleanNew.length < 4) {
      Alert.alert('Invalid', 'Password must be at least 4 characters long.');
      return;
    }
    if (cleanNew === '11111111') {
      Alert.alert('Invalid', 'Please choose a password other than default 11111111.');
      return;
    }
    if (cleanNew !== cleanConfirm) {
      Alert.alert('Mismatch', 'New password and confirm password do not match.');
      return;
    }

    setChangingPassword(true);
    try {
      const res = await apiService.changePassword({
        email: loggedInEmail,
        oldPassword: savedOldPassword,
        newPassword: cleanNew,
      });

      if (res && res.success) {
        setShowPasswordChangeModal(false);
        Alert.alert('Success', 'Password successfully updated!', [
          { text: 'OK', onPress: () => router.replace('/(tabs)/dashboard') }
        ]);
      } else {
        Alert.alert('Failed', res?.error || 'Failed to update password.');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Could not connect to server.');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleGoogleLogin = () => {
    router.replace('/(tabs)/dashboard');
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Deep Emerald Wave Background underneath */}
      <WaveBackground />

      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          bounces={false}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Hero Section with Optical Showroom Background Image */}
          <View style={styles.heroWrapper}>
            <ImageBackground
              source={loginBg}
              style={styles.heroBackground}
              imageStyle={styles.heroImage}
              resizeMode="cover"
            >
              {/* Soft overlay gradient on the left so brand typography is razor-sharp */}
              <Svg style={StyleSheet.absoluteFill} width="100%" height="100%">
                <Defs>
                  <SvgLinearGradient id="heroGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.84" />
                    <Stop offset="42%" stopColor="#FFFFFF" stopOpacity="0.48" />
                    <Stop offset="75%" stopColor="#FFFFFF" stopOpacity="0.08" />
                    <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.0" />
                  </SvgLinearGradient>
                  {/* Bottom fade into the dark green container to guarantee NO visible border */}
                  <SvgLinearGradient id="heroBottomFade" x1="0%" y1="70%" x2="0%" y2="100%">
                    <Stop offset="0%" stopColor="#04281B" stopOpacity="0.0" />
                    <Stop offset="100%" stopColor="#04281B" stopOpacity="0.92" />
                  </SvgLinearGradient>
                </Defs>
                <Rect width="100%" height="100%" fill="url(#heroGradient)" />
                <Rect width="100%" height="100%" fill="url(#heroBottomFade)" />
              </Svg>

              {/* Brand Header Overlay */}
              <View style={[styles.brandContent, { paddingTop: Math.max(insets.top, 20) + 14 }]}>
                {/* Glasses Logo Icon */}
                <GlassesLogo width={56} height={24} color="#0A3925" />

                {/* Brand Name & Subtitle */}
                <Text style={styles.brandTitle}>श्री गणेश ऑप्टिकल</Text>
                <Text style={styles.brandSubtitle}>इंग्लिशिपुरा, सीहोर • +91 6263732857</Text>

                {/* Tagline */}
                <View style={styles.taglineBox}>
                  <Text style={styles.taglineText}>Better Vision</Text>
                  <View style={styles.taglineUnderline} />
                  <Text style={styles.taglineText}>Brighter Life</Text>
                </View>
              </View>
            </ImageBackground>
          </View>

          {/* Center Floating White Card */}
          <View style={styles.cardContainer}>
            <View style={styles.card}>
              <Text style={styles.welcomeTitle}>Welcome Back</Text>
              <Text style={styles.welcomeSubtitle}>Login to manage your optical store</Text>

              {/* Email / Phone Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIconBox}>
                  <User size={19} color="#64748B" strokeWidth={1.8} />
                </View>
                <TextInput
                  style={styles.inputField}
                  placeholder="Email or Phone Number"
                  placeholderTextColor="#94A3B8"
                  value={identifier}
                  onChangeText={setIdentifier}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {/* Password Input */}
              <View style={styles.inputWrapper}>
                <View style={styles.inputIconBox}>
                  <Lock size={19} color="#64748B" strokeWidth={1.8} />
                </View>
                <TextInput
                  style={styles.inputField}
                  placeholder="Password"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                  activeOpacity={0.7}
                  hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                  {showPassword ? (
                    <Eye size={19} color="#0A3925" strokeWidth={1.8} />
                  ) : (
                    <EyeOff size={19} color="#64748B" strokeWidth={1.8} />
                  )}
                </TouchableOpacity>
              </View>

              {/* Remember Me & Forgot Password Row */}
              <View style={styles.optionsRow}>
                <TouchableOpacity
                  style={styles.rememberRow}
                  onPress={() => setRememberMe(!rememberMe)}
                  activeOpacity={0.8}
                >
                  <View style={[styles.checkbox, rememberMe && styles.checkboxActive]}>
                    {rememberMe && <Check size={12} color="#FFFFFF" strokeWidth={3} />}
                  </View>
                  <Text style={styles.rememberText}>Remember me</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    Alert.alert(
                      'Forgot Password',
                      'Password reset instructions have been sent to your registered contact.'
                    )
                  }
                  activeOpacity={0.7}
                >
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </TouchableOpacity>
              </View>

              {/* Primary Login Button */}
              <TouchableOpacity
                style={[styles.loginBtn, loading && { opacity: 0.7 }]}
                onPress={handleLogin}
                activeOpacity={0.88}
                disabled={loading}
              >
                <Text style={styles.loginBtnText}>{loading ? 'Verifying...' : 'Login'}</Text>
                <ArrowRight size={18} color="#FFFFFF" strokeWidth={2.5} style={styles.loginBtnIcon} />
              </TouchableOpacity>

              {/* OR Divider */}
              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>OR</Text>
                <View style={styles.dividerLine} />
              </View>

              {/* Continue with Google Button */}
              <TouchableOpacity
                style={styles.googleBtn}
                onPress={handleGoogleLogin}
                activeOpacity={0.88}
              >
                <GoogleIcon size={19} />
                <Text style={styles.googleBtnText}>Continue with Google</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bottom Feature Bar */}
          <View style={[styles.bottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
            {/* Glasses Icon Column */}
            <View style={styles.bottomIconCol}>
              <GlassesLogo width={44} height={19} color="#FFFFFF" />
            </View>

            <View style={styles.bottomDivider} />

            {/* Secure Login */}
            <View style={styles.bottomCol}>
              <ShieldCheck size={20} color="#34D399" strokeWidth={1.9} />
              <Text style={styles.bottomColTitle}>Secure</Text>
              <Text style={styles.bottomColSub}>Login</Text>
            </View>

            <View style={styles.bottomDivider} />

            {/* Fast Access */}
            <View style={styles.bottomCol}>
              <Timer size={20} color="#34D399" strokeWidth={1.9} />
              <Text style={styles.bottomColTitle}>Fast</Text>
              <Text style={styles.bottomColSub}>Access</Text>
            </View>

            <View style={styles.bottomDivider} />

            {/* Manage Your Shop */}
            <View style={styles.bottomCol}>
              <Settings size={20} color="#34D399" strokeWidth={1.9} />
              <Text style={styles.bottomColTitle}>Manage</Text>
              <Text style={styles.bottomColSub}>Your Shop</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Force Change Password Modal */}
      <Modal
        visible={showPasswordChangeModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => {}}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalOverlay}
        >
          <View style={styles.modalCard}>
            <View style={styles.modalHeader}>
              <View style={styles.modalIconBox}>
                <Lock size={24} color="#0D9488" />
              </View>
              <Text style={styles.modalTitle}>Set New Password</Text>
              <Text style={styles.modalSubtitle}>
                For security, please change your default password (11111111) to a secure new password.
              </Text>
            </View>

            <View style={{ gap: 14, marginVertical: 18 }}>
              <View>
                <Text style={styles.modalInputLabel}>New Password</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Enter your new password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  value={newPasswordInput}
                  onChangeText={setNewPasswordInput}
                />
              </View>

              <View>
                <Text style={styles.modalInputLabel}>Confirm New Password</Text>
                <TextInput
                  style={styles.modalInput}
                  placeholder="Confirm your new password"
                  placeholderTextColor="#94A3B8"
                  secureTextEntry
                  value={confirmPasswordInput}
                  onChangeText={setConfirmPasswordInput}
                />
              </View>
            </View>

            <TouchableOpacity
              style={[styles.modalSubmitBtn, changingPassword && { opacity: 0.7 }]}
              onPress={handleSaveNewPassword}
              disabled={changingPassword}
              activeOpacity={0.85}
            >
              <Text style={styles.modalSubmitBtnText}>
                {changingPassword ? 'Saving Password...' : 'Save Password & Continue'}
              </Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#04281B', // Deep forest green matching screenshot
  },
  keyboardView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
  },

  /* Hero Section */
  heroWrapper: {
    width: '100%',
    height: 335,
    overflow: 'hidden',
  },
  heroBackground: {
    width: '100%',
    height: 335,
  },
  heroImage: {
    width: '100%',
    height: 335,
  },
  brandContent: {
    flex: 1,
    paddingHorizontal: 24,
    alignItems: 'flex-start',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0A3925',
    letterSpacing: -0.3,
    marginTop: 6,
  },
  brandSubtitle: {
    fontSize: 9.5,
    fontWeight: '700',
    color: '#0A3925',
    letterSpacing: 1.6,
    marginTop: 2,
    marginBottom: 8,
  },
  taglineBox: {
    marginTop: 6,
  },
  taglineText: {
    fontSize: 13,
    color: '#1E293B',
    fontWeight: '500',
    lineHeight: 18,
  },
  taglineUnderline: {
    width: 26,
    height: 2.5,
    backgroundColor: '#0D9488',
    borderRadius: 2,
    marginVertical: 2.5,
  },

  /* Floating White Card */
  cardContainer: {
    paddingHorizontal: 18,
    marginTop: -38, // Seamless overlap over hero background
    zIndex: 10,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 22,
    paddingTop: 26,
    paddingBottom: 24,
    // Seamless clean appearance with zero harsh border
    borderWidth: 0,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.12,
    shadowRadius: 22,
    elevation: 8,
  },
  welcomeTitle: {
    fontSize: 25,
    fontWeight: '800',
    color: '#0A3925',
    letterSpacing: -0.3,
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 13.5,
    color: '#64748B',
    marginBottom: 20,
    fontWeight: '400',
  },

  /* Input fields */
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 14,
    paddingHorizontal: 14,
    height: 50,
    marginBottom: 13,
  },
  inputIconBox: {
    width: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  inputField: {
    flex: 1,
    fontSize: 14,
    color: '#0F172A',
    paddingVertical: 0,
  },
  eyeBtn: {
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Options Row */
  optionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 12,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 19,
    height: 19,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: '#CBD5E1',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  checkboxActive: {
    backgroundColor: '#0A4D34',
    borderColor: '#0A4D34',
  },
  rememberText: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  forgotText: {
    fontSize: 13,
    color: '#0A4D34',
    fontWeight: '600',
  },

  /* Buttons */
  loginBtn: {
    backgroundColor: '#0A4D34', // Rich optical forest green
    borderRadius: 14,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 4,
    shadowColor: '#0A4D34',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  loginBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  loginBtnIcon: {
    marginLeft: 8,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0',
  },
  dividerText: {
    marginHorizontal: 12,
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '700',
  },
  googleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    height: 48,
  },
  googleBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginLeft: 10,
  },

  /* Bottom Feature Bar */
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
    paddingHorizontal: 10,
    marginTop: 22,
  },
  bottomIconCol: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  bottomDivider: {
    width: 1,
    height: 26,
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  bottomCol: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 62,
  },
  bottomColTitle: {
    color: '#FFFFFF',
    fontSize: 10.5,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 13,
  },
  bottomColSub: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 10,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 12,
  },

  /* Modal Styles */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalCard: {
    width: '100%',
    maxWidth: 380,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    alignItems: 'center',
    textAlign: 'center',
  },
  modalIconBox: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: '#E6FFFA',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 6,
  },
  modalSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  modalInputLabel: {
    fontSize: 12.5,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#0F172A',
  },
  modalSubmitBtn: {
    backgroundColor: '#0D9488',
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  modalSubmitBtnText: {
    color: '#FFFFFF',
    fontSize: 14.5,
    fontWeight: '700',
  },
});
