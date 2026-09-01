export interface EmotionItem {
  id: number;
  userId: string;
  nickname: string;
  username: string;
  diaryDate: string;
  moodScore: number;
  sleepQuality: number;
  stressLevel: number;
  emotionTriggers: string;
  diaryContent: string;
  dominantEmotion: string;
  aiEmotionAnalysis: string | null;
}

export interface AiEmotionAnalysis {
  primaryEmotion: string;
  emotionScore: number;
  riskLevel: 0 | 1 | 2 | 3;
  isNegative: boolean;
  suggestion: string;
  riskDescription: string;
  improvements: string[];
  createTime: string;
}

export interface SearchFormItem {
  comp: 'input' | 'select';
  label: string;
  prop: string;
  placeholder: string;
  options?: { label: string; value: string }[];
}

export interface Pagination {
  currentPage: number;
  size: number;
  total: number;
}

export interface SearchParams extends Record<string, any> {
  currentPage: number;
  size: number;
}