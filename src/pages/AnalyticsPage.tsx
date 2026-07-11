import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  AreaChart, Area, CartesianGrid, PieChart, Pie
} from 'recharts';

const CUSTOM_TOOLTIP_STYLE = {
  contentStyle: { background: 'rgba(13,18,32,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }
};

export default function AnalyticsPage() {
  const { user1, user2, activeUser, startDate } = useStore();
  const user = activeUser === 'user1' ? user1 : user2;

  const dayNum = Math.max(1, Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000) + 1);

  // Pillar progress data
  const pillarData = user.pillars.map(p => ({
    name: p.name.length > 12 ? p.name.substring(0, 12) + '…' : p.name,
    progress: p.progress,
    fill: p.color,
    topics: p.topics.length,
    done: p.topics.filter(t => t.completed).length,
  }));

  // Radar chart data (first 8 pillars)
  const radarData = user.pillars.slice(0, 8).map(p => ({
    subject: p.name.split(' ')[0],
    A: p.progress,
  }));

  // Study sessions by week (last 8 weeks simulated)
  const weeklyData = Array.from({ length: 8 }, (_, i) => ({
    week: `W${i + 1}`,
    hours: Math.random() * 20 + 5,
    problems: Math.floor(Math.random() * 15),
  }));



  // Completion stats
  const totalTopics = user.pillars.reduce((s, p) => s + p.topics.length, 0);
  const completedTopics = user.pillars.reduce((s, p) => s + p.topics.filter(t => t.completed).length, 0);
  const completedPillars = user.pillars.filter(p => p.completed).length;
  const overallPct = Math.round((completedTopics / totalTopics) * 100);

  // Pie data
  const pieData = [
    { name: 'Completed', value: completedTopics, fill: '#10b981' },
    { name: 'Remaining', value: totalTopics - completedTopics, fill: 'rgba(255,255,255,0.06)' }
  ];

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(139,92,246,0.1), rgba(59,130,246,0.1))',
          border: '1px solid rgba(139,92,246,0.2)', borderRadius: 20, padding: '16px 22px', marginBottom: 24
        }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Space Grotesk' }}>📊 Analytics Dashboard</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>Track your progress across all dimensions.</p>
      </motion.div>

      {/* Summary Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Day', value: dayNum, sub: 'of 730', color: '#3b82f6' },
          { label: 'Topics Done', value: completedTopics, sub: `of ${totalTopics} total`, color: '#10b981' },
          { label: 'Pillars Done', value: completedPillars, sub: 'of 15 pillars', color: '#8b5cf6' },
          { label: 'Overall %', value: `${overallPct}%`, sub: 'completion', color: '#f59e0b' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass" style={{ padding: '16px 18px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, fontWeight: 800, color: s.color, fontFamily: 'Space Grotesk' }}>{s.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 1 }}>{s.sub}</div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Pillar Progress Bar Chart */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🏔️ Pillar Progress</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pillarData} layout="vertical" margin={{ left: 0, right: 20 }}>
              <XAxis type="number" domain={[0, 100]} tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} axisLine={false} tickLine={false} width={90} />
              <Tooltip {...CUSTOM_TOOLTIP_STYLE} formatter={(v: any) => [`${v}%`, 'Progress']} />
              <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
                {pillarData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Radar */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🕸 Skill Radar</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
              <Radar name="Progress" dataKey="A" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Weekly activity */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📅 Weekly Study (Simulated)</h3>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="weekGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip {...CUSTOM_TOOLTIP_STYLE} formatter={(v: any) => [`${v.toFixed(1)}h`, 'Study Hours']} />
              <Area type="monotone" dataKey="hours" stroke="#8b5cf6" fill="url(#weekGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Topics Pie */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🎯 Topics Completion</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
            <ResponsiveContainer width={140} height={140}>
              <PieChart>
                <Pie data={pieData} dataKey="value" cx="50%" cy="50%" innerRadius={45} outerRadius={65} strokeWidth={0}>
                  {pieData.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div>
              <div style={{ fontSize: 36, fontWeight: 800, color: '#10b981', fontFamily: 'Space Grotesk' }}>{overallPct}%</div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                {completedTopics} of {totalTopics} topics
              </div>
              <div style={{ marginTop: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: '#10b981' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Completed ({completedTopics})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 3, background: 'rgba(255,255,255,0.1)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Remaining ({totalTopics - completedTopics})</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Detailed pillar table */}
      <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
        <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📋 Detailed Pillar Breakdown</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                {['Pillar', 'Status', 'Topics Done', 'Progress', 'XP Earned'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 12px', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {user.pillars.map(p => {
                const topicsDone = p.topics.filter(t => t.completed).length;
                const xpEarned = p.topics.filter(t => t.completed).reduce((s, t) => s + t.xp, 0);
                return (
                  <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '10px 12px', fontSize: 13 }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 16 }}>{p.emoji}</span>
                        <span>{p.name}</span>
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px' }}>
                      <span style={{
                        fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 600,
                        background: p.completed ? 'rgba(16,185,129,0.15)' : p.unlocked ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)',
                        color: p.completed ? '#10b981' : p.unlocked ? '#3b82f6' : 'var(--text-muted)',
                      }}>
                        {p.completed ? '✅ Done' : p.unlocked ? '🔓 Active' : '🔒 Locked'}
                      </span>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: 'var(--text-secondary)' }}>{topicsDone}/{p.topics.length}</td>
                    <td style={{ padding: '10px 12px', minWidth: 120 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <div style={{ flex: 1, height: 6, borderRadius: 3, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${p.progress}%`, background: p.color, borderRadius: 3 }} />
                        </div>
                        <span style={{ fontSize: 11, color: p.color, fontWeight: 600, minWidth: 32 }}>{p.progress}%</span>
                      </div>
                    </td>
                    <td style={{ padding: '10px 12px', fontSize: 13, color: '#8b5cf6', fontWeight: 600 }}>
                      {xpEarned.toLocaleString()} XP
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
