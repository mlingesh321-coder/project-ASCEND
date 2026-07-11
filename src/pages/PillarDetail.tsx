import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useStore } from '../store/useStore';
import { ArrowLeft, CheckCircle, Circle, ChevronDown, ChevronUp, Zap, Lock, Star, BookOpen, Edit3, Save } from 'lucide-react';

export default function PillarDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user1, user2, activeUser, toggleTopic, updateNotes } = useStore();
  const user = activeUser === 'user1' ? user1 : user2;
  const pillar = user.pillars.find(p => p.id === Number(id));

  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [notesText, setNotesText] = useState('');
  const [showAchievement, setShowAchievement] = useState(false);

  if (!pillar) return <div style={{ padding: 40, color: 'var(--text-muted)' }}>Pillar not found.</div>;

  if (!pillar.unlocked) {
    return (
      <div style={{ textAlign: 'center', padding: '80px 40px' }}>
        <div style={{ fontSize: 60, marginBottom: 20 }}>🔒</div>
        <h2 style={{ fontFamily: 'Space Grotesk', fontSize: 24, marginBottom: 10 }}>Pillar Locked</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 24 }}>Complete the previous pillar to unlock {pillar.name}.</p>
        <button className="btn-primary" onClick={() => navigate('/pillars')}>← Back to Pillars</button>
      </div>
    );
  }

  const handleToggle = (topicId: string) => {
    const wasDone = pillar.topics.find(t => t.id === topicId)?.completed;
    toggleTopic(activeUser, pillar.id, topicId);
    // Show achievement if pillar just completed
    if (!wasDone) {
      const nowDone = pillar.topics.filter(t => t.completed).length + 1;
      if (nowDone === pillar.topics.length) {
        setShowAchievement(true);
        setTimeout(() => setShowAchievement(false), 5000);
      }
    }
  };

  const xpTotal = pillar.topics.reduce((s, t) => s + t.xp, 0);
  const xpEarned = pillar.topics.filter(t => t.completed).reduce((s, t) => s + t.xp, 0);

  return (
    <div>
      {/* Achievement Popup */}
      <AnimatePresence>
        {showAchievement && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            style={{
              position: 'fixed', top: 80, left: '50%', transform: 'translateX(-50%)',
              background: 'rgba(13,18,32,0.98)', border: `2px solid ${pillar.color}`,
              borderRadius: 20, padding: '24px 36px', zIndex: 9999, textAlign: 'center',
              boxShadow: `0 0 40px ${pillar.color}60`
            }}
          >
            <div style={{ fontSize: 60, marginBottom: 10 }}>🏅</div>
            <div style={{ fontSize: 20, fontWeight: 800, fontFamily: 'Space Grotesk', color: pillar.color }}>
              Achievement Unlocked!
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 6, marginBottom: 4 }}>{pillar.achievementTitle}</div>
            <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Pillar {pillar.id}: {pillar.name} Complete! +1,000 XP 🎉</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Back + Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
        <motion.button whileHover={{ x: -3 }} onClick={() => navigate('/pillars')}
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '8px 14px', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13 }}>
          <ArrowLeft size={14} /> Back
        </motion.button>
        <div>
          <div style={{ fontSize: 11, color: pillar.color, fontWeight: 600, letterSpacing: 0.5 }}>PILLAR {pillar.id}</div>
          <h2 style={{ fontSize: 22, fontWeight: 800, fontFamily: 'Space Grotesk' }}>{pillar.emoji} {pillar.name}</h2>
        </div>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 14, marginBottom: 24 }}>
        {[
          { label: 'Progress', value: `${pillar.progress}%`, color: pillar.color },
          { label: 'Topics Done', value: `${pillar.topics.filter(t => t.completed).length}/${pillar.topics.length}`, color: '#10b981' },
          { label: 'XP Earned', value: `${xpEarned.toLocaleString()}`, color: '#8b5cf6' },
          { label: 'XP Remaining', value: `${(xpTotal - xpEarned).toLocaleString()}`, color: '#f59e0b' },
        ].map((s, i) => (
          <div key={i} className="glass" style={{ padding: '14px 16px', textAlign: 'center' }}>
            <div style={{ fontSize: 20, fontWeight: 800, color: s.color, fontFamily: 'Space Grotesk' }}>{s.value}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 3 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="glass" style={{ padding: '16px 20px', marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>Pillar Progress</span>
          <span style={{ color: pillar.color, fontWeight: 700 }}>{pillar.progress}%</span>
        </div>
        <div className="xp-bar" style={{ height: 12 }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${pillar.progress}%` }}
            transition={{ duration: 0.8 }}
            style={{ height: '100%', borderRadius: 6, background: `linear-gradient(90deg, ${pillar.gradientFrom}, ${pillar.color})` }}
          />
        </div>
        {pillar.completed && (
          <div style={{ marginTop: 8, textAlign: 'center', color: '#10b981', fontWeight: 700, fontSize: 13 }}>
            ✅ Pillar Complete! Achievement: {pillar.achievement}
          </div>
        )}
      </div>

      {/* Topics List */}
      <div className="glass" style={{ padding: '4px 0' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <BookOpen size={16} style={{ color: pillar.color }} />
          <span style={{ fontWeight: 700, fontSize: 15 }}>Topics & Skills</span>
        </div>
        {pillar.topics.map((topic, i) => (
          <motion.div key={topic.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}>
            <div
              style={{
                padding: '14px 20px',
                borderBottom: i < pillar.topics.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                background: topic.completed ? `${pillar.color}08` : 'transparent',
                transition: 'background 0.2s',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                {/* Checkbox */}
                <motion.div
                  whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                  onClick={() => handleToggle(topic.id)}
                  className={`topic-checkbox ${topic.completed ? 'checked' : ''}`}
                >
                  {topic.completed && <CheckCircle size={13} color="white" />}
                </motion.div>

                {/* Topic info */}
                <div style={{ flex: 1 }} onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}>
                  <div style={{
                    fontSize: 14, fontWeight: topic.completed ? 400 : 600,
                    textDecoration: topic.completed ? 'line-through' : 'none',
                    color: topic.completed ? 'var(--text-muted)' : 'var(--text-primary)',
                    display: 'flex', alignItems: 'center', gap: 8
                  }}>
                    {topic.name}
                    <span style={{
                      fontSize: 10, padding: '1px 7px', borderRadius: 99,
                      background: `${pillar.color}20`, color: pillar.color,
                      fontWeight: 700
                    }}>+{topic.xp} XP</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>{topic.description}</div>
                </div>

                {/* Notes + expand */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <motion.button whileHover={{ scale: 1.1 }}
                    onClick={() => {
                      setEditingNotes(topic.id);
                      setNotesText(topic.notes);
                      setExpandedTopic(topic.id);
                    }}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                    <Edit3 size={14} />
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.1 }}
                    onClick={() => setExpandedTopic(expandedTopic === topic.id ? null : topic.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 4 }}>
                    {expandedTopic === topic.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </motion.button>
                </div>
              </div>

              {/* Expanded Notes */}
              <AnimatePresence>
                {expandedTopic === topic.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                    style={{ overflow: 'hidden', marginTop: 10, marginLeft: 34 }}
                  >
                    {editingNotes === topic.id ? (
                      <div style={{ display: 'flex', gap: 8, flexDirection: 'column' }}>
                        <textarea
                          value={notesText}
                          onChange={e => setNotesText(e.target.value)}
                          placeholder="Add your notes, resources, key learnings..."
                          className="input"
                          style={{ minHeight: 80, resize: 'vertical' }}
                        />
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn-primary" style={{ display: 'flex', gap: 6, alignItems: 'center', fontSize: 12, padding: '6px 14px' }}
                            onClick={() => { updateNotes(activeUser, pillar.id, topic.id, notesText); setEditingNotes(null); }}>
                            <Save size={12} /> Save Notes
                          </button>
                          <button className="btn-ghost" style={{ fontSize: 12, padding: '6px 12px' }}
                            onClick={() => setEditingNotes(null)}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                        borderRadius: 8, padding: '10px 12px', fontSize: 12, color: 'var(--text-secondary)',
                        lineHeight: 1.6, whiteSpace: 'pre-wrap', minHeight: 40
                      }}>
                        {topic.notes || <span style={{ color: 'var(--text-muted)', fontStyle: 'italic' }}>No notes yet. Click ✏️ to add notes.</span>}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Achievement Card */}
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
        style={{
          marginTop: 24,
          background: `linear-gradient(135deg, ${pillar.gradientFrom}40, ${pillar.gradientTo}20)`,
          border: `1px solid ${pillar.color}40`, borderRadius: 20, padding: '20px 24px',
          display: 'flex', alignItems: 'center', gap: 16
        }}
      >
        <div style={{ fontSize: 40 }}>{pillar.completed ? '🏅' : '🔓'}</div>
        <div>
          <div style={{ fontSize: 12, color: pillar.color, fontWeight: 600, marginBottom: 3 }}>
            {pillar.completed ? 'ACHIEVEMENT UNLOCKED' : 'ACHIEVEMENT GOAL'}
          </div>
          <div style={{ fontSize: 16, fontWeight: 700 }}>{pillar.achievement}</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
            {pillar.completed ? 'Congratulations! You earned this achievement.' : `Complete all ${pillar.topics.length} topics to unlock this achievement.`}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
