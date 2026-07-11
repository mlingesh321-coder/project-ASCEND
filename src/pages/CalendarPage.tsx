import { motion } from 'framer-motion';
import { useState, useMemo } from 'react';
import { useStore } from '../store/useStore';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function CalendarPage() {
  const { user1, user2, activeUser, startDate } = useStore();
  const user = activeUser === 'user1' ? user1 : user2;

  const today = new Date();
  const [viewDate, setViewDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));

  const startDt = new Date(startDate);
  const endDt = new Date(startDt.getTime() + 730 * 86400000);
  const dayNum = Math.max(1, Math.floor((Date.now() - startDt.getTime()) / 86400000) + 1);

  // Study session dates set
  const studyDates = useMemo(() => {
    const set = new Set<string>();
    user.studySessions.forEach(s => set.add(s.date));
    user.dailyTasks.filter(t => t.completed).forEach(t => set.add(t.date));
    return set;
  }, [user.studySessions, user.dailyTasks]);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const cells: (number | null)[] = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)];
  while (cells.length % 7 !== 0) cells.push(null);

  const getDateStr = (day: number) => `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
  const getDayNumber = (day: number) => {
    const d = new Date(year, month, day);
    return Math.floor((d.getTime() - startDt.getTime()) / 86400000) + 1;
  };
  const isToday = (day: number) => {
    const d = new Date(year, month, day);
    return d.toDateString() === today.toDateString();
  };
  const isInRange = (day: number) => {
    const d = new Date(year, month, day);
    return d >= startDt && d <= endDt;
  };
  const hasStudy = (day: number) => studyDates.has(getDateStr(day));
  const isPast = (day: number) => new Date(year, month, day) < today;

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const studyDayCount = studyDates.size;
  const weekNum = Math.ceil(dayNum / 7);
  const monthNum = Math.ceil(dayNum / 30);
  const daysLeft = Math.max(0, 730 - dayNum);

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
          border: '1px solid rgba(59,130,246,0.2)', borderRadius: 20, padding: '16px 22px', marginBottom: 24
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Space Grotesk' }}>📅 730-Day Calendar</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
              Day <strong style={{ color: 'white' }}>{dayNum}</strong> of 730 •
              Week {weekNum} • Month {monthNum} •
              <strong style={{ color: '#f59e0b' }}> {daysLeft} days left</strong>
            </p>
          </div>
          <div style={{ display: 'flex', gap: 14 }}>
            {[
              { label: 'Study Days', value: studyDayCount, color: '#10b981' },
              { label: 'Streak', value: user.streak, color: '#f97316' },
              { label: 'Day', value: dayNum, color: '#3b82f6' },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Progress Timeline */}
      <motion.div className="glass" style={{ padding: 20, marginBottom: 20 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>🗓 730-Day Journey Progress</span>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {startDt.toLocaleDateString()} → {endDt.toLocaleDateString()}
          </span>
        </div>
        <div style={{ height: 10, background: 'rgba(255,255,255,0.06)', borderRadius: 5, overflow: 'hidden' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${(dayNum / 730) * 100}%` }}
            transition={{ duration: 1.2 }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #3b82f6, #8b5cf6, #f59e0b)', borderRadius: 5 }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
          <span>Day 1 – Start</span>
          <span>Day {dayNum} (today)</span>
          <span>Day 730 – Graduation</span>
        </div>
      </motion.div>

      {/* Calendar */}
      <motion.div className="glass" style={{ padding: 24 }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        {/* Month nav */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prevMonth}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronLeft size={16} />
          </motion.button>
          <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Space Grotesk' }}>
            {MONTHS[month]} {year}
          </h3>
          <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={nextMonth}
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 8, width: 34, height: 34, cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <ChevronRight size={16} />
          </motion.button>
        </div>

        {/* Weekday headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6, marginBottom: 6 }}>
          {WEEKDAYS.map(d => (
            <div key={d} style={{ textAlign: 'center', fontSize: 11, color: 'var(--text-muted)', fontWeight: 600, padding: '4px 0' }}>{d}</div>
          ))}
        </div>

        {/* Calendar cells */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 6 }}>
          {cells.map((day, i) => {
            if (!day) return <div key={i} />;
            const todayFlag = isToday(day);
            const inRange = isInRange(day);
            const hasStudied = hasStudy(day);
            const past = isPast(day) && !todayFlag;
            const dn = getDayNumber(day);

            return (
              <motion.div key={i} whileHover={inRange ? { scale: 1.05 } : {}}
                style={{
                  aspectRatio: '1',
                  borderRadius: 10,
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  background: todayFlag
                    ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)'
                    : hasStudied
                    ? 'rgba(16,185,129,0.2)'
                    : inRange && !past
                    ? 'rgba(255,255,255,0.04)'
                    : 'transparent',
                  border: todayFlag
                    ? '2px solid rgba(59,130,246,0.8)'
                    : hasStudied
                    ? '1px solid rgba(16,185,129,0.4)'
                    : inRange
                    ? '1px solid rgba(255,255,255,0.06)'
                    : 'none',
                  boxShadow: todayFlag ? '0 0 12px rgba(59,130,246,0.4)' : 'none',
                  cursor: inRange ? 'default' : 'default',
                  transition: 'all 0.2s',
                }}>
                <span style={{
                  fontSize: 13, fontWeight: todayFlag ? 800 : 500,
                  color: todayFlag ? 'white' : inRange ? 'var(--text-primary)' : 'var(--text-muted)',
                }}>
                  {day}
                </span>
                {inRange && dn > 0 && (
                  <span style={{ fontSize: 8, color: todayFlag ? 'rgba(255,255,255,0.7)' : hasStudied ? '#10b981' : 'var(--text-muted)', marginTop: 1 }}>
                    D{dn}
                  </span>
                )}
                {hasStudied && !todayFlag && (
                  <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#10b981', marginTop: 2 }} />
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 16, flexWrap: 'wrap' }}>
          {[
            { color: 'linear-gradient(135deg, #3b82f6, #8b5cf6)', label: 'Today' },
            { color: 'rgba(16,185,129,0.3)', label: 'Studied' },
            { color: 'rgba(255,255,255,0.06)', label: 'Upcoming' },
          ].map(l => (
            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
              <div style={{ width: 14, height: 14, borderRadius: 4, background: l.color }} />
              {l.label}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
