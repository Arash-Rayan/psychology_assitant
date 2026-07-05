export type Timeframe = "day" | "week" | "month" | "year";

export type HourlyTask = {
  id: string;
  time: string;
  endTime?: string;
  title: string;
  done: boolean;
  tag: string;
  tagColor: string;
  category: "focus" | "study" | "health" | "rest" | "social" | "creative";
};

export type DayProgress = {
  completed: number;
  total: number;
  focusMinutes: number;
  productivity: number;
};

export type WeekDay = {
  label: string;
  date: number;
  isToday: boolean;
  productivity?: number;
};

export type InsightItem = {
  id: string;
  type: "strength" | "weakness" | "suggestion";
  text: string;
};

export type AIRecommendation = {
  id: string;
  kind: "book" | "podcast" | "note";
  title: string;
  subtitle: string;
  reason: string;
  tag?: string;
};

export type RadarDimension = {
  label: string;
  value: number;
};

export type AnalyticsPeriod = {
  label: string;
  productivity: number;
  tasksDone: number;
  tasksTotal: number;
  trend: "up" | "down" | "stable";
  trendPercent: number;
  focusHours: number;
  chartData: number[];
};

export type JournalTopic = {
  id: string;
  label: string;
  emoji: string;
  prompt: string;
};

export type GoalProgress = {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export type PeopleProfile = {
  id: string;
  name: string;
  city: string;
  purpose: string;
  sharedGoals: string[];
  sharedHabits: string[];
  sharedTastes: string[];
  overlapScore: number;
  overlapReasons: string[];
  avatarInitial: string;
  activeHours?: string;
};

export type BookItem = {
  id: string;
  title: string;
  author: string;
  status: "reading" | "want" | "finished";
  progress?: number;
  genre: string;
};

export type TaskItem = {
  id: string;
  title: string;
  done: boolean;
  time?: string;
  priority?: "low" | "medium" | "high";
  category: string;
};
