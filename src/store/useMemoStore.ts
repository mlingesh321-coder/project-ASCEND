import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Memo {
  id: string;
  title: string;
  content: string;
  category: 'general' | 'learning' | 'idea' | 'important' | 'revision';
  pillarId?: number;
  createdAt: string;
  updatedAt: string;
  pinned: boolean;
  color: string;
}

export interface MemoState {
  memos: Record<'user1' | 'user2', Memo[]>;
  addMemo: (userId: 'user1' | 'user2', memo: Omit<Memo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateMemo: (userId: 'user1' | 'user2', id: string, updates: Partial<Memo>) => void;
  deleteMemo: (userId: 'user1' | 'user2', id: string) => void;
  togglePin: (userId: 'user1' | 'user2', id: string) => void;
}

function uid() {
  return Math.random().toString(36).substr(2, 9);
}

export const useMemoStore = create<MemoState>()(
  persist(
    (set) => ({
      memos: { user1: [], user2: [] },

      addMemo: (userId, memo) =>
        set(s => ({
          memos: {
            ...s.memos,
            [userId]: [
              {
                ...memo,
                id: uid(),
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              },
              ...s.memos[userId],
            ],
          },
        })),

      updateMemo: (userId, id, updates) =>
        set(s => ({
          memos: {
            ...s.memos,
            [userId]: s.memos[userId].map(m =>
              m.id === id ? { ...m, ...updates, updatedAt: new Date().toISOString() } : m
            ),
          },
        })),

      deleteMemo: (userId, id) =>
        set(s => ({
          memos: {
            ...s.memos,
            [userId]: s.memos[userId].filter(m => m.id !== id),
          },
        })),

      togglePin: (userId, id) =>
        set(s => ({
          memos: {
            ...s.memos,
            [userId]: s.memos[userId].map(m =>
              m.id === id ? { ...m, pinned: !m.pinned } : m
            ),
          },
        })),
    }),
    { name: 'future-goal-memos', version: 1 }
  )
);
