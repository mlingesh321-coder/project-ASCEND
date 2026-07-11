import { motion } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { ArrowUp, ArrowDown, Minus } from 'lucide-react';

export default function TeamPage() {
  const { user1, user2, setActiveUser, activeUser, updateUserName } = useStore();
  const [editingName, setEditingName] = useState<'user1' | 'user2' | null>(null);
  const [nameInput, setNameInput] = useState('');

  const overallPct = (u: typeof user1) =>
    Math.round(u.pillars.reduce((s, p) => s + p.progress, 0) / (u.pillars.length * 100) * 100);

  const p1 = overallPct(user1);
  const p2 = overallPct(user2);
  const leader = p1 > p2 ? 'user1' : p2 > p1 ? 'user2' : null;

  // Comparison data
  const comparisonData = user1.pillars.map((p, i) => ({
    name: p.name.split(' ')[0],
    [user1.name]: p.progress,
    [user2.name]: user2.pillars[i]?.progress ?? 0,
    color: p.color,
  }));

  // Radar
  const radarData = user1.pillars.slice(0, 8).map((p, i) => ({
    subject: p.name.split(' ')[0],
    [user1.name]: p.progress,
    [user2.name]: user2.pillars[i]?.progress ?? 0,
  }));

  const UserCard = ({ user, userId }: { user: typeof user1; userId: 'user1' | 'user2' }) => {
    const pct = overallPct(user);
    const isLeading = leader === userId;
    const isActive = activeUser === userId;

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass"
        style={{
          padding: 22, flex: 1,
          border: isActive ? '1px solid rgba(59,130,246,0.4)' : '1px solid rgba(255,255,255,0.08)',
          boxShadow: isActive ? '0 0 20px rgba(59,130,246,0.1)' : 'none',
          position: 'relative'
        }}
      >
        {isLeading && (
          <div style={{
            position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
            color: '#000', fontSize: 11, fontWeight: 800, padding: '3px 12px', borderRadius: 99
          }}>👑 LEADING</div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <div style={{ fontSize: 36 }}>{user.avatar}</div>
          <div style={{ flex: 1 }}>
            {editingName === userId ? (
              <div style={{ display: 'flex', gap: 6 }}>
                <input className="input" value={nameInput} onChange={e => setNameInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { updateUserName(userId, nameInput); setEditingName(null); } }}
                  style={{ fontSize: 13, padding: '5px 10px' }} autoFocus />
                <button className="btn-primary" onClick={() => { updateUserName(userId, nameInput); setEditingName(null); }}
                  style={{ padding: '5px 10px', fontSize: 12 }}>Save</button>
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16, fontWeight: 700 }}>{user.name}</span>
                <button onClick={() => { setEditingName(userId); setNameInput(user.name); }}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', fontSize: 12 }}>✏️</button>
              </div>
            )}
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Level {user.level} • {user.xp.toLocaleString()} XP</div>
          </div>
          <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
            onClick={() => setActiveUser(userId)}
            style={{
              padding: '6px 14px', borderRadius: 8, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
              background: isActive ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.06)',
              color: isActive ? '#3b82f6' : 'var(--text-secondary)',
              border: isActive ? '1px solid rgba(59,130,246,0.3)' : '1px solid transparent'
            }}>
            {isActive ? '✓ Active' : 'Switch'}
          </motion.button>
        </div>

        {/* Big progress ring */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
          <div style={{ position: 'relative', flexShrink: 0 }}>
            <svg width={80} height={80}>
              <circle cx={40} cy={40} r={33} stroke="rgba(255,255,255,0.06)" strokeWidth={7} fill="none" />
              <circle cx={40} cy={40} r={33} stroke="#3b82f6" strokeWidth={7} fill="none"
                strokeDasharray={2 * Math.PI * 33}
                strokeDashoffset={2 * Math.PI * 33 * (1 - pct / 100)}
                strokeLinecap="round"
                style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1s ease' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, fontWeight: 800, color: '#3b82f6' }}>
              {pct}%
            </div>
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { l: 'Pillars', v: `${user.pillars.filter(p => p.completed).length}/15` },
              { l: 'Streak', v: `${user.streak}🔥` },
              { l: 'Hours', v: `${user.studyHours}h` },
              { l: 'Projects', v: user.projects.length },
            ].map(s => (
              <div key={s.l} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 8, padding: '8px 10px' }}>
                <div style={{ fontSize: 14, fontWeight: 700 }}>{s.v}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar mini bars */}
        <div>
          {user.pillars.map(p => (
            <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', width: 14 }}>{p.emoji}</span>
              <div style={{ flex: 1, height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${p.progress}%`, background: p.color, borderRadius: 3, transition: 'width 0.8s ease' }} />
              </div>
              <span style={{ fontSize: 10, color: p.color, fontWeight: 600, width: 28, textAlign: 'right' }}>{p.progress}%</span>
            </div>
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(251,191,36,0.08))',
          border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, padding: '16px 22px', marginBottom: 24
        }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Space Grotesk' }}>👥 Team Mode – Shared Journey</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
          Two students, one mission: become world-class AI engineers!
        </p>
      </motion.div>

      {/* User Cards */}
      <div style={{ display: 'flex', gap: 20, marginBottom: 24, flexWrap: 'wrap' }}>
        <UserCard user={user1} userId="user1" />
        <UserCard user={user2} userId="user2" />
      </div>

      {/* Leaderboard Banner */}
      <motion.div className="glass" style={{ padding: 20, marginBottom: 24, textAlign: 'center' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 24 }}>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#3b82f6', fontFamily: 'Space Grotesk' }}>{p1}%</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user1.name}</div>
          </div>
          <div style={{ fontSize: 24, color: 'var(--text-muted)', fontWeight: 800 }}>VS</div>
          <div>
            <div style={{ fontSize: 28, fontWeight: 900, color: '#8b5cf6', fontFamily: 'Space Grotesk' }}>{p2}%</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>{user2.name}</div>
          </div>
        </div>
        <div style={{ marginTop: 12, height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden', position: 'relative' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${p1}%` }}
            transition={{ duration: 1 }}
            style={{ height: '100%', background: '#3b82f6', borderRadius: 5 }}
          />
          {p2 > 0 && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${p2}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                position: 'absolute', top: 0, right: 0, height: '100%',
                background: '#8b5cf6', borderRadius: 5
              }}
            />
          )}
        </div>
        <div style={{ marginTop: 6, fontSize: 12, color: 'var(--text-muted)' }}>
          {leader ? `${leader === 'user1' ? user1.name : user2.name} is leading by ${Math.abs(p1 - p2)}%` : 'It\'s a tie! Keep pushing!'}
        </div>
      </motion.div>

      {/* Head-to-Head Pillar Comparison */}
      <motion.div className="glass" style={{ padding: 22, marginBottom: 20 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📊 Head-to-Head: Pillar Progress</h3>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={comparisonData}>
            <XAxis dataKey="name" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <YAxis domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ background: 'rgba(13,18,32,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
              formatter={(v: any) => [`${v}%`, '']} />
            <Bar dataKey={user1.name} fill="#3b82f6" radius={[4, 4, 0, 0]} />
            <Bar dataKey={user2.name} fill="#8b5cf6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
        <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 8 }}>
          {[{ name: user1.name, color: '#3b82f6' }, { name: user2.name, color: '#8b5cf6' }].map(l => (
            <div key={l.name} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
              <div style={{ width: 12, height: 12, borderRadius: 3, background: l.color }} />
              {l.name}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
