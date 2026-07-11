import { motion } from 'framer-motion';
import { useStore } from '../store/useStore';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

const ROLES = [
  { title: 'AI Engineer', icon: '🤖', pillars: [5, 6, 7, 9, 11], salary: '$120K – $200K', desc: 'Build and deploy AI systems' },
  { title: 'ML Engineer', icon: '⚙️', pillars: [3, 5, 6, 9, 11], salary: '$110K – $190K', desc: 'Develop and maintain ML pipelines' },
  { title: 'Data Scientist', icon: '🔬', pillars: [3, 4, 5, 12, 14], salary: '$100K – $170K', desc: 'Extract insights from data' },
  { title: 'Data Engineer', icon: '🗄️', pillars: [2, 4, 10, 9, 11], salary: '$110K – $180K', desc: 'Build data infrastructure' },
  { title: 'MLOps Engineer', icon: '🔄', pillars: [9, 11, 8, 5, 6], salary: '$120K – $195K', desc: 'Automate ML workflows' },
  { title: 'Full Stack AI Dev', icon: '💻', pillars: [8, 7, 9, 5, 6], salary: '$95K – $165K', desc: 'Build AI-powered web apps' },
];

const COMPANIES = [
  { name: 'Google DeepMind', icon: '🔵', focus: 'AI Research', difficulty: 'Extreme' },
  { name: 'OpenAI', icon: '⚫', focus: 'Generative AI', difficulty: 'Extreme' },
  { name: 'Microsoft', icon: '🪟', focus: 'Azure AI', difficulty: 'High' },
  { name: 'Meta AI', icon: '🔷', focus: 'LLaMA / Research', difficulty: 'High' },
  { name: 'Amazon AWS', icon: '🟠', focus: 'Cloud + ML', difficulty: 'High' },
  { name: 'NVIDIA', icon: '💚', focus: 'GPU + AI Infrastructure', difficulty: 'High' },
  { name: 'Anthropic', icon: '🟣', focus: 'Claude / Safety AI', difficulty: 'Extreme' },
  { name: 'Hugging Face', icon: '🤗', focus: 'Open Source AI', difficulty: 'Medium' },
  { name: 'Scale AI', icon: '⚡', focus: 'AI Data Platform', difficulty: 'Medium' },
  { name: 'Cohere', icon: '🌀', focus: 'Enterprise LLMs', difficulty: 'Medium' },
];

const RESUME_CHECKLIST = [
  '✅ Clean, ATS-friendly 1-page resume',
  '✅ Quantified achievements (% improvement, $ value)',
  '✅ Skills section: Python, ML, Cloud, SQL',
  '✅ 3+ major AI/ML projects listed',
  '✅ GitHub link with active contributions',
  '✅ LinkedIn URL (optimized profile)',
  '✅ Education + CGPA',
  '✅ Certifications (AWS, GCP, TensorFlow)',
  '✅ Kaggle / LeetCode profiles',
  '✅ Publication or research (if any)',
  '✅ Internship experience',
  '✅ Portfolio website link',
];

