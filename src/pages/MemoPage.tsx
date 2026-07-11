import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '../store/useStore';
import { useMemoStore } from '../store/useMemoStore';
import { Plus, Trash2, Pin, PinOff, Edit3, Save, X, Search } from 'lucide-react';
import { PILLARS_DATA } from '../data/pillars';

const CATEGORIES = [
  { id: 'general', label: 'General', icon: '📝', color: '#6b7280' },
  { id: 'learning', label: 'Learning', icon: '📚', color: '#3b82f6' },
  { id: 'idea', label: 'Idea', icon: '💡', color: '#f59e0b' },
  { id: 'important', label: 'Important', icon: '⚠️', color: '#ef4444' },
  { id: 'revision', label: 'Revision', icon: '🔄', color: '#8b5cf6' },
] as const;

const NOTE_COLORS = ['#1a1f35', '#0d2035', '#1a0d35', '#1a2a0d', '#351a0d'];

interface MemoCardProps {
  memo: any;
  onEdit: () => void;
  onDelete: () => void;
  onTogglePin: () => void;
}

function MemoCard({ memo, onEdit, onDelete, onTogglePin }: MemoCardProps) {
  const cat = CATEGORIES.find(c => c.id === memo.category) ?? CATEGORIES[0];
  const pillar = PILLARS_DATA.find(p => p.id === memo.pillarId);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -2, boxShadow: `0 8px 32px rgba(0,0,0,0.3)` }}
      style={{
        background: memo.color || '#1a1f35',
        borderRadius: 16, padding: '18px 18px 14px', position: 'relative',
        boxShadow: memo.pinned ? '0 0 20px rgba(245,158,11,0.15)' : 'none',
        transition: 'box-shadow 0.3s',
        cursor: 'default',
      }}
    >
      {/* Pin indicator */}
      {memo.pinned && (
        <div style={{ position: 'absolute', top: -6, right: 14, fontSize: 16 }}>📌</div>
      )}

      {/* Category chip */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
        <span style={{
          fontSize: 11, padding: '2px 9px', borderRadius: 99, fontWeight: 600,
          background: `${cat.color}20`, color: cat.color, border: `1px solid ${cat.color}30`
        }}>
          {cat.icon} {cat.label}
        </span>
        {pillar && (
          <span style={{ fontSize: 10, color: pillar.color, fontWeight: 600 }}>
            {pillar.emoji} {pillar.name}
          </span>
        )}
      </div>

      {/* Title */}
      <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, lineHeight: 1.3, color: 'white' }}>
        {memo.title || 'Untitled'}
      </h3>

      {/* Content preview */}
      <p style={{
        fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.6,
        display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical',
        overflow: 'hidden', marginBottom: 14, whiteSpace: 'pre-wrap'
      }}>
        {memo.content || 'Empty note...'}
      </p>

      {/* Footer */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)' }}>
          {new Date(memo.updatedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
        <div style={{ display: 'flex', gap: 4 }}>
          {[
            { icon: memo.pinned ? PinOff : Pin, action: onTogglePin, tip: 'Pin' },
            { icon: Edit3, action: onEdit, tip: 'Edit' },
            { icon: Trash2, action: onDelete, tip: 'Delete' },
          ].map(({ icon: Icon, action, tip }) => (
            <motion.button key={tip} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.85 }}
              onClick={action}
              title={tip}
              style={{
                width: 28, height: 28, borderRadius: 7, border: 'none', cursor: 'pointer',
                background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}>
              <Icon size={13} />
            </motion.button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

interface EditModalProps {
  memo?: any;
  onSave: (data: any) => void;
  onClose: () => void;
}

function EditModal({ memo, onSave, onClose }: EditModalProps) {
  const [title, setTitle] = useState(memo?.title ?? '');
  const [content, setContent] = useState(memo?.content ?? '');
  const [category, setCategory] = useState(memo?.category ?? 'general');
  const [pillarId, setPillarId] = useState(memo?.pillarId ?? '');
  const [color, setColor] = useState(memo?.color ?? '#1a1f35');

  const handleSave = () => {
    if (!title.trim() && !content.trim()) return;
    onSave({ title: title.trim(), content, category, pillarId: pillarId || undefined, color, pinned: memo?.pinned ?? false });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)',
        backdropFilter: 'blur(8px)', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: '#0d1220', border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 20, padding: 28, width: '100%', maxWidth: 560,
          boxShadow: '0 40px 80px rgba(0,0,0,0.6)'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h3 style={{ fontSize: 17, fontWeight: 700, fontFamily: 'Space Grotesk' }}>
            {memo ? '✏️ Edit Memo' : '✨ New Memo'}
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)' }}>
            <X size={18} />
          </button>
        </div>

        <input className="input" value={title} onChange={e => setTitle(e.target.value)}
          placeholder="Title..." style={{ marginBottom: 12, fontSize: 16, fontWeight: 600 }} />

        <textarea className="input" value={content} onChange={e => setContent(e.target.value)}
          placeholder="Write your notes, learnings, ideas..."
          style={{ minHeight: 160, resize: 'vertical', marginBottom: 14, lineHeight: 1.7 }} />

        <div style={{ display: 'flex', gap: 10, marginBottom: 14, flexWrap: 'wrap' }}>
          {/* Category */}
          <select className="input" value={category} onChange={e => setCategory(e.target.value)} style={{ flex: 1, minWidth: 140 }}>
            {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.icon} {c.label}</option>)}
          </select>

          {/* Pillar link */}
          <select className="input" value={pillarId} onChange={e => setPillarId(Number(e.target.value) || '')} style={{ flex: 1, minWidth: 150 }}>
            <option value="">No Pillar Link</option>
            {PILLARS_DATA.map(p => <option key={p.id} value={p.id}>{p.emoji} {p.name}</option>)}
          </select>
        </div>

        {/* Color picker */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>Note color:</span>
          {NOTE_COLORS.map(c => (
            <div key={c} onClick={() => setColor(c)}
              style={{
                width: 24, height: 24, borderRadius: 7, background: c, cursor: 'pointer',
                transition: 'border 0.2s'
              }} />
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleSave} className="btn-primary"
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
            <Save size={15} /> Save Memo
          </motion.button>
          <button onClick={onClose} className="btn-ghost" style={{ padding: '10px 20px' }}>Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MemoPage() {
  const { activeUser } = useStore();
  const { memos, addMemo, updateMemo, deleteMemo, togglePin } = useMemoStore();
  const userMemos = memos[activeUser] ?? [];

  const [search, setSearch] = useState('');
  const [filterCat, setFilterCat] = useState<string>('all');
  const [editing, setEditing] = useState<any | null>(null);
  const [isNew, setIsNew] = useState(false);

  const filtered = userMemos
    .filter(m => filterCat === 'all' || m.category === filterCat)
    .filter(m => !search || m.title.toLowerCase().includes(search.toLowerCase()) || m.content.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => (b.pinned ? 1 : 0) - (a.pinned ? 1 : 0) || new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

  const pinnedCount = userMemos.filter(m => m.pinned).length;

  return (
    <div>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        style={{
          background: 'linear-gradient(135deg, rgba(245,158,11,0.1), rgba(251,191,36,0.06))',
          border: '1px solid rgba(245,158,11,0.2)', borderRadius: 20, padding: '16px 22px', marginBottom: 24
        }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 800, fontFamily: 'Space Grotesk' }}>📝 Memo & Notes</h2>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 3 }}>
              {userMemos.length} notes • {pinnedCount} pinned
            </p>
          </div>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }}
            onClick={() => { setIsNew(true); setEditing(null); }}
            className="btn-primary"
            style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Plus size={16} /> New Memo
          </motion.button>
        </div>
      </motion.div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input className="input" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search memos..." style={{ paddingLeft: 36 }} />
        </div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {[{ id: 'all', label: 'All', icon: '🗂' }, ...CATEGORIES].map(c => (
            <motion.button key={c.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => setFilterCat(c.id)}
              style={{
                padding: '8px 14px', borderRadius: 10, border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 600,
                background: filterCat === c.id ? 'rgba(59,130,246,0.2)' : 'var(--bg-card)',
                color: filterCat === c.id ? '#3b82f6' : 'var(--text-secondary)',
              }}>
              {c.icon} {c.label}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Quick note templates */}
      {userMemos.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
          style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 12 }}>
            ⚡ Quick Start Templates
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            {[
              { title: "Today's Learning", content: "What I learned today:\n\n1. \n2. \n3. \n\nKey takeaways:\n\nNext steps:", category: 'learning', color: '#0d2035' },
              { title: "Project Idea 💡", content: "Project Name:\n\nProblem to solve:\n\nTech stack:\n\nResources:", category: 'idea', color: '#1a2a0d' },
              { title: "Interview Notes", content: "Question:\n\nMy answer:\n\nImprovement:", category: 'important', color: '#351a0d' },
            ].map(t => (
              <motion.button key={t.title} whileHover={{ scale: 1.03, y: -2 }} whileTap={{ scale: 0.97 }}
                onClick={() => { addMemo(activeUser, { ...t, pinned: false } as any); }}
                style={{
                  background: t.color, border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: 12, padding: '12px 16px', cursor: 'pointer', textAlign: 'left',
                  color: 'white', fontFamily: 'Inter, sans-serif'
                }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 3 }}>{t.title}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>Click to create from template</div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Memo Grid */}
      {filtered.length === 0 && userMemos.length > 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 40, marginBottom: 10 }}>🔍</div>
          <div style={{ fontSize: 14 }}>No memos match your search.</div>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>📝</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 6 }}>No memos yet</div>
          <div style={{ fontSize: 13 }}>Create your first memo to capture ideas, notes, and learnings!</div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => { setIsNew(true); setEditing(null); }}
            className="btn-primary" style={{ marginTop: 16, display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <Plus size={15} /> Create First Memo
          </motion.button>
        </div>
      ) : (
        <motion.div layout style={{ columns: '300px', gap: 16 }}>
          <AnimatePresence>
            {filtered.map(memo => (
              <div key={memo.id} style={{ breakInside: 'avoid', marginBottom: 16 }}>
                <MemoCard
                  memo={memo}
                  onEdit={() => { setEditing(memo); setIsNew(false); }}
                  onDelete={() => deleteMemo(activeUser, memo.id)}
                  onTogglePin={() => togglePin(activeUser, memo.id)}
                />
              </div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {(isNew || editing) && (
          <EditModal
            memo={editing ?? undefined}
            onSave={(data) => {
              if (editing) {
                updateMemo(activeUser, editing.id, data);
              } else {
                addMemo(activeUser, data);
              }
              setEditing(null);
              setIsNew(false);
            }}
            onClose={() => { setEditing(null); setIsNew(false); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
