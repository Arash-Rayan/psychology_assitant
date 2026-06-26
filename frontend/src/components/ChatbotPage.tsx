import { useState, useEffect, useLayoutEffect, useRef, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Smile, Meh, Frown, ClipboardList } from 'lucide-react';
import { Logo } from './Logo';
import ReactMarkdown from 'react-markdown';
import { ChatComposer } from './ChatComposer';
import styles from './ChatbotPage.module.css';
import {
  filterUserVisiblePreConsultMessages,
  parsePreConsultSubject,
  type PreConsultSubject,
} from '@/utils/preConsultMessages';

export type { PreConsultSubject } from '@/utils/preConsultMessages';

export type ChatbotVariant = 'assistant' | 'pre_consult';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  emotion?: 'positive' | 'neutral' | 'negative';
  timestamp: Date;
  showMoodEmojis?: boolean;
  showSubjectOptions?: boolean;
}

type MoodType = 'very_sad' | 'sad' | 'normal' | 'good' | 'amazing';

const PRE_CONSULT_SUBJECTS: {
  id: PreConsultSubject;
  label: string;
  description: string;
}[] = [
  { id: 'couples', label: 'زوجین', description: 'روابط زناشویی و زوج‌درمانی' },
  { id: 'individual', label: 'فردی', description: 'نگرانی‌ها و سلامت روان شخصی' },
  { id: 'pre_marriage', label: 'پیش از ازدواج', description: 'آمادگی و سوالات قبل از ازدواج' },
];

const ASSISTANT_WELCOME_MESSAGE = `سلام 👋

من ربات روانصد هستم.

اینجا هستم تا با دقت به حرف‌هات گوش بدم، کمک کنم راحت‌تر درباره تجربه‌ها و احساس‌هات صحبت کنی، و اطلاعاتی که به اشتراک می‌ذاری رو به شکلی امن و منظم به دکترت منتقل کنم.

حریم خصوصی و امنیت اطلاعاتت برای ما خیلی مهمه و با دقت ازش محافظت می‌شه.

ممنون که به تیم روانصد اعتماد کردی 🤍`;

const SESSION_STORAGE_KEY: Record<ChatbotVariant, string> = {
  assistant: 'ruansad_chat_session_id',
  pre_consult: 'ruansad_pre_consult_session_id',
};

interface HistoryMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

interface PreConsultProgress {
  questions_asked: number;
  question_limit: number;
  phase: 'questions' | 'handoff';
  consultation_subject?: PreConsultSubject | null;
}

interface ChatHistoryResponse {
  session_id: number | null;
  messages: HistoryMessage[];
  pre_consult?: PreConsultProgress;
}

function resolveChatEndpoint(variant: ChatbotVariant): string {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '');
  if (variant === 'pre_consult') {
    const override = process.env.NEXT_PUBLIC_PRE_CONSULT_CHAT_URL?.trim();
    if (override) return override;
    return `${base}/chat/pre-consult`;
  }
  return `${base}/chat`;
}

function resolveHistoryEndpoint(variant: ChatbotVariant): string {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '');
  if (variant === 'pre_consult') {
    return `${base}/chat/pre-consult/history`;
  }
  return `${base}/chat/history`;
}

function createWelcomeMessages(variant: ChatbotVariant): Message[] {
  if (variant === 'pre_consult') {
    return [
      {
        id: '1',
        text:
          'سلام، به بخش **پیش‌مشاوره** خوش آمدید.\n\nاین بخش برای کسانی است که هنوز ویزیت با درمانگر نداشته‌اند. ابتدا موضوع را انتخاب کنید؛ سپس **۱۰ سوال** کوتاه و مفید می‌پرسیم تا برای ویزیت آماده شوید. در پایان می‌توانید هر نکتهٔ دیگری را برای درمانگر بنویسید.',
        sender: 'bot',
        emotion: 'positive',
        timestamp: new Date(),
        showMoodEmojis: false,
        showSubjectOptions: true,
      },
    ];
  }
  return [
    {
      id: 'welcome',
      text: ASSISTANT_WELCOME_MESSAGE,
      sender: 'bot',
      emotion: 'positive',
      timestamp: new Date(),
    },
    {
      id: 'mood-prompt',
      text: 'امروز چطور بود؟ 🌟',
      sender: 'bot',
      emotion: 'positive',
      timestamp: new Date(),
      showMoodEmojis: true,
    },
  ];
}

