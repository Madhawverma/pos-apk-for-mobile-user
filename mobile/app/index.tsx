import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  ImageBackground,
} from 'react-native';
import { useRouter } from 'expo-router';
import Svg, { Path, Rect, Circle, Defs, LinearGradient as SvgLinearGradient, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');

/**
 * Animated Metallic Gold Optical Spectacles Frame
 */
function AnimatedEyewearFrame({ scaleAnim, glowAnim }: { scaleAnim: Animated.Value; glowAnim: Animated.Value }) {
  return (
    <Animated.View
      style={{
        transform: [{ scale: scaleAnim }],
        shadowColor: '#F59E0B',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: glowAnim,
        shadowRadius: 28,
        elevation: 15,
      }}
    >
      <Svg width={140} height={60} viewBox="0 0 140 60" fill="none">
        <Defs>
          <SvgLinearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FDE68A" />
            <Stop offset="45%" stopColor="#D97706" />
            <Stop offset="80%" stopColor="#F59E0B" />
            <Stop offset="100%" stopColor="#B45309" />
          </SvgLinearGradient>
          <SvgLinearGradient id="lensShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.35" />
            <Stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.05" />
          </SvgLinearGradient>
        </Defs>

        {/* Left Lens Glass Glow */}
        <Rect x="8" y="8" width="52" height="44" rx="14" fill="url(#lensShine)" />
        {/* Right Lens Glass Glow */}
        <Rect x="80" y="8" width="52" height="44" rx="14" fill="url(#lensShine)" />

        {/* Left Eye Frame (Thick Luxury Gold Rim) */}
        <Rect x="8" y="8" width="52" height="44" rx="14" stroke="url(#goldGradient)" strokeWidth="4.5" />
        {/* Right Eye Frame */}
        <Rect x="80" y="8" width="52" height="44" rx="14" stroke="url(#goldGradient)" strokeWidth="4.5" />

        {/* Bridge (Nose bar joining lenses) */}
        <Path d="M60 22 C65 16, 75 16, 80 22" stroke="url(#goldGradient)" strokeWidth="4.5" strokeLinecap="round" />

        {/* Left Temple / Hinge Accent */}
        <Path d="M8 20 L2 20" stroke="url(#goldGradient)" strokeWidth="4" strokeLinecap="round" />
        {/* Right Temple / Hinge Accent */}
        <Path d="M132 20 L138 20" stroke="url(#goldGradient)" strokeWidth="4" strokeLinecap="round" />

        {/* Lens reflection shine lines */}
        <Path d="M18 16 L32 30" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
        <Path d="M90 16 L104 30" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.6" />
      </Svg>
    </Animated.View>
  );
}

/**
 * Lord Ganesha Crown Crest Outline
 */
function GaneshaCrownCrest() {
  return (
    <Svg width={48} height={42} viewBox="0 0 48 42" fill="none">
      <Defs>
        <SvgLinearGradient id="crownGold" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#FDE68A" />
          <Stop offset="100%" stopColor="#D97706" />
        </SvgLinearGradient>
      </Defs>
      {/* Crown / Mukut peaks */}
      <Path
        d="M24 2 L29 14 L38 8 L34 22 L14 22 L10 8 L19 14 Z"
        stroke="url(#crownGold)"
        strokeWidth="2.8"
        strokeLinejoin="round"
        fill="#B45309"
        fillOpacity="0.3"
      />
      {/* Red sacred Tilak */}
      <Circle cx="24" cy="28" r="3" fill="#DC2626" />
      {/* Trunk contour curve */}
      <Path d="M24 31 Q24 38 21 39 Q18 40 18 37" stroke="url(#crownGold)" strokeWidth="2.5" strokeLinecap="round" />
    </Svg>
  );
}

export default function SplashScreen() {
  const router = useRouter();

  // Animation values
  const frameScale = useRef(new Animated.Value(0.3)).current;
  const frameOpacity = useRef(new Animated.Value(0)).current;
  const frameRotate = useRef(new Animated.Value(-15)).current;
  const crestTranslateY = useRef(new Animated.Value(-30)).current;
  const crestOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;
  const textTranslateY = useRef(new Animated.Value(25)).current;
  const glowAnim = useRef(new Animated.Value(0.3)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Smooth orchestrated entrance sequence
    Animated.sequence([
      // Step A: Spectacles Frame springs in with slight rotation and glow
      Animated.parallel([
        Animated.spring(frameScale, {
          toValue: 1,
          friction: 6,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(frameOpacity, {
          toValue: 1,
          duration: 650,
          useNativeDriver: true,
        }),
        Animated.spring(frameRotate, {
          toValue: 0,
          friction: 6,
          useNativeDriver: true,
        }),
      ]),

      // Step B: Ganesha Crest slides gracefully down onto the frames
      Animated.parallel([
        Animated.spring(crestTranslateY, {
          toValue: 0,
          friction: 7,
          tension: 45,
          useNativeDriver: true,
        }),
        Animated.timing(crestOpacity, {
          toValue: 1,
          duration: 450,
          useNativeDriver: true,
        }),
      ]),

      // Step C: Luxury Brand Typography floats up with glowing reveal
      Animated.parallel([
        Animated.timing(textOpacity, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.spring(textTranslateY, {
          toValue: 0,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.loop(
          Animated.sequence([
            Animated.timing(glowAnim, { toValue: 0.85, duration: 900, useNativeDriver: false }),
            Animated.timing(glowAnim, { toValue: 0.35, duration: 900, useNativeDriver: false }),
          ])
        ),
      ]),
    ]).start();

    // 2. Continuous breathing pulse for spectacles
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 1100, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1.0, duration: 1100, useNativeDriver: true }),
      ])
    ).start();

    // 3. Seamless auto-transition to Login after 2.8 seconds
    const timer = setTimeout(() => {
      router.replace('/(auth)/login');
    }, 2800);

    return () => clearTimeout(timer);
  }, []);

  const spinInterpolation = frameRotate.interpolate({
    inputRange: [-15, 0],
    outputRange: ['-15deg', '0deg'],
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#021911" />

      {/* Luxury Background Decor with Ambient Wave Arc */}
      <View style={StyleSheet.absoluteFill}>
        <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
          <Defs>
            <SvgLinearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <Stop offset="0%" stopColor="#021C13" />
              <Stop offset="40%" stopColor="#04281B" />
              <Stop offset="85%" stopColor="#031E14" />
              <Stop offset="100%" stopColor="#01140D" />
            </SvgLinearGradient>
            <SvgLinearGradient id="arcGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <Stop offset="0%" stopColor="#D97706" stopOpacity="0.0" />
              <Stop offset="50%" stopColor="#F59E0B" stopOpacity="0.15" />
              <Stop offset="100%" stopColor="#D97706" stopOpacity="0.0" />
            </SvgLinearGradient>
          </Defs>

          <Rect width={width} height={height} fill="url(#bgGradient)" />
          {/* Subtle concentric decorative rings behind emblem */}
          <Circle cx={width / 2} cy={height * 0.42} r={130} stroke="url(#arcGlow)" strokeWidth={2} />
          <Circle cx={width / 2} cy={height * 0.42} r={170} stroke="url(#arcGlow)" strokeWidth={1} strokeDasharray="6 8" />
        </Svg>
      </View>

      {/* Center Emblem Container */}
      <View style={styles.centerContent}>
        {/* Lord Ganesha Crown Crest */}
        <Animated.View
          style={{
            opacity: crestOpacity,
            transform: [{ translateY: crestTranslateY }],
            marginBottom: -8,
            zIndex: 10,
          }}
        >
          <GaneshaCrownCrest />
        </Animated.View>

        {/* Animated Eyewear Frames with 3D Spring & Rotation */}
        <Animated.View
          style={{
            opacity: frameOpacity,
            transform: [{ scale: pulseAnim }, { rotate: spinInterpolation }],
          }}
        >
          <AnimatedEyewearFrame scaleAnim={frameScale} glowAnim={glowAnim} />
        </Animated.View>

        {/* Brand Name & Tagline */}
        <Animated.View
          style={{
            opacity: textOpacity,
            transform: [{ translateY: textTranslateY }],
            alignItems: 'center',
            marginTop: 26,
          }}
        >
          <Text style={styles.brandTitle}>SHREE GANESH</Text>
          <Text style={styles.brandSubtitle}>OPTICAL</Text>

          <View style={styles.goldDivider}>
            <View style={styles.dividerDot} />
            <View style={styles.dividerLine} />
            <View style={styles.dividerDot} />
          </View>

          <Text style={styles.tagline}>Complete Eye Care & Quality Eyewear</Text>
          <Text style={styles.location}>SEHORE (M.P.)</Text>
        </Animated.View>
      </View>

      {/* Bottom Minimalist Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>POW / POS SYSTEM • v1.0</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#021C13',
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
  },
  brandTitle: {
    fontSize: 27,
    fontWeight: '900',
    color: '#FDE68A',
    letterSpacing: 3.5,
    textAlign: 'center',
    textShadowColor: 'rgba(245, 158, 11, 0.45)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  brandSubtitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#F59E0B',
    letterSpacing: 9,
    textAlign: 'center',
    marginTop: 4,
  },
  goldDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 14,
    width: 140,
  },
  dividerLine: {
    flex: 1,
    height: 1.5,
    backgroundColor: '#D97706',
    opacity: 0.6,
  },
  dividerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#FDE68A',
    marginHorizontal: 4,
  },
  tagline: {
    fontSize: 12,
    fontWeight: '500',
    color: '#D1FAE5',
    letterSpacing: 0.8,
    textAlign: 'center',
    opacity: 0.88,
  },
  location: {
    fontSize: 10.5,
    fontWeight: '700',
    color: '#F59E0B',
    letterSpacing: 2.5,
    marginTop: 6,
    opacity: 0.85,
  },
  footer: {
    position: 'absolute',
    bottom: 28,
    alignItems: 'center',
  },
  footerText: {
    fontSize: 10,
    letterSpacing: 1.8,
    color: 'rgba(255, 255, 255, 0.3)',
    fontWeight: '600',
  },
});
