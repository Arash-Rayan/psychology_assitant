import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Smile, Meh, Frown, Heart, Brain, ClipboardList } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import styles from './ChatbotPage.module.css';

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

export type PreConsultSubject = 'couples' | 'individual' | 'pre_marriage';

const PRE_CONSULT_SUBJECTS: {
  id: PreConsultSubject;
  label: string;
  description: string;
}[] = [
  { id: 'couples', label: 'زوجین', description: 'روابط زناشویی و زوج‌درمانی' },
  { id: 'individual', label: 'فردی', description: 'نگرانی‌ها و سلامت روان شخصی' },
  { id: 'pre_marriage', label: 'پیش از ازدواج', description: 'آمادگی و سوالات قبل از ازدواج' },
];

function resolveChatEndpoint(variant: ChatbotVariant): string {
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL ?? 'http://localhost:8000').replace(/\/$/, '');
  if (variant === 'pre_consult') {
    const override = process.env.NEXT_PUBLIC_PRE_CONSULT_CHAT_URL?.trim();
    if (override) return override;
    return `${base}/chat/pre-consult`;
  }
  return `${base}/chat`;
}

function createInitialMessages(variant: ChatbotVariant): Message[] {
  if (variant === 'pre_consult') {
    return [
      {
        id: '1',
        text:
          'سلام، به بخش **پیش‌مشاوره** خوش آمدید.\n\nاین بخش برای کسانی است که هنوز ویزیت با درمانگر نداشته‌اند. لطفاً ابتدا موضوع پیش‌مشاوره خود را انتخاب کنید:',
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
      id: '1',
      text: 'سلام! امروز چطور بود؟ 🌟',
      sender: 'bot',
      emotion: 'positive',
      timestamp: new Date(),
      showMoodEmojis: true,
    },
  ];
}

interface ChatbotPageProps {
  variant?: ChatbotVariant;
}

export function ChatbotPage({ variant = 'assistant' }: ChatbotPageProps) {
  const chatEndpoint = useMemo(() => resolveChatEndpoint(variant), [variant]);

  const [messages, setMessages] = useState<Message[]>(() => createInitialMessages(variant));
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [moodSelected, setMoodSelected] = useState(false);
  const [subjectSelected, setSubjectSelected] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<PreConsultSubject | null>(null);
  const [streamingBotId, setStreamingBotId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesAreaRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll to bottom when messages change or during streaming
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    setMessages(createInitialMessages(variant));
    setMoodSelected(false);
    setSubjectSelected(false);
    setSelectedSubject(null);
    setInputValue('');
    setStreamingBotId(null);
    setIsTyping(false);
  }, [variant]);

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

  const streamChatReply = async (
    userText: string,
    options?: { newSession?: boolean; consultationSubject?: PreConsultSubject },
  ) => {
    setIsTyping(true);

    try {
      const payload: Record<string, unknown> = { message: userText };
      if (options?.newSession) payload.new_session = true;
      if (options?.consultationSubject) {
        payload.consultation_subject = options.consultationSubject;
      }

      const res = await fetch(chatEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok || !res.body) {
        throw new Error('Request failed');
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
      setStreamingBotId(botId);

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
          scrollToBottom();
        }
      }

      setIsTyping(false);
      setStreamingBotId(null);
      setTimeout(() => scrollToBottom(), 100);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        text: 'خطا در ارتباط با سرور. لطفاً بعداً دوباره امتحان کنید.',
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      setIsTyping(false);
      setStreamingBotId(null);
    }
  };

  const handleSubjectSelect = async (subject: (typeof PRE_CONSULT_SUBJECTS)[number]) => {
    if (subjectSelected || variant !== 'pre_consult' || isTyping) return;

    setSubjectSelected(true);
    setSelectedSubject(subject.id);

    const userMessage: Message = {
      id: Date.now().toString(),
      text: `پیش‌مشاوره برای: ${subject.label}`,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) =>
      prev
        .map((msg) => (msg.showSubjectOptions ? { ...msg, showSubjectOptions: false } : msg))
        .concat(userMessage),
    );

    await streamChatReply(
      `کاربر موضوع «${subject.label}» را انتخاب کرد (${subject.description}). لطفاً کوتاه خوش‌آمد بگو و یک سوال متمرکز دربارهٔ همین موضوع بپرس.`,
      { newSession: true, consultationSubject: subject.id },
    );
  };

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    if (variant === 'pre_consult' && !subjectSelected) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');

    await streamChatReply(currentInput);
  };

  const inputDisabled = variant === 'pre_consult' && !subjectSelected;

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
              <div className={styles.headerIcon}>
                {variant === 'pre_consult' ? <ClipboardList /> : <Brain />}
              </div>
              <div className={styles.headerText}>
                <h2>{variant === 'pre_consult' ? 'پیش‌مشاوره' : 'روانصد'}</h2>
                <p>
                  {variant === 'pre_consult'
                    ? 'قبل از ویزیت — راهنما و سوالات اولیه'
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
                      {message.sender === 'bot' && message.id === streamingBotId ? (
                        <p className={styles.messageText}>{message.text}</p>
                      ) : message.sender === 'bot' ? (
                        <div className={`${styles.messageText} ${styles.markdownContent}`}>
                          <ReactMarkdown>
                            {message.text}
                          </ReactMarkdown>
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
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className={styles.inputArea}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && !inputDisabled && handleSend()}
                placeholder={
                  inputDisabled
                    ? 'ابتدا موضوع پیش‌مشاوره را از بالا انتخاب کنید...'
                    : 'پیام خود را بنویسید...'
                }
                className={styles.input}
                dir="rtl"
                disabled={inputDisabled || isTyping}
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim() || inputDisabled || isTyping}
                className={styles.sendButton}
              >
                <Send />
              </button>
            </div>
            <div className={styles.privacyNote}>
              <Heart />
              <span className={styles.privacyText}>
                تمام گفتگوها محرمانه و ایمن هستند
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