function mapHistoryToMessages(messages: HistoryMessage[]): Message[] {
  return messages
    .filter((m) => m.role === 'user' || m.role === 'assistant')
    .map((m, index) => ({
      id: `hist-${index}`,
      text: m.content,
      sender: m.role === 'user' ? 'user' : 'bot',
      emotion: m.role === 'assistant' ? 'neutral' as const : undefined,
      timestamp: new Date(m.created_at),
    }));
}

interface ChatbotPageProps {
  variant?: ChatbotVariant;
}

export function ChatbotPage({ variant = 'assistant' }: ChatbotPageProps) {
  const chatEndpoint = useMemo(() => resolveChatEndpoint(variant), [variant]);
  const historyEndpoint = useMemo(() => resolveHistoryEndpoint(variant), [variant]);
  const sessionStorageKey = SESSION_STORAGE_KEY[variant];

  const [messages, setMessages] = useState<Message[]>([]);
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [moodSelected, setMoodSelected] = useState(false);
  const [subjectSelected, setSubjectSelected] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<PreConsultSubject | null>(null);
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [preConsultProgress, setPreConsultProgress] = useState<PreConsultProgress | null>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);
  const isTypingRef = useRef(isTyping);
  isTypingRef.current = isTyping;

  const selectedSubjectMeta = useMemo(
    () => PRE_CONSULT_SUBJECTS.find((s) => s.id === selectedSubject) ?? null,
    [selectedSubject],
  );

  const emotionIcons = {
    positive: Smile,
    neutral: Meh,
    negative: Frown
  };

  const moodEmojis = [
    { type: 'very_sad' as MoodType, emoji: '😢', label: 'خیلی بد', color: '#ef4444' },
    { type: 'sad' as MoodType, emoji: '😔', label: 'بد', color: '#f97316' },
    { type: 'normal' as MoodType, emoji: '😐', label: 'معمولی', color: '#eab308' },
    { type: 'good' as MoodType, emoji: '😊', label: 'خوب', color: '#22c55e' },
    { type: 'amazing' as MoodType, emoji: '😄', label: 'عالی', color: '#10b981' }
  ];

  const scrollToBottom = useCallback((smooth = false) => {
    const area = messagesAreaRef.current;
    if (!area) return;
    area.scrollTo({
      top: area.scrollHeight,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }, []);

  const inputDisabled = variant === 'pre_consult' && !subjectSelected;

  const preConsultSubtitle = useMemo(() => {
    if (variant !== 'pre_consult' || !subjectSelected) {
      return 'قبل از ویزیت — راهنما و سوالات اولیه';
    }
    if (preConsultProgress?.phase === 'handoff') {
      return 'هر نکتهٔ دیگری برای درمانگر — همینجا بنویسید';
    }
    if (preConsultProgress) {
      return `${preConsultProgress.questions_asked} از ${preConsultProgress.question_limit} سوال`;
    }
    return '۱۰ سوال کوتاه، سپس یادداشت برای درمانگر';
  }, [variant, subjectSelected, preConsultProgress]);

  useLayoutEffect(() => {
    scrollToBottom(false);
  }, [messages, isTyping, scrollToBottom]);

  useEffect(() => {
    let cancelled = false;
    const storedSessionId = localStorage.getItem(sessionStorageKey);

    async function loadHistory() {
      setHistoryLoaded(false);
      setMessages([]);
      setMoodSelected(false);
      setSubjectSelected(false);
      setSelectedSubject(null);
      setShowSubjectPicker(false);
      setPreConsultProgress(null);
      setSessionId(null);
      setIsTyping(false);

      const params = new URLSearchParams();
      if (storedSessionId) {
        params.set('session_id', storedSessionId);
      }

      try {
        const res = await fetch(`${historyEndpoint}?${params.toString()}`);
        if (!res.ok) {
          throw new Error('History request failed');
        }

        const data = (await res.json()) as ChatHistoryResponse;
        if (cancelled) return;

        const rawMessages = data.messages ?? [];
        const visibleMessages =
          variant === 'pre_consult'
            ? filterUserVisiblePreConsultMessages(rawMessages)
            : rawMessages;

        if (visibleMessages.length > 0 && data.session_id != null) {
          setSessionId(data.session_id);
          localStorage.setItem(sessionStorageKey, String(data.session_id));
          setMessages(mapHistoryToMessages(visibleMessages));
          if (variant === 'pre_consult') {
            const subjectFromApi = parsePreConsultSubject(data.pre_consult?.consultation_subject);
            if (subjectFromApi) {
              setSelectedSubject(subjectFromApi);
              setSubjectSelected(true);
            } else {
              setSubjectSelected(visibleMessages.some((m) => m.role === 'user'));
            }
            if (data.pre_consult) {
              setPreConsultProgress(data.pre_consult);
            }
          }
          if (variant === 'assistant') {
            setMoodSelected(true);
          }
        } else {
          localStorage.removeItem(sessionStorageKey);
          setMessages(createWelcomeMessages(variant));
        }
      } catch {
        if (!cancelled) {
          localStorage.removeItem(sessionStorageKey);
          setMessages(createWelcomeMessages(variant));
        }
      } finally {
        if (!cancelled) {
          setHistoryLoaded(true);
        }
      }
    }

    void loadHistory();

    return () => {
      cancelled = true;
    };
  }, [variant, historyEndpoint, sessionStorageKey]);

  const handleMoodSelect = (mood: MoodType) => {
    if (moodSelected || variant === 'pre_consult') return;
    
    setMoodSelected(true);
    
    // Find the selected emoji label
    const selectedMood = moodEmojis.find(m => m.type === mood);
    
    // Add user's mood as a message
    const userMessage: Message = {
      id: Date.now().toString(),
      text: `${selectedMood?.emoji} ${selectedMood?.label}`,
      sender: 'user',
      timestamp: new Date()
    };
    
    setMessages(prev => prev.map(msg => 
      msg.showMoodEmojis ? { ...msg, showMoodEmojis: false } : msg
    ).concat(userMessage));
    
    setIsTyping(true);
    
    // Generate response based on mood
    setTimeout(() => {
      let responseText = '';
      let emotion: 'positive' | 'neutral' | 'negative' = 'neutral';
      
      switch (mood) {
        case 'very_sad':
          responseText = 'متاسفم که روز خیلی سختی داشتی 💙 می‌خوای درباره‌اش حرف بزنیم؟ من اینجام که گوش بدم.';
          emotion = 'negative';
          break;
        case 'sad':
          responseText = 'متوجهم که روز خوبی نبوده 🌸 بیا باهم حرف بزنیم، شاید کمکت کنه.';
          emotion = 'negative';
          break;
        case 'normal':
          responseText = 'روز معمولی هم خوبه! گاهی وقت‌ها همین آرامش کافیه ☺️ چیزی هست که دوست داری درموردش حرف بزنیم؟';
          emotion = 'neutral';
          break;
        case 'good':
          responseText = 'خوشحالم که روز خوبی داشتی! 😊 چه اتفاقی روزت رو خوب کرد؟';
          emotion = 'positive';
          break;
        case 'amazing':
          responseText = 'وای چه عالی! 🎉✨ خیلی خوشحالم برات! بگو ببینم چی شد که این قدر روز خوبی داشتی؟';
          emotion = 'positive';
          break;
      }
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: 'bot',
        emotion: emotion,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const streamChatReply = useCallback(async (
    userText: string,
    options?: {
      newSession?: boolean;
      consultationSubject?: PreConsultSubject;
      bootstrapFirstQuestion?: boolean;
    },
  ) => {
    setIsTyping(true);

    try {
      const payload: Record<string, unknown> = { message: userText };
      if (options?.bootstrapFirstQuestion) {
        payload.bootstrap_first_question = true;
      }
      if (options?.newSession) {
        payload.new_session = true;
        setSessionId(null);
        localStorage.removeItem(sessionStorageKey);
      } else if (sessionId != null) {
        payload.session_id = sessionId;
      }
      const subjectForRequest = options?.consultationSubject ?? selectedSubject;
      if (variant === 'pre_consult' && subjectForRequest) {
        payload.consultation_subject = subjectForRequest;
      }

      const res = await fetch(chatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok || !res.body) {
        throw new Error('Request failed');
      }

      const returnedSessionId = res.headers.get('X-Session-Id');
      if (returnedSessionId) {
        const sid = Number.parseInt(returnedSessionId, 10);
        if (!Number.isNaN(sid)) {
          setSessionId(sid);
          localStorage.setItem(sessionStorageKey, String(sid));
        }
      }

      if (variant === 'pre_consult') {
        const askedHeader = res.headers.get('X-Pre-Consult-Questions-Asked');
        const limitHeader = res.headers.get('X-Pre-Consult-Question-Limit');
        const phaseHeader = res.headers.get('X-Pre-Consult-Phase');
        if (askedHeader != null && limitHeader != null) {
          const questionLimit = Number.parseInt(limitHeader, 10);
          const askedBefore = Number.parseInt(askedHeader, 10);
          setPreConsultProgress({
            questions_asked: Math.min(askedBefore + 1, questionLimit),
            question_limit: questionLimit,
            phase: phaseHeader === 'handoff' ? 'handoff' : 'questions',
          });
        }
      }

      const botId = (Date.now() + 1).toString();
      const botMessage: Message = {
        id: botId,
        text: '',
        sender: 'bot',
        emotion: 'neutral',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let accumulated = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          if (!chunk) continue;

          accumulated += chunk;
          setMessages((prev) =>
            prev.map((m) => (m.id === botId ? { ...m, text: accumulated } : m)),
          );
        }
      }

      setIsTyping(false);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'خطا در ارتباط با سرور. لطفاً بعداً دوباره امتحان کنید.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
    }
  }, [chatEndpoint, sessionId, sessionStorageKey, variant, selectedSubject]);

  const handleSubjectSelect = async (
    subject: (typeof PRE_CONSULT_SUBJECTS)[number],
    options?: { isChange?: boolean },
  ) => {
    if (variant !== 'pre_consult' || isTyping) return;
    const isChange = options?.isChange ?? false;
    if (!isChange && subjectSelected) return;

    setShowSubjectPicker(false);
    setSubjectSelected(true);
    setSelectedSubject(subject.id);
    setPreConsultProgress(null);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: `پیش‌مشاوره برای: ${subject.label}`,
      sender: 'user',
      timestamp: new Date(),
    };

    if (isChange) {
      setMessages([userMessage]);
    } else {
      setMessages((prev) =>
        prev
          .map((msg) => (msg.showSubjectOptions ? { ...msg, showSubjectOptions: false } : msg))
          .concat(userMessage),
      );
    }

    await streamChatReply('', {
      newSession: true,
      consultationSubject: subject.id,
      bootstrapFirstQuestion: true,
    });
  };

  const handleSendMessage = useCallback(
    (text: string) => {
      if (isTypingRef.current || inputDisabled || !historyLoaded) return;

      const userMessage: Message = {
        id: Date.now().toString(),
        text,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      void streamChatReply(text);
    },
    [inputDisabled, historyLoaded, streamChatReply],
  );

  const getEmotionClass = (emotion?: string) => {
    if (emotion === 'positive') return styles.emotionPositive;
    if (emotion === 'neutral') return styles.emotionNeutral;
    if (emotion === 'negative') return styles.emotionNegative;
    return '';
  };

  return (
    <div className={styles.container} dir="rtl">
      <div className={styles.chatWrapper}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={styles.chatCard}
        >
          {/* Chat Header */}
          <div
            className={`${styles.chatHeader} ${variant === 'pre_consult' ? styles.chatHeaderPreConsult : ''}`}
          >
            <div className={styles.headerContent}>
              {variant === 'pre_consult' ? (
                <div className={styles.headerIcon}>
                  <ClipboardList />
                </div>
              ) : (
                <Logo size="lg" />
              )}
              <div className={styles.headerText}>
                <h2>{variant === 'pre_consult' ? 'پیش‌مشاوره' : 'روانصد'}</h2>
                <p>
                  {variant === 'pre_consult'
                    ? preConsultSubtitle
                    : 'دستیار هوشمند سلامت روان'}
                </p>
              </div>
              <div className={styles.statusContainer}>
                <div className={styles.statusIndicator}>
                  <div className={styles.statusDot}></div>
                  <span className={styles.statusText}>آنلاین</span>
                </div>
              </div>
            </div>
            {variant === 'pre_consult' && subjectSelected && selectedSubjectMeta && (
              <div className={styles.subjectBar}>
                <span className={styles.subjectBarLabel}>
                  موضوع: <strong>{selectedSubjectMeta.label}</strong>
                </span>
                <button
                  type="button"
                  className={styles.subjectChangeButton}
                  onClick={() => setShowSubjectPicker((open) => !open)}
                  disabled={isTyping}
                >
                  {showSubjectPicker ? 'بستن' : 'تغییر موضوع'}
                </button>
              </div>
            )}
            {variant === 'pre_consult' && showSubjectPicker && (
              <div className={styles.headerSubjectPicker}>
                {PRE_CONSULT_SUBJECTS.map((subject) => (
                  <button
                    key={subject.id}
                    type="button"
                    className={`${styles.headerSubjectOption} ${
                      selectedSubject === subject.id ? styles.headerSubjectOptionActive : ''
                    }`}
                    onClick={() => void handleSubjectSelect(subject, { isChange: true })}
                    disabled={isTyping || selectedSubject === subject.id}
                  >
                    {subject.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Messages Area */}
          <div className={styles.messagesArea} ref={messagesAreaRef}>
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className={`${styles.messageContainer} ${
                    message.sender === 'user' ? styles.messageContainerUser : styles.messageContainerBot
                  }`}
                >
                  <div className={`${styles.messageBubble} ${
                    message.sender === 'user' ? styles.messageBubbleUser : styles.messageBubbleBot
                  }`}>
                    <div
                      className={`${styles.messageContent} ${
                        message.sender === 'user' ? styles.messageContentUser : styles.messageContentBot
                      }`}
                    >
                      {message.sender === 'bot' ? (
                        <div className={`${styles.messageText} ${styles.markdownContent}`}>
                          <ReactMarkdown>{message.text}</ReactMarkdown>
                        </div>
                      ) : (
                        <p className={styles.messageText}>{message.text}</p>
                      )}
                      
                      {/* Pre-consult subject selection */}
                      {message.showSubjectOptions && !subjectSelected && variant === 'pre_consult' && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.2 }}
                          className={styles.subjectOptionsContainer}
                        >
                          {PRE_CONSULT_SUBJECTS.map((subject) => (
                            <motion.button
                              key={subject.id}
                              type="button"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={() => handleSubjectSelect(subject)}
                              disabled={isTyping}
                              className={styles.subjectOptionButton}
                            >
                              <span className={styles.subjectOptionLabel}>{subject.label}</span>
                              <span className={styles.subjectOptionDescription}>{subject.description}</span>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}

                      {/* Mood emoji buttons */}
                      {message.showMoodEmojis && !moodSelected && (
                        <motion.div 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.3 }}
                          className={styles.moodEmojisContainer}
                        >
                          {moodEmojis.map((mood) => (
                            <motion.button
                              key={mood.type}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleMoodSelect(mood.type)}
                              className={styles.moodEmojiButton}
                              style={{ borderColor: mood.color }}
                            >
                              <span className={styles.moodEmoji}>{mood.emoji}</span>
                              <span className={styles.moodLabel} style={{ color: mood.color }}>
                                {mood.label}
                              </span>
                            </motion.button>
                          ))}
                        </motion.div>
                      )}
                    </div>
                    <div className={`${styles.messageMeta} ${
                      message.sender === 'bot' ? styles.messageMetaBot : ''
                    }`}>
                      <span className={styles.messageTime}>
                        {message.timestamp.toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {message.emotion && message.sender === 'bot' && (
                        <div className={`${styles.emotionIcon} ${getEmotionClass(message.emotion)}`}>
                          {(() => {
                            const Icon = emotionIcons[message.emotion];
                            return <Icon />;
                          })()}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={styles.typingIndicator}
              >
                <div className={styles.typingBubble}>
                  <div className={styles.typingDots}>
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      className={styles.typingDot}
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      className={styles.typingDot}
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      className={styles.typingDot}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <ChatComposer
            key={variant}
            disabled={inputDisabled || !historyLoaded}
            onSend={handleSendMessage}
            placeholder={
              inputDisabled
                ? 'ابتدا موضوع پیش‌مشاوره را از بالا انتخاب کنید...'
                : 'پیام خود را بنویسید...'
            }
          />
        </motion.div>
      </div>
    </div>
  );
}
