import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, Layers, Calendar, BarChart3, Zap, Users,
  Trophy, Settings, Rocket, ChevronRight, FileText
} from 'lucide-react';
import { useStore } from '../../store/useStore';

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/pillars', icon: Layers, label: 'Pillars' },
  { to: '/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/features', icon: Zap, label: 'Features' },
  { to: '/memo', icon: FileText, label: 'Memo & Notes' },
  { to: '/team', icon: Users, label: 'Team Mode' },
  { to: '/achievement', icon: Trophy, label: 'Achievement' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  const { user1, user2, activeUser, startDate } = useStore();
  const user = activeUser === 'user1' ? user1 : user2;
  const location = useLocation();

  const dayNum = Math.max(1, Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000) + 1);
  const totalXP = user.xp;
  const overallProgress = Math.round(
    user.pillars.reduce((sum, p) => sum + p.progress, 0) / (user.pillars.length * 100) * 100
  );

  return (
    <div className="sidebar">
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18, boxShadow: '0 0 16px rgba(59,130,246,0.4)'
          }}>🚀</div>
          <div>
            <div style={{ fontFamily: 'Space Grotesk', fontWeight: 700, fontSize: 14, letterSpacing: 0.5 }}>FUTURE GOAL</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', letterSpacing: 1 }}>PROJECT ASCEND</div>
          </div>
        </div>

        {/* User card */}
        <div style={{
          background: 'rgba(255,255,255,0.04)', borderRadius: 12, padding: '10px 12px',
          border: '1px solid rgba(255,255,255,0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <div style={{ fontSize: 22 }}>{user.avatar}</div>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13 }}>{user.name}</div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Level {user.level} • Day {dayNum}/730</div>
            </div>
          </div>
          <div className="xp-bar">
            <div className="xp-bar-fill" style={{ width: `${Math.min(100, overallProgress)}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4, fontSize: 11, color: 'var(--text-muted)' }}>
            <span>{totalXP.toLocaleString()} XP</span>
            <span>{overallProgress}% Complete</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        <div style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: 1.5, padding: '8px 10px 4px' }}>
          NAVIGATION
        </div>
        {navItems.map(({ to, icon: Icon, label }) => {
          const isActive = to === '/' ? location.pathname === '/' : location.pathname.startsWith(to);
          return (
            <NavLink key={to} to={to} style={{ textDecoration: 'none' }}>
              <motion.div
                whileHover={{ x: 3 }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '10px 10px', borderRadius: 10, marginBottom: 2,
                  background: isActive ? 'rgba(59,130,246,0.15)' : 'transparent',
                  border: isActive ? '1px solid rgba(59,130,246,0.25)' : '1px solid transparent',
                  color: isActive ? '#3b82f6' : 'var(--text-secondary)',
                  fontSize: 14, fontWeight: isActive ? 600 : 400,
                  transition: 'all 0.2s', cursor: 'pointer',
                }}
              >
                <Icon size={17} />
                <span style={{ flex: 1 }}>{label}</span>
                {isActive && <ChevronRight size={13} />}
              </motion.div>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom streak */}
      <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span className="flame" style={{ fontSize: 20 }}>🔥</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user.streak} Day Streak</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Keep it up!</div>
          </div>
        </div>
      </div>

      {/* Rocket destination */}
      <div style={{ padding: '0 20px 20px' }}>
        <div style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(251,191,36,0.06))',
          border: '1px solid rgba(245,158,11,0.25)',
          borderRadius: 12, padding: '10px 12px',
          display: 'flex', alignItems: 'center', gap: 8
        }}>
          <Rocket size={16} style={{ color: '#f59e0b' }} />
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>DESTINATION</div>
            <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginTop: 1 }}>High Salary Int'l Job 🏆</div>
          </div>
        </div>
      </div>
    </div>
  );
}
