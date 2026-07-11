import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useNavigate } from 'react-router-dom';
import {
  Flame, Zap, Star, Clock, BookOpen, Target, TrendingUp,
  Award, Calendar, ChevronRight, Trophy, Rocket, ArrowRight
} from 'lucide-react';
import { XP_LEVELS_TABLE } from '../store/useStore';
import { RadialBarChart, RadialBar, ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

function StatCard({ icon: Icon, label, value, sub, color, delay = 0 }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      className="glass"
      style={{ padding: '18px 20px', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: -10, right: -10, width: 60, height: 60, borderRadius: '50%', background: `${color}15` }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{ width: 34, height: 34, borderRadius: 9, background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Icon size={17} style={{ color }} />
        </div>
        <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 500 }}>{label}</span>
      </div>
      <div style={{ fontSize: 26, fontWeight: 800, fontFamily: 'Space Grotesk', color: 'var(--text-primary)' }}>{value}</div>
      {sub && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{sub}</div>}
    </motion.div>
  );
}

function ProgressRing({ progress, size = 80, strokeWidth = 7, color }: any) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.08)" strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={radius}
        stroke={color} strokeWidth={strokeWidth} fill="none"
        strokeDasharray={circumference} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 1.2s ease' }}
      />
    </svg>
  );
}

