import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { Play, Pause, RotateCcw, Plus, Trash2, Check } from 'lucide-react';

// ─── Study Timer ───
function StudyTimer({ userId }: { userId: 'user1' | 'user2' }) {
  const [mode, setMode] = useState<'focus' | 'short' | 'long'>('focus');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const { addStudySession, user1, user2, activeUser } = useStore();
  const user = activeUser === 'user1' ? user1 : user2;

  const MODES = { focus: 25 * 60, short: 5 * 60, long: 15 * 60 };
  const LABELS = { focus: '🎯 Focus', short: '☕ Short Break', long: '🏖 Long Break' };

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            setRunning(false);
            setSessions(s => s + 1);
            if (mode === 'focus') {
              addStudySession(userId, {
                duration: 25, pillarId: user.pillars.find(p => !p.completed && p.unlocked)?.id ?? 1,
                date: new Date().toISOString().split('T')[0], notes: 'Pomodoro session'
              });
            }
            return MODES[mode];
          }
          return t - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [running, mode]);

  const switchMode = (m: 'focus' | 'short' | 'long') => {
    setMode(m); setTimeLeft(MODES[m]); setRunning(false);
  };
  const mins = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const secs = (timeLeft % 60).toString().padStart(2, '0');
  const pct = (1 - timeLeft / MODES[mode]) * 100;
  const size = 200;
  const r = 85;
  const circ = 2 * Math.PI * r;

  return (
    <div className="glass" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
        ⏱ Pomodoro Study Timer
      </h3>

      {/* Mode tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
        {(Object.keys(LABELS) as ('focus' | 'short' | 'long')[]).map(m => (
          <button key={m} onClick={() => switchMode(m)}
            style={{
              flex: 1, padding: '7px 4px', borderRadius: 8, cursor: 'pointer',
              background: mode === m ? 'rgba(59,130,246,0.2)' : 'rgba(255,255,255,0.05)',
              color: mode === m ? '#3b82f6' : 'var(--text-muted)',
              fontWeight: mode === m ? 700 : 400, fontSize: 12,
              border: mode === m ? '1px solid rgba(59,130,246,0.4)' : '1px solid transparent',
            }}>{LABELS[m]}</button>
        ))}
      </div>

      {/* Ring timer */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 20 }}>
        <div style={{ position: 'relative', width: size, height: size }}>
          <svg width={size} height={size}>
            <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(255,255,255,0.06)" strokeWidth={10} fill="none" />
            <circle cx={size / 2} cy={size / 2} r={r}
              stroke={mode === 'focus' ? '#3b82f6' : mode === 'short' ? '#10b981' : '#f59e0b'}
              strokeWidth={10} fill="none"
              strokeDasharray={circ} strokeDashoffset={circ - (pct / 100) * circ}
              strokeLinecap="round"
              style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.5s' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ fontSize: 42, fontWeight: 800, fontFamily: 'Space Grotesk', letterSpacing: -2 }}>
              {mins}:{secs}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
              {sessions} session{sessions !== 1 ? 's' : ''} today
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => { setTimeLeft(MODES[mode]); setRunning(false); }}
          style={{ width: 44, height: 44, borderRadius: 12, border: '1px solid var(--border)', background: 'var(--bg-card)', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <RotateCcw size={16} />
        </motion.button>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
          onClick={() => setRunning(!running)}
          style={{
            width: 120, height: 44, borderRadius: 12, cursor: 'pointer',
            background: running ? 'rgba(239,68,68,0.2)' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            color: running ? '#ef4444' : 'white', fontWeight: 700, fontSize: 14,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            border: running ? '1px solid rgba(239,68,68,0.4)' : 'none'
          }}>
          {running ? <Pause size={16} /> : <Play size={16} />}
          {running ? 'Pause' : 'Start'}
        </motion.button>
      </div>
    </div>
  );
}

