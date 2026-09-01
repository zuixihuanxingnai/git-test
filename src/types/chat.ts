// 会话对象
export interface ConversationItem {
  id: number;
  sessionTitle: string;
  startedAt: string;
  lastMessageContent: string;
  messageCount: number;
  durationMinutes: number;
}

// 当前会话
export interface CurrentConversation {
  sessionId: string;
  status: 'TEMP' | 'ACTIVE';
  sessionTitle: string;
}

// 聊天消息
export interface ChatMessage {
  id: string;
  senderType: 1 | 2; // 1用户 2AI
  content: string;
  createdAt: string;
  isError?: boolean;
}

// 情绪分析数据
export interface EmotionAnalysis {
  primaryEmotion: string;
  score: number;
  isNegative: boolean;
  riskLevel: 0 | 1 | 2 | 3;
  suggestion: string;
  improvementSuggestions: string[];
  riskDescription: string;
}