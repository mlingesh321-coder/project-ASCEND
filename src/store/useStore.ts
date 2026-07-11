import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PILLARS_DATA } from '../data/pillars';
import type { Pillar, Topic } from '../data/pillars';

export type ThemeMode = 'dark' | 'light';
export type ActiveUser = 'user1' | 'user2';

export interface UserProfile {
  id: ActiveUser;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  streak: number;
  lastStudyDate: string;
  studyHours: number;
  pillars: Pillar[];
  habits: Record<string, boolean[]>;
  dailyTasks: DailyTask[];
  weeklyMissions: Mission[];
  monthlyGoals: Goal[];
  projects: Project[];
  studySessions: StudySession[];
  codingLog: CodingEntry[];
  internships: Internship[];
}

export interface DailyTask {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  pillarId?: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  weekStart: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  month: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  githubUrl: string;
  liveUrl: string;
  status: 'idea' | 'in-progress' | 'completed';
  pillarId: number;
  createdAt: string;
}

export interface StudySession {
  id: string;
  duration: number; // minutes
  pillarId: number;
  date: string;
  notes: string;
}

export interface CodingEntry {
  id: string;
  platform: 'LeetCode' | 'Codeforces' | 'HackerRank' | 'Other';
  problem: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  solved: boolean;
  date: string;
}

export interface Internship {
  id: string;
  company: string;
  role: string;
  status: 'applied' | 'interview' | 'offer' | 'rejected' | 'ongoing' | 'completed';
  startDate: string;
  endDate: string;
  notes: string;
}

export interface AppState {
  theme: ThemeMode;
  activeUser: ActiveUser;
  startDate: string;
  user1: UserProfile;
  user2: UserProfile;

  // Actions
  setTheme: (t: ThemeMode) => void;
  setActiveUser: (u: ActiveUser) => void;
  updateUserName: (userId: ActiveUser, name: string) => void;
  toggleTopic: (userId: ActiveUser, pillarId: number, topicId: string) => void;
  addStudySession: (userId: ActiveUser, session: Omit<StudySession, 'id'>) => void;
  addDailyTask: (userId: ActiveUser, task: Omit<DailyTask, 'id'>) => void;
  toggleDailyTask: (userId: ActiveUser, taskId: string) => void;
  deleteDailyTask: (userId: ActiveUser, taskId: string) => void;
  addProject: (userId: ActiveUser, project: Omit<Project, 'id'>) => void;
  updateProject: (userId: ActiveUser, project: Project) => void;
  addCodingEntry: (userId: ActiveUser, entry: Omit<CodingEntry, 'id'>) => void;
  addInternship: (userId: ActiveUser, internship: Omit<Internship, 'id'>) => void;
  updateInternship: (userId: ActiveUser, internship: Internship) => void;
  toggleHabit: (userId: ActiveUser, habitName: string, dayIndex: number) => void;
  addMission: (userId: ActiveUser, mission: Omit<Mission, 'id'>) => void;
  toggleMission: (userId: ActiveUser, missionId: string) => void;
  addGoal: (userId: ActiveUser, goal: Omit<Goal, 'id'>) => void;
  toggleGoal: (userId: ActiveUser, goalId: string) => void;
  updateNotes: (userId: ActiveUser, pillarId: number, topicId: string, notes: string) => void;
  updateStreak: (userId: ActiveUser) => void;
}

const XP_LEVELS = [0, 500, 1200, 2200, 3500, 5000, 7000, 9500, 12500, 16000, 20000,
  25000, 31000, 38000, 46000, 55000, 65000, 76000, 88000, 101000, 115000,
  130000, 146000, 163000, 181000, 200000];

function calculateLevel(xp: number): number {
  let level = 0;
  for (let i = 0; i < XP_LEVELS.length; i++) {
    if (xp >= XP_LEVELS[i]) level = i;
    else break;
  }
  return level;
}

function initPillars(): Pillar[] {
  return PILLARS_DATA.map((p, i) => ({
    ...p,
    unlocked: i === 0,
    completed: false,
    progress: 0,
    topics: p.topics.map(t => ({ ...t, completed: false, notes: '' })),
  }));
}

function createDefaultUser(id: ActiveUser, name: string): UserProfile {
  return {
    id,
    name,
    avatar: id === 'user1' ? '🧑‍💻' : '👩‍💻',
    xp: 0,
    level: 0,
    streak: 0,
    lastStudyDate: '',
    studyHours: 0,
    pillars: initPillars(),
    habits: {},
    dailyTasks: [],
    weeklyMissions: [],
    monthlyGoals: [],
    projects: [],
    studySessions: [],
    codingLog: [],
    internships: [],
  };
}

function recalcPillars(pillars: Pillar[]): Pillar[] {
  let prevCompleted = true;
  return pillars.map((pillar, i) => {
    const total = pillar.topics.length;
    const done = pillar.topics.filter(t => t.completed).length;
    const progress = total > 0 ? Math.round((done / total) * 100) : 0;
    const completed = progress === 100;
    const unlocked = i === 0 || prevCompleted;
    prevCompleted = completed;
    return { ...pillar, progress, completed, unlocked };
  });
}

function uid() {
  return Math.random().toString(36).substr(2, 9);
}