// ─── Daily Tasks ───
function DailyTasks({ userId }: { userId: 'user1' | 'user2' }) {
  const { user1, user2, addDailyTask, toggleDailyTask, deleteDailyTask } = useStore();
  const user = userId === 'user1' ? user1 : user2;
  const [input, setInput] = useState('');
  const today = new Date().toISOString().split('T')[0];
  const todayTasks = user.dailyTasks.filter(t => t.date === today);

  const add = () => {
    if (!input.trim()) return;
    addDailyTask(userId, { text: input.trim(), completed: false, date: today });
    setInput('');
  };

  return (
    <div className="glass" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>✅ Today's Tasks</h3>

      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input className="input" value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Add a task for today..." style={{ flex: 1 }} />
        <motion.button whileTap={{ scale: 0.95 }} onClick={add} className="btn-primary" style={{ padding: '10px 16px' }}>
          <Plus size={16} />
        </motion.button>
      </div>

      <div style={{ maxHeight: 280, overflowY: 'auto' }}>
        {todayTasks.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>📋</div>
            No tasks yet. Add your first task!
          </div>
        ) : (
          todayTasks.map(task => (
            <motion.div key={task.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0',
                borderBottom: '1px solid rgba(255,255,255,0.04)'
              }}>
              <motion.div whileTap={{ scale: 0.85 }}
                onClick={() => toggleDailyTask(userId, task.id)}
                style={{
                  width: 20, height: 20, borderRadius: 6, border: task.completed ? 'none' : '2px solid rgba(255,255,255,0.2)',
                  background: task.completed ? 'linear-gradient(135deg, #10b981, #3b82f6)' : 'transparent',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                {task.completed && <Check size={12} color="white" />}
              </motion.div>
              <span style={{
                flex: 1, fontSize: 13,
                textDecoration: task.completed ? 'line-through' : 'none',
                color: task.completed ? 'var(--text-muted)' : 'var(--text-primary)'
              }}>{task.text}</span>
              <motion.button whileHover={{ scale: 1.1 }} onClick={() => deleteDailyTask(userId, task.id)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 2 }}>
                <Trash2 size={13} />
              </motion.button>
            </motion.div>
          ))
        )}
      </div>

      {todayTasks.length > 0 && (
        <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-muted)', textAlign: 'center' }}>
          {todayTasks.filter(t => t.completed).length}/{todayTasks.length} completed today
        </div>
      )}
    </div>
  );
}