export default function Dashboard() {
  const { user1, user2, activeUser, startDate } = useStore();
  const user = activeUser === 'user1' ? user1 : user2;
  const navigate = useNavigate();

  const dayNum = Math.max(1, Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000) + 1);
  const weekNum = Math.ceil(dayNum / 7);
  const monthNum = Math.ceil(dayNum / 30);
  const daysLeft = Math.max(0, 730 - dayNum);

  const overallProgress = Math.round(
    user.pillars.reduce((sum, p) => sum + p.progress, 0) / (user.pillars.length * 100) * 100
  );
  const completedPillars = user.pillars.filter(p => p.completed).length;
  const currentPillar = user.pillars.find(p => !p.completed && p.unlocked);
  const nextMilestone = user.pillars.find(p => !p.completed);

  // XP level info
  const currentLevelXP = XP_LEVELS_TABLE[user.level] ?? 0;
  const nextLevelXP = XP_LEVELS_TABLE[user.level + 1] ?? currentLevelXP + 5000;
  const xpInLevel = user.xp - currentLevelXP;
  const xpForNext = nextLevelXP - currentLevelXP;
  const xpPercent = Math.round((xpInLevel / xpForNext) * 100);

  const levelTitles: Record<number, string> = {
    0: 'Newcomer', 1: 'Beginner', 2: 'Explorer', 3: 'Learner', 4: 'Student',
    5: 'Practitioner', 8: 'Developer', 10: 'Engineer', 15: 'Senior Dev',
    20: 'Expert', 25: 'World-Class AI Engineer'
  };
  const levelTitle = Object.entries(levelTitles).reverse().find(([l]) => user.level >= Number(l))?.[1] ?? 'Newcomer';

  // Chart data for last 7 days (simulated for now)
  const chartData = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i));
    return { day: d.toLocaleDateString('en', { weekday: 'short' }), hours: Math.random() * 4 + 0.5 };
  });

  const pillarProgressData = user.pillars.slice(0, 8).map(p => ({
    name: p.name.substring(0, 10),
    value: p.progress, fill: p.color
  }));

  return (
    <div>
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.12) 0%, rgba(139,92,246,0.12) 50%, rgba(245,158,11,0.08) 100%)',
          border: '1px solid rgba(59,130,246,0.2)',
          borderRadius: 20, padding: '24px 28px',
          marginBottom: 24, position: 'relative', overflow: 'hidden'
        }}
      >
        <div style={{
          position: 'absolute', top: -40, right: -40, width: 180, height: 180,
          borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)'
        }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 4, letterSpacing: 1, fontWeight: 600 }}>
              🚀 PROJECT ASCEND · FUTURE GOAL
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: 6 }}>
              Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, {user.name}! 👋
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)' }}>
              Day <strong style={{ color: 'white' }}>{dayNum}</strong> of 730 •
              <strong style={{ color: '#f59e0b' }}> {daysLeft} days</strong> until graduation •
              Keep climbing! 🏔️
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <ProgressRing progress={overallProgress} size={90} strokeWidth={8} color="#3b82f6" />
              <div style={{ marginTop: -70, fontSize: 16, fontWeight: 800, textAlign: 'center' }}>{overallProgress}%</div>
              <div style={{ marginTop: 36, fontSize: 11, color: 'var(--text-muted)' }}>Overall</div>
            </div>
            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/pillars')}
              className="btn-primary"
              style={{ display: 'flex', alignItems: 'center', gap: 8 }}
            >
              Continue Journey <ArrowRight size={15} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 14, marginBottom: 24 }}>
        <StatCard icon={Calendar} label="Current Day" value={`Day ${dayNum}`} sub={`Week ${weekNum} · Month ${monthNum}`} color="#3b82f6" delay={0.05} />
        <StatCard icon={Zap} label="XP Points" value={user.xp.toLocaleString()} sub={`Level ${user.level} · ${levelTitle}`} color="#8b5cf6" delay={0.1} />
        <StatCard icon={Flame} label="Study Streak" value={`${user.streak}🔥`} sub="Days in a row" color="#f97316" delay={0.15} />
        <StatCard icon={Clock} label="Study Hours" value={`${user.studyHours}h`} sub="Total logged" color="#10b981" delay={0.2} />
        <StatCard icon={BookOpen} label="Pillars Done" value={`${completedPillars}/15`} sub="Pillars completed" color="#f59e0b" delay={0.25} />
        <StatCard icon={Star} label="Overall Progress" value={`${overallProgress}%`} sub={`${730 - dayNum} days remaining`} color="#ec4899" delay={0.3} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        {/* XP Level Card */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700 }}>⚡ Level Progress</h3>
            <span className="badge" style={{ background: 'rgba(139,92,246,0.15)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.3)' }}>
              Level {user.level}
            </span>
          </div>
          <div style={{ textAlign: 'center', marginBottom: 14 }}>
            <div style={{ fontSize: 36, marginBottom: 4 }}>
              {user.level < 5 ? '🌱' : user.level < 10 ? '🌿' : user.level < 15 ? '⚡' : user.level < 20 ? '🚀' : '🏆'}
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, fontFamily: 'Space Grotesk' }}>{levelTitle}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {xpInLevel.toLocaleString()} / {xpForNext.toLocaleString()} XP to next level
            </div>
          </div>
          <div className="xp-bar" style={{ height: 10 }}>
            <div className="xp-bar-fill" style={{ width: `${xpPercent}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
            <span>Lv. {user.level}</span>
            <span>{xpPercent}%</span>
            <span>Lv. {user.level + 1}</span>
          </div>
        </motion.div>

        {/* Current Focus */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🎯 Current Focus</h3>
          {currentPillar ? (
            <div>
              <div style={{
                background: `linear-gradient(135deg, ${currentPillar.gradientFrom}40, ${currentPillar.gradientTo}20)`,
                border: `1px solid ${currentPillar.color}30`,
                borderRadius: 12, padding: 14, marginBottom: 12
              }}>
                <div style={{ fontSize: 20, marginBottom: 6 }}>{currentPillar.emoji}</div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Pillar {currentPillar.id}: {currentPillar.name}</div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 3 }}>{currentPillar.description}</div>
                <div style={{ marginTop: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 5 }}>
                    <span style={{ color: 'var(--text-muted)' }}>Progress</span>
                    <span style={{ color: currentPillar.color, fontWeight: 600 }}>{currentPillar.progress}%</span>
                  </div>
                  <div className="xp-bar">
                    <div style={{ height: '100%', borderRadius: 4, width: `${currentPillar.progress}%`, background: `linear-gradient(90deg, ${currentPillar.gradientFrom}, ${currentPillar.color})`, transition: 'width 0.8s ease' }} />
                  </div>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/pillars/${currentPillar.id}`)}
                className="btn-primary"
                style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
              >
                Continue Pillar {currentPillar.id} <ChevronRight size={15} />
              </motion.button>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 40, marginBottom: 10 }}>🏆</div>
              <div style={{ fontWeight: 700, color: '#f59e0b' }}>All Pillars Complete!</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>You're ready for the final achievement!</div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Mountain Roadmap */}
      <motion.div
        className="glass"
        style={{ padding: 24, marginBottom: 24 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.45 }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700 }}>🏔️ Ascent Roadmap</h3>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Beginner → Professional → World-Class</span>
        </div>

        {/* Roadmap Track */}
        <div style={{ position: 'relative' }}>
          {/* Track line */}
          <div style={{
            position: 'absolute', top: '50%', left: 0, right: 0, height: 3,
            background: 'rgba(255,255,255,0.06)', borderRadius: 2, zIndex: 0
          }}>
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${overallProgress}%` }}
              transition={{ duration: 1.5, ease: 'easeOut' }}
              style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b)', borderRadius: 2 }}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'relative', zIndex: 1 }}>
            {[
              { label: 'START', icon: '🌱', desc: 'Beginner', at: 0 },
              { label: 'FOUNDATION', icon: '🏗️', desc: 'Pillars 1-4', at: 27 },
              { label: 'ENGINEER', icon: '⚡', desc: 'Pillars 5-9', at: 60 },
              { label: 'EXPERT', icon: '🚀', desc: 'Pillars 10-13', at: 87 },
              { label: 'JOB', icon: '🏆', desc: 'Dream Offer', at: 100 },
            ].map((milestone, i) => {
              const reached = overallProgress >= milestone.at;
              return (
                <div key={i} style={{ textAlign: 'center', flex: i === 0 || i === 4 ? '0 0 auto' : 1 }}>
                  <motion.div
                    animate={reached ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.5 }}
                    style={{
                      width: 44, height: 44, borderRadius: '50%', margin: '0 auto 8px',
                      background: reached
                        ? `linear-gradient(135deg, #3b82f6, #8b5cf6)`
                        : 'rgba(255,255,255,0.06)',
                      border: reached ? '2px solid rgba(59,130,246,0.5)' : '2px solid rgba(255,255,255,0.1)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 20,
                      boxShadow: reached ? '0 0 16px rgba(59,130,246,0.4)' : 'none',
                      transition: 'all 0.5s ease'
                    }}
                  >
                    {milestone.icon}
                  </motion.div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: reached ? 'white' : 'var(--text-muted)', letterSpacing: 0.5 }}>
                    {milestone.label}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{milestone.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Study Chart + Achievements */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* Study Hours Chart */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>📊 Study Activity (7 Days)</h3>
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <Tooltip
                contentStyle={{ background: 'rgba(13,18,32,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, fontSize: 12 }}
                formatter={(v: any) => [`${v.toFixed(1)}h`, 'Study Hours']}
              />
              <Area type="monotone" dataKey="hours" stroke="#3b82f6" fill="url(#areaGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Recent Achievements */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.55 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🏅 Achievements</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {user.pillars.filter(p => p.completed).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🔓</div>
                Complete your first pillar to earn achievements!
              </div>
            ) : (
              user.pillars.filter(p => p.completed).map(p => (
                <div key={p.id} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  background: `${p.color}12`, border: `1px solid ${p.color}25`,
                  borderRadius: 10, padding: '10px 12px'
                }}>
                  <div style={{ fontSize: 20 }}>🏅</div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: p.color }}>{p.achievementTitle}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pillar {p.id} Complete!</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>

      {/* Final Goal Banner */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{
          marginTop: 24,
          background: 'linear-gradient(135deg, rgba(245,158,11,0.12), rgba(251,191,36,0.08))',
          border: '1px solid rgba(245,158,11,0.3)',
          borderRadius: 20, padding: '20px 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontSize: 40 }} className="animate-float">🏆</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 16, fontFamily: 'Space Grotesk' }} className="gradient-text-gold">
              FINAL DESTINATION
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
              High Salary International Job Offer — AI / ML / Data Scientist
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#f59e0b', fontFamily: 'Space Grotesk' }}>{completedPillars}/15</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pillars Done</div>
          </div>
          <div style={{ width: 1, height: 36, background: 'rgba(255,255,255,0.1)' }} />
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#f59e0b', fontFamily: 'Space Grotesk' }}>{daysLeft}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Days Left</div>
          </div>
          <motion.button
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/achievement')}
            style={{
              background: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
              border: 'none', borderRadius: 10, padding: '10px 18px',
              color: '#000', fontWeight: 700, fontSize: 13, cursor: 'pointer',
              display: 'flex', alignItems: 'center', gap: 6
            }}
          >
            View Goal <Trophy size={14} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
