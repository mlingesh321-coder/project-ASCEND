import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Users, ArrowRight, Sparkles } from 'lucide-react';

interface OnboardingProps {
  onComplete: () => void;
}

export default function Onboarding({ onComplete }: OnboardingProps) {
  const { updateUserName, setActiveUser } = useStore();
  const [step, setStep] = useState<'login' | 'names'>('login');
  const [name1, setName1] = useState('');
  const [name2, setName2] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [googleUser, setGoogleUser] = useState<{ name: string; email: string; avatar: string } | null>(null);

  const handleGoogleLogin = () => {
    setLoggingIn(true);
    // Simulate Google OAuth popup (in production replace with Firebase)
    setTimeout(() => {
      setGoogleUser({ name: 'Student', email: 'student@gmail.com', avatar: 'https://ui-avatars.com/api/?name=Student&background=4285F4&color=fff' });
      setLoggingIn(false);
      setStep('names');
    }, 1800);
  };

  const handleGuestLogin = () => {
    setStep('names');
  };

  const handleFinish = () => {
    const n1 = name1.trim() || (googleUser?.name ?? 'User 1');
    const n2 = name2.trim() || 'User 2';
    updateUserName('user1', n1);
    updateUserName('user2', n2);
    setActiveUser('user1');
    onComplete();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'radial-gradient(ellipse at 30% 20%, rgba(59,130,246,0.15) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, rgba(139,92,246,0.15) 0%, transparent 60%), #070b18',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontFamily: 'Inter, sans-serif'
    }}>
      {/* Floating particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div key={i}
          animate={{ y: [-20, 20, -20], x: [-10, 10, -10], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 3 + i * 0.4, repeat: Infinity, delay: i * 0.3 }}
          style={{
            position: 'absolute',
            width: 4 + (i % 3) * 2, height: 4 + (i % 3) * 2,
            borderRadius: '50%',
            background: i % 3 === 0 ? '#3b82f6' : i % 3 === 1 ? '#8b5cf6' : '#f59e0b',
            left: `${(i * 8.5) % 95}%`, top: `${(i * 13) % 90}%`,
            opacity: 0.4
          }} />
      ))}

      <AnimatePresence mode="wait">
        {step === 'login' && (
          <motion.div
            key="login"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'rgba(13, 18, 32, 0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 28, padding: '48px 44px', maxWidth: 440, width: '90%',
              backdropFilter: 'blur(20px)',
              textAlign: 'center',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
            }}
          >
            {/* Logo */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 2.5, repeat: Infinity }}
              style={{ fontSize: 60, marginBottom: 16 }}
            >🚀</motion.div>

            <div style={{ marginBottom: 6, fontSize: 11, letterSpacing: 3, color: '#3b82f6', fontWeight: 700 }}>
              WELCOME TO
            </div>
            <h1 style={{
              fontSize: 32, fontWeight: 900, fontFamily: 'Space Grotesk',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #f59e0b)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              marginBottom: 6
            }}>
              FUTURE GOAL
            </h1>
            <div style={{ fontSize: 13, fontWeight: 600, color: '#8b5cf6', marginBottom: 6 }}>
              PROJECT ASCEND
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 36, lineHeight: 1.6 }}>
              Your 730-day AI & Data Science career journey.<br />
              From beginner to world-class engineer. 🏔️
            </p>

            {/* Google Login Button */}
            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(66,133,244,0.3)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleGoogleLogin}
              disabled={loggingIn}
              style={{
                width: '100%', padding: '14px 20px', borderRadius: 14, border: 'none',
                background: loggingIn ? 'rgba(66,133,244,0.3)' : 'white',
                cursor: loggingIn ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
                fontSize: 15, fontWeight: 600, color: '#333',
                marginBottom: 14, transition: 'all 0.3s',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              {loggingIn ? (
                <>
                  <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #4285F4', borderTopColor: 'transparent' }} />
                  Signing in...
                </>
              ) : (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </>
              )}
            </motion.button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)' }}>or</span>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>

            {/* Guest button */}
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleGuestLogin}
              style={{
                width: '100%', padding: '13px 20px', borderRadius: 14,
                background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                cursor: 'pointer', fontSize: 14, fontWeight: 600, color: 'rgba(255,255,255,0.7)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                fontFamily: 'Inter, sans-serif', transition: 'all 0.2s'
              }}
            >
              <Users size={16} /> Continue as Guest (Enter Names)
            </motion.button>

            <p style={{ marginTop: 20, fontSize: 11, color: 'rgba(255,255,255,0.25)', lineHeight: 1.5 }}>
              Data is saved locally in your browser. 🔒
            </p>
          </motion.div>
        )}

        {step === 'names' && (
          <motion.div
            key="names"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: -30 }}
            transition={{ duration: 0.5 }}
            style={{
              background: 'rgba(13, 18, 32, 0.9)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 28, padding: '40px 44px', maxWidth: 460, width: '90%',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 40px 100px rgba(0,0,0,0.6)'
            }}
          >
            {googleUser && (
              <div style={{
                background: 'rgba(66,133,244,0.1)', border: '1px solid rgba(66,133,244,0.25)',
                borderRadius: 12, padding: '10px 14px', marginBottom: 24,
                display: 'flex', alignItems: 'center', gap: 10, fontSize: 13
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span style={{ color: '#60a5fa' }}>✓ Signed in with Google</span>
              </div>
            )}

            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{ fontSize: 42, marginBottom: 10 }}>👥</div>
              <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: 6 }}>
                Set Up Your Team
              </h2>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6 }}>
                Enter your name and your study partner's name.<br />
                You'll climb this mountain together! 🏔️
              </p>
            </div>

            {/* Your name */}
            <div style={{ marginBottom: 18 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#3b82f6', display: 'block', marginBottom: 8 }}>
                🧑‍💻 Your Name
              </label>
              <input
                className="input"
                value={name1}
                onChange={e => setName1(e.target.value)}
                placeholder={googleUser?.name ?? 'Enter your name...'}
                autoFocus
                style={{ fontSize: 15, padding: '13px 16px' }}
                onKeyDown={e => e.key === 'Enter' && document.getElementById('name2input')?.focus()}
              />
            </div>

            {/* Friend's name */}
            <div style={{ marginBottom: 28 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: '#8b5cf6', display: 'block', marginBottom: 8 }}>
                👩‍💻 Your Friend's Name
              </label>
              <input
                id="name2input"
                className="input"
                value={name2}
                onChange={e => setName2(e.target.value)}
                placeholder="Enter your friend's name..."
                style={{ fontSize: 15, padding: '13px 16px' }}
                onKeyDown={e => e.key === 'Enter' && handleFinish()}
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.03, boxShadow: '0 8px 30px rgba(59,130,246,0.35)' }}
              whileTap={{ scale: 0.97 }}
              onClick={handleFinish}
              disabled={!name1.trim()}
              style={{
                width: '100%', padding: '15px 20px', borderRadius: 14, border: 'none',
                background: name1.trim() ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.06)',
                cursor: name1.trim() ? 'pointer' : 'not-allowed',
                fontSize: 16, fontWeight: 700, color: 'white',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                fontFamily: 'Inter, sans-serif', transition: 'all 0.3s'
              }}
            >
              <Sparkles size={18} />
              Begin Project ASCEND
              <ArrowRight size={18} />
            </motion.button>

            {!name1.trim() && (
              <p style={{ textAlign: 'center', fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 10 }}>
                Enter at least your name to continue
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
