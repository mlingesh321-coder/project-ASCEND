import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Lock, CheckCircle, ChevronRight } from 'lucide-react';

export default function PillarsPage() {
  const { user1, user2, activeUser } = useStore();
  const user = activeUser === 'user1' ? user1 : user2;
  const navigate = useNavigate();

  return (
    <div>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
          border: '1px solid rgba(59,130,246,0.2)', borderRadius: 20, padding: '20px 24px', marginBottom: 28
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: 4 }}>🏔️ The 15 Pillars of ASCEND</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
              Complete each pillar to unlock the next. Your mountain awaits.
            </p>
          </div>
          <div style={{ display: 'flex', gap: 16 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#10b981' }}>
                {user.pillars.filter(p => p.completed).length}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Complete</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#3b82f6' }}>
                {user.pillars.filter(p => p.unlocked && !p.completed).length}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>In Progress</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--text-muted)' }}>
                {user.pillars.filter(p => !p.unlocked).length}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Locked</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Pillar Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 16 }}>
        {user.pillars.map((pillar, i) => (
          <motion.div
            key={pillar.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
            className={`pillar-tower ${!pillar.unlocked ? 'locked' : ''}`}
            style={{
              background: `linear-gradient(135deg, ${pillar.gradientFrom}60 0%, ${pillar.gradientTo}15 100%)`,
              border: `1px solid ${pillar.color}${pillar.completed ? '60' : pillar.unlocked ? '30' : '15'}`,
              boxShadow: pillar.completed
                ? `0 0 20px ${pillar.color}30, 0 0 40px ${pillar.color}15`
                : pillar.unlocked
                ? `0 0 10px ${pillar.color}15`
                : 'none'
            }}
            onClick={() => pillar.unlocked && navigate(`/pillars/${pillar.id}`)}
          >
            {/* Completed badge */}
            {pillar.completed && (
              <div style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)',
                borderRadius: 99, padding: '2px 8px', fontSize: 11, fontWeight: 600, color: '#10b981',
                display: 'flex', alignItems: 'center', gap: 4
              }}>
                <CheckCircle size={11} /> Done
              </div>
            )}
            {!pillar.unlocked && (
              <div style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(255,255,255,0.05)', borderRadius: 99,
                padding: '2px 8px', fontSize: 11, color: 'var(--text-muted)',
                display: 'flex', alignItems: 'center', gap: 4
              }}>
                <Lock size={11} /> Locked
              </div>
            )}

            {/* Icon + Name */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
              <div style={{
                width: 46, height: 46, borderRadius: 14,
                background: `${pillar.color}20`,
                border: `1.5px solid ${pillar.color}40`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22,
                boxShadow: pillar.unlocked ? `0 0 12px ${pillar.color}30` : 'none'
              }}>
                {pillar.emoji}
              </div>
              <div>
                <div style={{ fontSize: 11, color: pillar.color, fontWeight: 600, letterSpacing: 0.5 }}>
                  PILLAR {pillar.id}
                </div>
                <div style={{ fontSize: 15, fontWeight: 700, fontFamily: 'Space Grotesk' }}>
                  {pillar.name}
                </div>
              </div>
            </div>

            <p style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 14, lineHeight: 1.5 }}>
              {pillar.description}
            </p>

            {/* Topics count */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14 }}>
              {pillar.topics.slice(0, 4).map(t => (
                <span key={t.id} style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 99,
                  background: t.completed ? `${pillar.color}20` : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${t.completed ? pillar.color + '40' : 'rgba(255,255,255,0.08)'}`,
                  color: t.completed ? pillar.color : 'var(--text-muted)',
                  fontWeight: 500
                }}>
                  {t.completed ? '✓' : '·'} {t.name.split(' ')[0]}
                </span>
              ))}
              {pillar.topics.length > 4 && (
                <span style={{ fontSize: 10, padding: '2px 8px', borderRadius: 99, background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
                  +{pillar.topics.length - 4} more
                </span>
              )}
            </div>

            {/* Progress bar */}
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                <span>{pillar.topics.filter(t => t.completed).length}/{pillar.topics.length} topics</span>
                <span style={{ color: pillar.color, fontWeight: 600 }}>{pillar.progress}%</span>
              </div>
              <div className="xp-bar">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${pillar.progress}%` }}
                  transition={{ duration: 0.8, delay: i * 0.04 }}
                  style={{ height: '100%', borderRadius: 4, background: `linear-gradient(90deg, ${pillar.gradientFrom}, ${pillar.color})` }}
                />
              </div>
            </div>

            {/* Achievement & navigate */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
              <div style={{ fontSize: 11, color: pillar.color, fontWeight: 600 }}>
                🏅 {pillar.achievementTitle}
              </div>
              {pillar.unlocked && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: pillar.color, fontWeight: 600 }}>
                  {pillar.completed ? 'Revisit' : 'Continue'} <ChevronRight size={13} />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
