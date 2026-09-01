import { useState, useEffect, useRef } from "react";
import { Button, Input, message, Modal, Image } from "antd";
import {
  PlusOutlined,
  DeleteFilled,
  MessageOutlined,
  ClockCircleOutlined,
  SendOutlined,
} from "@ant-design/icons";
import { fetchEventSource } from "@microsoft/fetch-event-source";
import MarkdownRenderer from "@/components/MarkdownRenderer";
import {
  startConversation,
  deleteSession,
  getSessionDetail,
  getSessionList,
  getEmotionAnalysis,
} from "@/apis/fronted";
import type {
  ConversationItem,
  CurrentConversation,
  ChatMessage,
  EmotionAnalysis,
} from "@/types/chat";
import robotFill from "@/assets/images/robot-fill.png";
import like from "@/assets/images/like.png";
import users from "@/assets/images/users.png";
import "@/styles/front/consultation.scss";

const { TextArea } = Input;

const ChatConsult = () => {
  // 会话
  const [currentConversation, setCurrentConversation] =
    useState<CurrentConversation | null>(null);
  const [sessionList, setSessionList] = useState<ConversationItem[]>([]);
  // 聊天消息
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [userMessage, setUserMessage] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  // 情绪数据
  const [currentEmotion, setCurrentEmotion] = useState<EmotionAnalysis>({
    primaryEmotion: "中性",
    score: 50,
    isNegative: false,
    riskLevel: 0,
    suggestion: "保持正常的心情",
    improvementSuggestions: [],
    riskDescription: "",
  });
  // 滚动容器ref
  const chatBoxRef = useRef<HTMLDivElement>(null);

  // 页面初始化
  useEffect(() => {
    createNewConversation();
    getSessionPage();
  }, []);

  // 自动滚动到底部
  useEffect(() => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // 新建临时对话
  const createNewConversation = () => {
    const newConversation: CurrentConversation = {
      sessionId: `temp_${Date.now()}`,
      status: "TEMP",
      sessionTitle: "新对话",
    };
    setCurrentConversation(newConversation);
    setMessages([]);
  };
  const createNewFrontendSession = () => createNewConversation();

  // 获取会话列表
  const getSessionPage = async () => {
    const res = await getSessionList({ pageNum: 1, pageSize: 10 });
    setSessionList(res.records || []);
  };

  // 发送消息
  const sendMessage = async () => {
    const val = userMessage.trim();
    if (!val) return;
    if (isAiTyping) {
      message.error("请稍后再发送消息");
      return;
    }
    const msg = val;
    setUserMessage("");

    if (!currentConversation) return;
    if (currentConversation.status === "TEMP") {
      await startNewConversation(msg);
    } else {
      // 历史会话直接追加用户消息
      const userMsg: ChatMessage = {
        id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        senderType: 1,
        content: msg,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, userMsg]);
      startAiResponse(currentConversation.sessionId, msg);
    }
  };

  // 创建正式会话
  const startNewConversation = async (message: string) => {
    if (!currentConversation) return;
    const params: Record<string, any> = { initialMessage: message };
    if (currentConversation.sessionTitle === "新对话") {
      params.sessionTitle = `宁波AI助手 ${new Date().toLocaleString()}`;
    } else {
      params.sessionTitle = currentConversation.sessionTitle;
    }
    const res = await startConversation(params);
    const sessionData = {
      sessionId: res.sessionId,
      status: res.status,
      sessionTitle: params.sessionTitle,
    };
    setCurrentConversation(sessionData);
    getSessionPage();

    // 用户消息
    const userMsg: ChatMessage = {
      id: `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      senderType: 1,
      content: message,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMsg]);
    startAiResponse(sessionData.sessionId, message);
  };

  // SSE流式AI回复
  const startAiResponse = (sessionId: string, message: string) => {
    if (isAiTyping) {
      message.error("请稍后再发送消息");
      return;
    }
    setIsAiTyping(true);
    const aiMsg: ChatMessage = {
      id: `ai_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      senderType: 2,
      content: "",
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, aiMsg]);
    const ctrl = new AbortController();

    fetchEventSource("/api/psychological-chat/stream", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Token: localStorage.getItem("token") || "",
        Accept: "text/event-stream",
      },
      body: JSON.stringify({ sessionId, userMessage: message }),
      signal: ctrl.signal,
      onopen: (response) => {
        if (response.headers.get("content-type") !== "text/event-stream") {
          message.error("连接失败，服务器返回非流式数据类型");
          ctrl.abort();
        }
      },
      onmessage: (event) => {
        const data = event.data.trim();
        if (!data) return;
        const eventName = event.event;
        setMessages((prev) => {
          /*const copy = [...prev];
          const last = copy[copy.length - 1];*/
          if (eventName === "done") {
            setIsAiTyping(false);
            ctrl.abort();
            loadEmotionAnalysis(sessionId);
            return prev;
          }
          const payload = JSON.parse(data);
          if (String(payload.code) === "200" && payload.data?.content) {
            // ✅ 从 prev 最后一条 AI 消息读当前内容，而不是从 ref 读
            const last = prev[prev.length - 1];
            const currentContent =
              last && last.senderType === 2 ? last.content : "";
            const newContent = currentContent + payload.data.content;

            return prev.map((item, index) => {
              if (index === prev.length - 1 && item.senderType === 2) {
                return { ...item, content: newContent };
              }
              return item;
            });
          } else {
            handleError(
              payload.message || "AI助手处理失败，请稍后再重试",
              last,
            );
          }
          return prev;
        });
      },
      onerror: (err) => {
        setMessages((prev) => {
          const copy = [...prev];
          const last = copy[copy.length - 1];
          handleError(err?.message || "AI助手处理失败，请稍后再重试", last);
          return copy;
        });
        setIsAiTyping(false);
        throw err;
      },
      onclose: () => {
        loadEmotionAnalysis(sessionId);
      },
    });
  };

  // 错误处理
  const handleError = (errMsg: string, aiMsg: ChatMessage) => {
    aiMsg.content = "AI助手处理失败，请稍后再重试";
    aiMsg.isError = true;
    setIsAiTyping(false);
    message.error(errMsg);
  };

  // 回车发送
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // 切换历史会话
  const selectSession = async (item: ConversationItem) => {
    const msgList = await getSessionDetail(item.id);
    setMessages(msgList);
    const sid = `session_${item.id}`;
    loadEmotionAnalysis(sid);
    setCurrentConversation({
      sessionId: sid,
      status: "ACTIVE",
      sessionTitle: item.sessionTitle,
    });
  };

  // 删除会话
  const handleDeleteSession = (sessionId: number) => {
    Modal.confirm({
      title: "提示",
      content: "确定删除吗？",
      okText: "确定",
      cancelText: "取消",
      okType: "warning",
      onOk: async () => {
        const res = await deleteSession(sessionId);
        if (res === true) {
          message.success("删除成功");
          getSessionPage();
        }
      },
    });
  };

  // 换行转br
  const formatMessageContent = (content: string) => {
    return content.replace(/\n/g, "<br>");
  };

  // 情绪强度等级
  const getIntensityClass = (score: number) => {
    if (score >= 61) return 3;
    if (score >= 31) return 2;
    return 1;
  };

  // 风险文字
  const getRiskText = (level: number) => {
    const map: Record<number, string> = {
      0: "正常",
      1: "关注",
      2: "预警",
      3: "危机",
    };
    return map[level] || "正常";
  };

  // 加载情绪分析
  const loadEmotionAnalysis = async (sessionId: string) => {
    let id = sessionId;
    if (!sessionId.startsWith("session_")) id = `session_${sessionId}`;
    const res = await getEmotionAnalysis(id);
    setCurrentEmotion(res);
  };

  return (
    <div className="consultation-container">
      {/* 侧边栏 */}
      <div className="sidebar">
        <div className="ai-assistant-info">
          <div className="breathing-circle">
            <Image src={robotFill} width={25} height={25} preview={false} />
          </div>
          <h3 className="assistant-name">宁波AI助手</h3>
          <div className="online-status">
            <span className="status-dot" />
            在线服务中
          </div>
        </div>

        {/* 情绪花园 */}
        <div className="emotion-garden">
          <div className="garden-header">
            <div className="garden-title">情绪花园</div>
          </div>
          <div className="emotion-info">
            <div className="emotion-name">
              {currentEmotion.primaryEmotion || "中性"}
            </div>
            <div className="emotion-score">{currentEmotion.score || 50}</div>
          </div>
          <div className="warm-tips">
            <div className="emotion-status-text">
              <span className="status-label">今天感觉</span>
              <span className="status-emotion">
                {currentEmotion.isNegative ? "需要关注" : "很不错"}
              </span>
            </div>
            <div className="emotion-intensity">
              <div className="intensity-dots">
                {[1, 2, 3].map((dot) => (
                  <span
                    key={dot}
                    className={`dot ${getIntensityClass(currentEmotion.score) >= dot ? "active" : ""}`}
                  />
                ))}
                <span className="intensity-text">
                  {getRiskText(currentEmotion.riskLevel)}
                </span>
              </div>
            </div>
            {currentEmotion.suggestion && (
              <div className="warm-suggestion">
                <div className="suggestion-icon">💖</div>
                <div className="suggestion-content">
                  <div className="suggestion-title">给你的小建议</div>
                  <div className="suggestion-text">
                    {currentEmotion.suggestion}
                  </div>
                </div>
              </div>
            )}
            {currentEmotion.improvementSuggestions?.length > 0 && (
              <div className="healing-actions">
                <div className="actions-title">治愈小行动</div>
                <div className="actions-list">
                  {currentEmotion.improvementSuggestions.map((action, idx) => (
                    <div key={idx} className="action-item">
                      <div className="action-icon">✨</div>
                      <div className="action-text">{action}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {currentEmotion.isNegative && currentEmotion.riskLevel > 1 && (
              <div className="risk-notice">
                <div className="notice-icon">🤗</div>
                <div className="notice-content">
                  <div className="notice-title">温馨提示</div>
                  <div className="notice-text">
                    {currentEmotion.riskDescription}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 会话列表 */}
        <div className="session-history">
          <h4 className="session-title">会话列表</h4>
          <div className="session-list">
            {sessionList.map((session) => (
              <div
                key={session.id}
                className="session-item"
                onClick={() => selectSession(session)}
              >
                <div className="session-info">
                  <div className="session-title">
                    <span>{session.sessionTitle}</span>
                    <div className="session-meta">
                      <span className="session-time">{session.startedAt}</span>
                    </div>
                    <div className="session-preview">
                      {session.lastMessageContent}
                    </div>
                    <div className="session-stats">
                      <span>
                        <MessageOutlined /> {session.messageCount || 0}
                      </span>
                      <span>
                        <ClockCircleOutlined /> {session.durationMinutes || 0}
                        分钟
                      </span>
                    </div>
                  </div>
                  <div className="session-actions">
                    <Button
                      danger
                      type="text"
                      icon={<DeleteFilled />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteSession(session.id);
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 聊天主区域 */}
      <div className="chat-main">
        <div className="chat-header">
          <div className="header-left">
            <div className="chat-avatar">
              <Image src={like} width={25} height={25} preview={false} />
            </div>
            <div className="chat-info">
              <h2>宁波AI助手</h2>
              <p>您的贴心AI心理健康助手</p>
            </div>
          </div>
          <Button
            title="新建会话"
            icon={<PlusOutlined />}
            onClick={createNewFrontendSession}
          />
        </div>

        <div className="chat-messages" ref={chatBoxRef}>
          {messages.length === 0 && (
            <div className="message-item ai-message">
              <div className="message-avatar">
                <Image src={robotFill} width={25} height={25} preview={false} />
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  <p>
                    您好！我是小暖，您的AI心理健康助手。很高兴陪伴您，为您提供温暖的心理支持。请告诉我，今天您感觉怎么样？有什么想要分享的吗？
                  </p>
                </div>
                <div className="message-time">刚刚</div>
              </div>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`message-item ${msg.senderType === 1 ? "user-message" : "ai-message"}`}
            >
              <div className="message-avatar">
                <Image
                  src={msg.senderType === 1 ? users : robotFill}
                  width={18}
                  height={18}
                  preview={false}
                />
              </div>
              <div className="message-content">
                <div className="message-bubble">
                  {msg.senderType === 2 && isAiTyping && !msg.content ? (
                    <div className="typing-indicator">
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                      <div className="typing-dot" />
                    </div>
                  ) : msg.isError ? (
                    <div className="error-message">
                      <p>{msg.content}</p>
                    </div>
                  ) : msg.senderType === 2 ? (
                    <MarkdownRenderer content={msg.content} isAiMessage />
                  ) : (
                    <p
                      dangerouslySetInnerHTML={{
                        __html: formatMessageContent(msg.content),
                      }}
                    />
                  )}
                </div>
                <div className="message-time">
                  {msg.senderType === 2 && isAiTyping
                    ? "正在输入中..."
                    : msg.createdAt}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 输入框 */}
        <div className="chat-input">
          <div className="input-container">
            <TextArea
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="请输入您想要分享的内容..."
              rows={3}
              disabled={isAiTyping}
              onKeyDown={handleKeyDown}
              allowClear
              className="message-input"
              maxLength={500}
            />
            <div className="input-footer">
              <span>按Enter发送，Shift+Enter换行</span>
              <span>{userMessage.length}/500</span>
            </div>
          </div>
          <Button
            type="primary"
            className="send-btn"
            icon={<SendOutlined />}
            onClick={sendMessage}
            disabled={!userMessage.trim() || userMessage.length > 500}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatConsult;