const TODAY = new Date().toISOString().split('T')[0];

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      activeUser: 'user1',
      startDate: TODAY,
      user1: createDefaultUser('user1', 'User 1'),
      user2: createDefaultUser('user2', 'User 2'),

      setTheme: (t) => set({ theme: t }),
      setActiveUser: (u) => set({ activeUser: u }),

      updateUserName: (userId, name) =>
        set(s => ({ [userId]: { ...s[userId], name } })),

      toggleTopic: (userId, pillarId, topicId) =>
        set(s => {
          const user = s[userId];
          let xpDelta = 0;
          const newPillars = user.pillars.map(p => {
            if (p.id !== pillarId) return p;
            const newTopics = p.topics.map(t => {
              if (t.id !== topicId) return t;
              xpDelta = t.completed ? -t.xp : t.xp;
              return { ...t, completed: !t.completed };
            });
            return { ...p, topics: newTopics };
          });
          const recalced = recalcPillars(newPillars);
          // Check if pillar just completed → bonus XP
          const oldPillar = user.pillars.find(p => p.id === pillarId);
          const newPillar = recalced.find(p => p.id === pillarId);
          if (newPillar?.completed && !oldPillar?.completed) xpDelta += 1000;
          const newXP = Math.max(0, user.xp + xpDelta);
          return {
            [userId]: {
              ...user,
              pillars: recalced,
              xp: newXP,
              level: calculateLevel(newXP),
            },
          };
        }),

      addStudySession: (userId, session) =>
        set(s => {
          const user = s[userId];
          const newSessions = [...user.studySessions, { ...session, id: uid() }];
          const totalHours = newSessions.reduce((sum, ss) => sum + ss.duration, 0) / 60;
          return { [userId]: { ...user, studySessions: newSessions, studyHours: Math.round(totalHours * 10) / 10 } };
        }),

      addDailyTask: (userId, task) =>
        set(s => ({ [userId]: { ...s[userId], dailyTasks: [...s[userId].dailyTasks, { ...task, id: uid() }] } })),

      toggleDailyTask: (userId, taskId) =>
        set(s => ({
          [userId]: {
            ...s[userId],
            dailyTasks: s[userId].dailyTasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t),
          },
        })),

      deleteDailyTask: (userId, taskId) =>
        set(s => ({
          [userId]: { ...s[userId], dailyTasks: s[userId].dailyTasks.filter(t => t.id !== taskId) },
        })),

      addProject: (userId, project) =>
        set(s => ({ [userId]: { ...s[userId], projects: [...s[userId].projects, { ...project, id: uid() }] } })),

      updateProject: (userId, project) =>
        set(s => ({
          [userId]: { ...s[userId], projects: s[userId].projects.map(p => p.id === project.id ? project : p) },
        })),

      addCodingEntry: (userId, entry) =>
        set(s => ({ [userId]: { ...s[userId], codingLog: [...s[userId].codingLog, { ...entry, id: uid() }] } })),

      addInternship: (userId, internship) =>
        set(s => ({ [userId]: { ...s[userId], internships: [...s[userId].internships, { ...internship, id: uid() }] } })),

      updateInternship: (userId, internship) =>
        set(s => ({
          [userId]: { ...s[userId], internships: s[userId].internships.map(i => i.id === internship.id ? internship : i) },
        })),

      toggleHabit: (userId, habitName, dayIndex) =>
        set(s => {
          const user = s[userId];
          const habits = { ...user.habits };
          if (!habits[habitName]) habits[habitName] = Array(7).fill(false);
          habits[habitName] = habits[habitName].map((v, i) => i === dayIndex ? !v : v);
          return { [userId]: { ...user, habits } };
        }),

      addMission: (userId, mission) =>
        set(s => ({ [userId]: { ...s[userId], weeklyMissions: [...s[userId].weeklyMissions, { ...mission, id: uid() }] } })),

      toggleMission: (userId, missionId) =>
        set(s => {
          const user = s[userId];
          const newMissions = user.weeklyMissions.map(m => {
            if (m.id !== missionId) return m;
            const completed = !m.completed;
            return { ...m, completed };
          });
          const xpDelta = user.weeklyMissions.find(m => m.id === missionId)?.completed
            ? -user.weeklyMissions.find(m => m.id === missionId)!.xpReward
            : user.weeklyMissions.find(m => m.id === missionId)!.xpReward;
          const newXP = Math.max(0, user.xp + xpDelta);
          return { [userId]: { ...user, weeklyMissions: newMissions, xp: newXP, level: calculateLevel(newXP) } };
        }),

      addGoal: (userId, goal) =>
        set(s => ({ [userId]: { ...s[userId], monthlyGoals: [...s[userId].monthlyGoals, { ...goal, id: uid() }] } })),

      toggleGoal: (userId, goalId) =>
        set(s => ({
          [userId]: {
            ...s[userId],
            monthlyGoals: s[userId].monthlyGoals.map(g => g.id === goalId ? { ...g, completed: !g.completed } : g),
          },
        })),

      updateNotes: (userId, pillarId, topicId, notes) =>
        set(s => ({
          [userId]: {
            ...s[userId],
            pillars: s[userId].pillars.map(p =>
              p.id !== pillarId ? p : {
                ...p,
                topics: p.topics.map(t => t.id !== topicId ? t : { ...t, notes }),
              }
            ),
          },
        })),

      updateStreak: (userId) =>
        set(s => {
          const user = s[userId];
          const today = new Date().toISOString().split('T')[0];
          if (user.lastStudyDate === today) return {};
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);
          const yStr = yesterday.toISOString().split('T')[0];
          const streak = user.lastStudyDate === yStr ? user.streak + 1 : 1;
          return { [userId]: { ...user, streak, lastStudyDate: today } };
        }),
    }),
    { name: 'future-goal-store', version: 1 }
  )
);

export const XP_LEVELS_TABLE = XP_LEVELS;
export { calculateLevel };