// ─── Habit Tracker ───
const DEFAULT_HABITS = ['Study 2+ hours', 'LeetCode problem', 'Read/Watch tutorial', 'Exercise', 'Review notes', 'GitHub commit', 'English practice'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function HabitTracker({ userId }: { userId: 'user1' | 'user2' }) {
  const { user1, user2, toggleHabit } = useStore();
  const user = userId === 'user1' ? user1 : user2;

  return (
    <div className="glass" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🎯 Weekly Habit Tracker</h3>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 6px' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', fontSize: 11, color: 'var(--text-muted)', padding: '0 0 8px', fontWeight: 500, width: '40%' }}>Habit</th>
              {DAYS.map(d => (
                <th key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', padding: '0 4px 8px', fontWeight: 500 }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {DEFAULT_HABITS.map(habit => {
              const days = user.habits[habit] ?? Array(7).fill(false);
              const count = days.filter(Boolean).length;
              return (
                <tr key={habit}>
                  <td style={{ padding: '4px 0', fontSize: 12, color: 'var(--text-primary)', paddingRight: 12 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {habit}
                      <span style={{
                        fontSize: 10, padding: '1px 6px', borderRadius: 99,
                        background: count >= 5 ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.05)',
                        color: count >= 5 ? '#10b981' : 'var(--text-muted)'
                      }}>{count}/7</span>
                    </span>
                  </td>
                  {days.map((done: boolean, i: number) => (
                    <td key={i} style={{ textAlign: 'center', padding: '4px' }}>
                      <motion.div whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
                        onClick={() => toggleHabit(userId, habit, i)}
                        style={{
                          width: 28, height: 28, borderRadius: 8, margin: '0 auto', cursor: 'pointer',
                          background: done ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : 'rgba(255,255,255,0.05)',
                          border: done ? 'none' : '1px solid rgba(255,255,255,0.08)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: done ? '0 0 8px rgba(59,130,246,0.3)' : 'none',
                          transition: 'all 0.2s'
                        }}>
                        {done && <Check size={13} color="white" />}
                      </motion.div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Weekly Missions ───
function WeeklyMissions({ userId }: { userId: 'user1' | 'user2' }) {
  const { user1, user2, addMission, toggleMission } = useStore();
  const user = userId === 'user1' ? user1 : user2;
  const [title, setTitle] = useState('');
  const [xpReward, setXpReward] = useState('200');

  const week = `${new Date().getFullYear()}-W${Math.ceil(new Date().getDate() / 7)}`;
  const missions = user.weeklyMissions.filter(m => m.weekStart === week);

  const add = () => {
    if (!title.trim()) return;
    addMission(userId, { title, description: '', xpReward: Number(xpReward) || 200, completed: false, weekStart: week });
    setTitle('');
  };

  return (
    <div className="glass" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>🎖 Weekly Missions</h3>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input className="input" value={title} onChange={e => setTitle(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()} placeholder="Mission name..." style={{ flex: 1 }} />
        <input className="input" type="number" value={xpReward} onChange={e => setXpReward(e.target.value)}
          style={{ width: 72 }} placeholder="XP" />
        <button className="btn-primary" onClick={add} style={{ padding: '10px 14px' }}><Plus size={15} /></button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        {missions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            <div style={{ fontSize: 24, marginBottom: 6 }}>🎖</div>No missions this week. Add one!
          </div>
        ) : (
          missions.map(m => (
            <motion.div key={m.id} whileHover={{ x: 2 }}
              onClick={() => toggleMission(userId, m.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 10, padding: '12px 14px', borderRadius: 10, cursor: 'pointer',
                background: m.completed ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)',
                border: m.completed ? '1px solid rgba(16,185,129,0.2)' : '1px solid rgba(255,255,255,0.06)'
              }}>
              <div style={{
                width: 22, height: 22, borderRadius: 7, flexShrink: 0,
                background: m.completed ? 'linear-gradient(135deg, #10b981, #3b82f6)' : 'rgba(255,255,255,0.06)',
                border: m.completed ? 'none' : '1.5px solid rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
                {m.completed && <Check size={13} color="white" />}
              </div>
              <span style={{ flex: 1, fontSize: 13, textDecoration: m.completed ? 'line-through' : 'none', color: m.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>{m.title}</span>
              <span style={{
                fontSize: 11, padding: '2px 8px', borderRadius: 99, fontWeight: 700,
                background: 'rgba(139,92,246,0.15)', color: '#a78bfa'
              }}>+{m.xpReward} XP</span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Coding Tracker ───
function CodingTracker({ userId }: { userId: 'user1' | 'user2' }) {
  const { user1, user2, addCodingEntry } = useStore();
  const user = userId === 'user1' ? user1 : user2;
  const [form, setForm] = useState({ platform: 'LeetCode', problem: '', difficulty: 'Medium', solved: true });

  const add = () => {
    if (!form.problem.trim()) return;
    addCodingEntry(userId, { ...form as any, date: new Date().toISOString().split('T')[0], solved: form.solved });
    setForm(f => ({ ...f, problem: '' }));
  };

  const easy = user.codingLog.filter(c => c.difficulty === 'Easy' && c.solved).length;
  const medium = user.codingLog.filter(c => c.difficulty === 'Medium' && c.solved).length;
  const hard = user.codingLog.filter(c => c.difficulty === 'Hard' && c.solved).length;

  return (
    <div className="glass" style={{ padding: 24 }}>
      <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>💻 Coding Tracker</h3>
      {/* Stats */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
        {[{ label: 'Easy', count: easy, color: '#10b981' }, { label: 'Medium', count: medium, color: '#f59e0b' }, { label: 'Hard', count: hard, color: '#ef4444' }].map(s => (
          <div key={s.label} style={{ flex: 1, textAlign: 'center', background: `${s.color}12`, border: `1px solid ${s.color}25`, borderRadius: 10, padding: '10px 0' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.count}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Log form */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8 }}>
          <select className="input" value={form.platform} onChange={e => setForm(f => ({ ...f, platform: e.target.value as any }))} style={{ flex: 1 }}>
            {['LeetCode', 'Codeforces', 'HackerRank', 'Other'].map(p => <option key={p}>{p}</option>)}
          </select>
          <select className="input" value={form.difficulty} onChange={e => setForm(f => ({ ...f, difficulty: e.target.value as any }))} style={{ width: 100 }}>
            {['Easy', 'Medium', 'Hard'].map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" value={form.problem} onChange={e => setForm(f => ({ ...f, problem: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && add()} placeholder="Problem name or number..." style={{ flex: 1 }} />
          <button className="btn-primary" onClick={add} style={{ padding: '10px 14px' }}><Plus size={15} /></button>
        </div>
      </div>
      {/* Recent entries */}
      <div style={{ maxHeight: 200, overflowY: 'auto' }}>
        {user.codingLog.slice(-10).reverse().map(e => (
          <div key={e.id} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '7px 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: 12 }}>
            <span style={{ color: e.difficulty === 'Easy' ? '#10b981' : e.difficulty === 'Medium' ? '#f59e0b' : '#ef4444', fontWeight: 700, width: 52 }}>{e.difficulty}</span>
            <span style={{ flex: 1, color: 'var(--text-primary)' }}>{e.problem}</span>
            <span style={{ color: 'var(--text-muted)' }}>{e.platform}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Project Tracker ───
function ProjectTracker({ userId }: { userId: 'user1' | 'user2' }) {
  const { user1, user2, addProject } = useStore();
  const user = userId === 'user1' ? user1 : user2;
  const [form, setForm] = useState({ name: '', description: '', techStack: '', githubUrl: '', liveUrl: '', status: 'in-progress', pillarId: 1 });
  const [adding, setAdding] = useState(false);

  const add = () => {
    if (!form.name.trim()) return;
    addProject(userId, { ...form, techStack: form.techStack.split(',').map(t => t.trim()).filter(Boolean), createdAt: new Date().toISOString() } as any);
    setAdding(false);
    setForm({ name: '', description: '', techStack: '', githubUrl: '', liveUrl: '', status: 'in-progress', pillarId: 1 });
  };

  const statusColors: Record<string, string> = { idea: '#8b5cf6', 'in-progress': '#f59e0b', completed: '#10b981' };

  return (
    <div className="glass" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700 }}>🚀 Project Tracker</h3>
        <button className="btn-primary" onClick={() => setAdding(!adding)} style={{ padding: '7px 14px', fontSize: 12 }}>
          <Plus size={13} style={{ marginRight: 4 }} />Add Project
        </button>
      </div>
      <AnimatePresence>
        {adding && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden', marginBottom: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '14px', background: 'rgba(255,255,255,0.03)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.07)' }}>
              <input className="input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Project name *" />
              <input className="input" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Description" />
              <input className="input" value={form.techStack} onChange={e => setForm(f => ({ ...f, techStack: e.target.value }))} placeholder="Tech stack (comma separated): Python, FastAPI, React" />
              <div style={{ display: 'flex', gap: 8 }}>
                <input className="input" value={form.githubUrl} onChange={e => setForm(f => ({ ...f, githubUrl: e.target.value }))} placeholder="GitHub URL" style={{ flex: 1 }} />
                <select className="input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ width: 130 }}>
                  <option value="idea">💡 Idea</option>
                  <option value="in-progress">🔨 In Progress</option>
                  <option value="completed">✅ Completed</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn-primary" onClick={add}>Save Project</button>
                <button className="btn-ghost" onClick={() => setAdding(false)}>Cancel</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {user.projects.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '30px 0', color: 'var(--text-muted)', fontSize: 13 }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>🚀</div>Start tracking your projects!
          </div>
        ) : (
          user.projects.map(p => (
            <div key={p.id} style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
              borderRadius: 10, padding: '12px 14px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                <span style={{ fontWeight: 600, fontSize: 13 }}>{p.name}</span>
                <span style={{
                  fontSize: 10, padding: '2px 8px', borderRadius: 99, fontWeight: 600,
                  background: `${statusColors[p.status]}15`, color: statusColors[p.status]
                }}>{p.status === 'in-progress' ? '🔨 In Progress' : p.status === 'completed' ? '✅ Complete' : '💡 Idea'}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 6 }}>{p.description}</div>
              {p.techStack.length > 0 && (
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  {p.techStack.map(t => (
                    <span key={t} style={{ fontSize: 10, padding: '1px 7px', borderRadius: 99, background: 'rgba(59,130,246,0.1)', color: '#60a5fa' }}>{t}</span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default function FeaturesPage() {
  const { activeUser } = useStore();
  const userId = activeUser;

  const TABS = [
    { id: 'timer', label: '⏱ Timer', component: <StudyTimer userId={userId} /> },
    { id: 'tasks', label: '✅ Daily Tasks', component: <DailyTasks userId={userId} /> },
    { id: 'habits', label: '🎯 Habits', component: <HabitTracker userId={userId} /> },
    { id: 'missions', label: '🎖 Missions', component: <WeeklyMissions userId={userId} /> },
    { id: 'coding', label: '💻 Coding', component: <CodingTracker userId={userId} /> },
    { id: 'projects', label: '🚀 Projects', component: <ProjectTracker userId={userId} /> },
  ];
  const [activeTab, setActiveTab] = useState('timer');

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(16,185,129,0.1), rgba(59,130,246,0.1))',
          border: '1px solid rgba(16,185,129,0.2)', borderRadius: 20, padding: '16px 22px', marginBottom: 24
        }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Space Grotesk' }}>⚡ Features Hub</h2>
        <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>All your productivity tools in one place.</p>
      </motion.div>

      {/* Tab bar */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {TABS.map(t => (
          <motion.button key={t.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(t.id)}
            style={{
              padding: '8px 16px', borderRadius: 10, cursor: 'pointer', fontSize: 13,
              background: activeTab === t.id ? 'rgba(59,130,246,0.2)' : 'var(--bg-card)',
              color: activeTab === t.id ? '#3b82f6' : 'var(--text-secondary)',
              fontWeight: activeTab === t.id ? 700 : 400,
              border: activeTab === t.id ? '1px solid rgba(59,130,246,0.3)' : '1px solid var(--border)'
            }}>{t.label}</motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}>
          {TABS.find(t => t.id === activeTab)?.component}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