export default function FinalAchievement() {
  const { user1, user2, activeUser, startDate } = useStore();
  const user = activeUser === 'user1' ? user1 : user2;

  const completedPillars = user.pillars.filter(p => p.completed).length;
  const overallProgress = Math.round(user.pillars.reduce((s, p) => s + p.progress, 0) / (user.pillars.length * 100) * 100);
  const isComplete = completedPillars === 15;
  const dayNum = Math.max(1, Math.floor((Date.now() - new Date(startDate).getTime()) / 86400000) + 1);

  // Placement readiness score (based on progress)
  const placementScore = Math.round(
    (overallProgress * 0.4) +
    (Math.min(user.projects.length, 5) / 5 * 25) +
    (Math.min(user.codingLog.filter(c => c.solved).length, 50) / 50 * 20) +
    (Math.min(user.internships.filter(i => i.status === 'completed' || i.status === 'ongoing').length, 1) * 15)
  );

  const interviewScore = Math.round(
    (user.pillars[11]?.progress ?? 0) * 0.3 + // Competitive coding
    (user.pillars[14]?.progress ?? 0) * 0.4 + // Placement prep
    (user.pillars[12]?.progress ?? 0) * 0.3   // Professional dev
  );

  // Skill gaps
  const skillGaps = user.pillars
    .filter(p => p.progress < 80)
    .sort((a, b) => a.progress - b.progress)
    .slice(0, 5);

  const radarData = ROLES.map(r => ({
    subject: r.title.split(' ')[0],
    readiness: r.pillars.reduce((s, id) => s + (user.pillars.find(p => p.id === id)?.progress ?? 0), 0) / (r.pillars.length * 100) * 100,
  }));

  return (
    <div>
      {/* Final Trophy Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        style={{
          background: isComplete
            ? 'linear-gradient(135deg, rgba(245,158,11,0.2), rgba(251,191,36,0.12), rgba(245,158,11,0.08))'
            : 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
          border: isComplete ? '2px solid rgba(245,158,11,0.5)' : '1px solid rgba(59,130,246,0.2)',
          borderRadius: 24, padding: '32px 28px', marginBottom: 28, textAlign: 'center',
          boxShadow: isComplete ? '0 0 60px rgba(245,158,11,0.2), 0 0 120px rgba(245,158,11,0.08)' : 'none'
        }}
      >
        <motion.div
          animate={isComplete ? { rotate: [0, 5, -5, 0], scale: [1, 1.05, 1] } : { y: [0, -8, 0] }}
          transition={{ duration: isComplete ? 1 : 3, repeat: Infinity, repeatDelay: isComplete ? 2 : 0 }}
          style={{ fontSize: 72, marginBottom: 16 }}
        >
          🏆
        </motion.div>

        {isComplete ? (
          <>
            <h2 style={{ fontSize: 28, fontWeight: 900, fontFamily: 'Space Grotesk', marginBottom: 8 }} className="gradient-text-gold">
              CONGRATULATIONS! PROJECT ASCEND COMPLETE!
            </h2>
            <p style={{ fontSize: 16, color: 'var(--text-secondary)', marginBottom: 16 }}>
              You have completed all 15 Pillars of the FUTURE GOAL journey.
            </p>
          </>
        ) : (
          <>
            <h2 style={{ fontSize: 24, fontWeight: 800, fontFamily: 'Space Grotesk', marginBottom: 8 }}>
              🎯 Final Destination: High Salary International Job Offer
            </h2>
            <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginBottom: 12 }}>
              You're <strong style={{ color: '#f59e0b' }}>{overallProgress}%</strong> of the way there.
              Complete all 15 pillars to unlock the final achievement!
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap' }}>
              {user.pillars.map(p => (
                <div key={p.id} style={{
                  width: 32, height: 32, borderRadius: 8, fontSize: 14,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: p.completed ? `${p.color}25` : 'rgba(255,255,255,0.05)',
                  border: p.completed ? `1.5px solid ${p.color}50` : '1.5px solid rgba(255,255,255,0.08)',
                  opacity: p.unlocked ? 1 : 0.4
                }}>
                  {p.emoji}
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>

      {/* Scores */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 24 }}>
        {[
          { label: 'Placement Readiness', score: placementScore, color: '#10b981', desc: 'Overall career prep score' },
          { label: 'Interview Readiness', score: interviewScore, color: '#3b82f6', desc: 'Technical + behavioral score' },
          { label: 'Completion Score', score: overallProgress, color: '#8b5cf6', desc: 'Pillar completion rate' },
        ].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="glass" style={{ padding: 20, textAlign: 'center' }}>
            <div style={{ fontSize: 42, fontWeight: 900, color: s.color, fontFamily: 'Space Grotesk' }}>{s.score}%</div>
            <div style={{ fontSize: 13, fontWeight: 700, marginTop: 4 }}>{s.label}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{s.desc}</div>
            <div style={{ marginTop: 10, height: 6, background: 'rgba(255,255,255,0.06)', borderRadius: 3, overflow: 'hidden' }}>
              <motion.div
                initial={{ width: 0 }} animate={{ width: `${s.score}%` }} transition={{ duration: 1, delay: i * 0.1 + 0.3 }}
                style={{ height: '100%', background: s.color, borderRadius: 3 }}
              />
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Role Radar */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🎯 Role Readiness Radar</h3>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.08)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 10 }} />
              <Radar dataKey="readiness" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.15} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Salary Ranges */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>💰 Expected Salary Ranges</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {ROLES.map(r => {
              const readiness = Math.round(r.pillars.reduce((s, id) => s + (user.pillars.find(p => p.id === id)?.progress ?? 0), 0) / (r.pillars.length * 100) * 100);
              return (
                <div key={r.title} style={{
                  display: 'flex', alignItems: 'center', gap: 10,
                  padding: '8px 10px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{r.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{r.title}</div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.salary}</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 11, fontWeight: 700, color: readiness > 70 ? '#10b981' : readiness > 40 ? '#f59e0b' : '#ef4444' }}>
                      {readiness}%
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>ready</div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* Company Recommendations */}
        <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
          <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>🌍 Company Recommendations</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {COMPANIES.map(c => (
              <div key={c.name} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '8px 10px', borderRadius: 8,
                background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)'
              }}>
                <span style={{ fontSize: 18 }}>{c.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{c.focus}</div>
                </div>
                <span style={{
                  fontSize: 10, padding: '2px 7px', borderRadius: 99, fontWeight: 600,
                  background: c.difficulty === 'Extreme' ? 'rgba(239,68,68,0.1)' : c.difficulty === 'High' ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                  color: c.difficulty === 'Extreme' ? '#ef4444' : c.difficulty === 'High' ? '#f59e0b' : '#10b981'
                }}>{c.difficulty}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Resume Checklist + Skill Gaps */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>📋 Resume Checklist</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 7, maxHeight: 200, overflowY: 'auto' }}>
              {RESUME_CHECKLIST.map((item, i) => (
                <div key={i} style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  {item}
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div className="glass" style={{ padding: 22 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 14 }}>⚠️ Skill Gap Analysis</h3>
            {skillGaps.length === 0 ? (
              <div style={{ textAlign: 'center', color: '#10b981', fontWeight: 700, fontSize: 13 }}>
                🎉 No major skill gaps! All pillars above 80%.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {skillGaps.map(p => (
                  <div key={p.id}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginBottom: 4 }}>
                      <span>{p.emoji} {p.name}</span>
                      <span style={{ color: '#ef4444', fontWeight: 700 }}>{p.progress}%</span>
                    </div>
                    <div style={{ height: 5, background: 'rgba(255,255,255,0.06)', borderRadius: 3 }}>
                      <div style={{ height: '100%', width: `${p.progress}%`, background: '#ef4444', borderRadius: 3 }} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
