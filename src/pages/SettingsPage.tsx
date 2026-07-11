import { motion } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { Sun, Moon, User, Trash2, Download, Upload, RotateCcw, Calendar, Bell } from 'lucide-react';

export default function SettingsPage() {
  const { theme, setTheme, activeUser, user1, user2, updateUserName, startDate } = useStore();
  const user = activeUser === 'user1' ? user1 : user2;
  const [name1, setName1] = useState(user1.name);
  const [name2, setName2] = useState(user2.name);
  const { updateUserName: updateName } = useStore();

  const exportData = () => {
    const data = { user1, user2, startDate, exportedAt: new Date().toISOString() };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `future-goal-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (confirm('Are you sure? This will reset ALL progress for BOTH users. This cannot be undone.')) {
      localStorage.removeItem('future-goal-store');
      localStorage.removeItem('future-goal-memos');
      window.location.reload();
    }
  };

  const overallP1 = Math.round(user1.pillars.reduce((s, p) => s + p.progress, 0) / (user1.pillars.length * 100) * 100);
  const overallP2 = Math.round(user2.pillars.reduce((s, p) => s + p.progress, 0) / (user2.pillars.length * 100) * 100);

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(107,114,128,0.1), rgba(156,163,175,0.06))',
          border: '1px solid rgba(107,114,128,0.2)', borderRadius: 20, padding: '16px 22px', marginBottom: 24
        }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Space Grotesk' }}>⚙️ Settings</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>Configure your FUTURE GOAL experience.</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* User Profiles */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <User size={16} /> User Profiles
          </h3>

          {[
            { userId: 'user1' as const, user: user1, avatar: '🧑‍💻', name: name1, setName: setName1, color: '#3b82f6', progress: overallP1 },
            { userId: 'user2' as const, user: user2, avatar: '👩‍💻', name: name2, setName: setName2, color: '#8b5cf6', progress: overallP2 },
          ].map(u => (
            <div key={u.userId} style={{
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 12, padding: '14px 16px', marginBottom: 12
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                <div style={{ fontSize: 28 }}>{u.avatar}</div>
                <div>
                  <div style={{ fontSize: 11, color: u.color, fontWeight: 700 }}>
                    {u.userId === 'user1' ? 'PRIMARY USER' : 'STUDY PARTNER'}
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{u.user.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Level {u.user.level} · {u.user.xp.toLocaleString()} XP · {u.progress}%</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input" value={u.name} onChange={e => u.setName(e.target.value)}
                  placeholder={`Rename ${u.userId === 'user1' ? 'yourself' : 'your friend'}...`}
                  style={{ flex: 1, fontSize: 13, padding: '8px 12px' }} />
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                  onClick={() => updateName(u.userId, u.name)}
                  className="btn-primary" style={{ padding: '8px 14px', fontSize: 12 }}>
                  Save
                </motion.button>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Appearance */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🎨 Appearance</h3>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 10 }}>Theme</div>
            <div style={{ display: 'flex', gap: 10 }}>
              {[
                { value: 'dark', label: 'Dark Mode', icon: Moon, desc: 'Easy on the eyes' },
                { value: 'light', label: 'Light Mode', icon: Sun, desc: 'Classic look' },
              ].map(t => (
                <motion.div key={t.value} whileHover={{ scale: 1.02 }} onClick={() => setTheme(t.value as any)}
                  style={{
                    flex: 1, padding: '14px', borderRadius: 12, cursor: 'pointer',
                    background: theme === t.value ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.04)',
                    border: theme === t.value ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
                    textAlign: 'center', transition: 'all 0.2s'
                  }}>
                  <t.icon size={20} style={{ color: theme === t.value ? '#3b82f6' : 'var(--text-muted)', marginBottom: 6 }} />
                  <div style={{ fontSize: 13, fontWeight: 600, color: theme === t.value ? '#3b82f6' : 'var(--text-primary)' }}>{t.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{t.desc}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Journey start date info */}
          <div style={{
            background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.15)',
            borderRadius: 10, padding: '12px 14px', marginTop: 8
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
              <Calendar size={15} style={{ color: '#3b82f6' }} />
              <span style={{ fontWeight: 600 }}>Journey Start Date</span>
            </div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
              {new Date(startDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>
              Graduation: {new Date(new Date(startDate).getTime() + 730 * 86400000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </motion.div>

        {/* Data Management */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>💾 Data Management</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={exportData}
              style={{
                padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(16,185,129,0.25)',
                background: 'rgba(16,185,129,0.08)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10, color: '#10b981',
                fontFamily: 'Inter', fontSize: 13, fontWeight: 600
              }}>
              <Download size={16} />
              <div style={{ textAlign: 'left' }}>
                <div>Export Backup (JSON)</div>
                <div style={{ fontSize: 11, color: 'rgba(16,185,129,0.7)', fontWeight: 400 }}>Save all progress to a file</div>
              </div>
            </motion.button>

            <div style={{
              padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(59,130,246,0.2)',
              background: 'rgba(59,130,246,0.06)',
              display: 'flex', alignItems: 'center', gap: 10, color: '#3b82f6',
              fontSize: 13
            }}>
              <Bell size={16} />
              <div>
                <div style={{ fontWeight: 600 }}>Auto-saved locally</div>
                <div style={{ fontSize: 11, color: 'rgba(59,130,246,0.7)' }}>All progress is saved automatically</div>
              </div>
            </div>

            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              onClick={clearData}
              style={{
                padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(239,68,68,0.25)',
                background: 'rgba(239,68,68,0.08)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: 10, color: '#ef4444',
                fontFamily: 'Inter', fontSize: 13, fontWeight: 600
              }}>
              <Trash2 size={16} />
              <div style={{ textAlign: 'left' }}>
                <div>Reset All Progress</div>
                <div style={{ fontSize: 11, color: 'rgba(239,68,68,0.7)', fontWeight: 400 }}>⚠️ This cannot be undone</div>
              </div>
            </motion.button>
          </div>
        </motion.div>

        {/* About */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>ℹ️ About FUTURE GOAL</h3>

          <div style={{ textAlign: 'center', padding: '10px 0 20px' }}>
            <div style={{ fontSize: 48, marginBottom: 10 }}>🚀</div>
            <div style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: 4 }}
              className="gradient-text">FUTURE GOAL</div>
            <div style={{ fontSize: 12, color: '#8b5cf6', fontWeight: 600, marginBottom: 12 }}>PROJECT ASCEND v1.0</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
              A 730-day AI & Data Science career tracker designed to transform beginners into
              world-class AI engineers capable of landing high-salary international jobs.
            </div>
          </div>

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 16 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
              {[
                { label: '15 Pillars', value: 'Complete curriculum' },
                { label: '730 Days', value: '2-year journey' },
                { label: '2 Users', value: 'Team mode' },
                { label: 'Offline', value: 'Works anywhere' },
              ].map(s => (
                <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-primary)' }}>{s.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
