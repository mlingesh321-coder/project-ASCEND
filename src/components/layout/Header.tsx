import { useState } from 'react';
import { Moon, Sun, Bell, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES: Record<string, string> = {
  '/': 'Dashboard',
  '/pillars': 'The 15 Pillars',
  '/calendar': '730-Day Calendar',
  '/analytics': 'Analytics',
  '/features': 'Features Hub',
  '/team': 'Team Mode',
  '/achievement': 'Final Achievement',
  '/settings': 'Settings',
};

export default function Header() {
  const { theme, setTheme, activeUser, setActiveUser, user1, user2 } = useStore();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentTitle = Object.entries(PAGE_TITLES).find(([path]) =>
    path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
  )?.[1] ?? 'FUTURE GOAL';

  const currentUser = activeUser === 'user1' ? user1 : user2;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      marginBottom: 28, paddingBottom: 20,
      borderBottom: '1px solid rgba(255,255,255,0.06)',
    }}>
      <div>
        <h1 style={{ fontSize: 22, fontWeight: 700, fontFamily: 'Space Grotesk' }}>{currentTitle}</h1>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Theme toggle */}
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)'
          }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
        </motion.button>

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'var(--bg-card)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: 'var(--text-secondary)', position: 'relative'
          }}
        >
          <Bell size={16} />
          <div style={{
            position: 'absolute', top: 8, right: 8, width: 7, height: 7,
            borderRadius: '50%', background: '#ef4444', border: '1.5px solid var(--bg-primary)'
          }} />
        </motion.button>

        {/* User switcher */}
        <div style={{ position: 'relative' }}>
          <motion.button
            whileHover={{ scale: 1.02 }}
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 12px 6px 8px',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, cursor: 'pointer', color: 'var(--text-primary)'
            }}
          >
            <div style={{ fontSize: 18 }}>{currentUser.avatar}</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 12, fontWeight: 600 }}>{currentUser.name}</div>
              <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Lv.{currentUser.level} • {currentUser.xp.toLocaleString()} XP</div>
            </div>
            <ChevronDown size={13} style={{ color: 'var(--text-muted)' }} />
          </motion.button>

          <AnimatePresence>
            {showUserMenu && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.95 }}
                style={{
                  position: 'absolute', right: 0, top: '110%',
                  background: 'rgba(13,18,32,0.95)', backdropFilter: 'blur(16px)',
                  border: '1px solid var(--border)', borderRadius: 12,
                  padding: 8, minWidth: 180, zIndex: 100,
                  boxShadow: '0 16px 40px rgba(0,0,0,0.4)'
                }}
              >
                {[user1, user2].map(u => (
                  <div
                    key={u.id}
                    onClick={() => { setActiveUser(u.id); setShowUserMenu(false); }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10,
                      padding: '9px 12px', borderRadius: 8, cursor: 'pointer',
                      background: activeUser === u.id ? 'rgba(59,130,246,0.12)' : 'transparent',
                      border: activeUser === u.id ? '1px solid rgba(59,130,246,0.2)' : '1px solid transparent',
                      transition: 'all 0.15s', marginBottom: 4
                    }}
                  >
                    <span style={{ fontSize: 18 }}>{u.avatar}</span>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)' }}>{u.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Level {u.level}</div>
                    </div>
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
