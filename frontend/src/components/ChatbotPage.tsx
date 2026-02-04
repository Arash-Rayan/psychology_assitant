import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Smile, Meh, Frown, Heart, Brain, Angry, SmilePlus } from 'lucide-react';
import styles from './ChatbotPage.module.css';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  emotion?: 'positive' | 'neutral' | 'negative';
  timestamp: Date;
  showMoodEmojis?: boolean;
}

type MoodType = 'very_sad' | 'sad' | 'normal' | 'good' | 'amazing';

export function ChatbotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'سلام! امروز چطور بود؟ 🌟',
      sender: 'bot',
      emotion: 'positive',
      timestamp: new Date(),
      showMoodEmojis: true
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [moodSelected, setMoodSelected] = useState(false);

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

  const handleMoodSelect = (mood: MoodType) => {
    if (moodSelected) return;
    
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

  const handleSend = () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const responses = [
        { text: 'متوجه منظورتون شدم. ممکنه بیشتر توضیح بدید؟', emotion: 'neutral' as const },
        { text: 'خیلی خوب است که این احساستون رو با من در میان گذاشتید. بیایید باهم کارش کنیم.', emotion: 'positive' as const },
        { text: 'درک می‌کنم که این موقعیت برای شما سخت است. می‌خواهید درباره‌اش بیشتر صحبت کنیم؟', emotion: 'neutral' as const }
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: randomResponse.text,
        sender: 'bot',
        emotion: randomResponse.emotion,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 1500);
  };

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
          <div className={styles.chatHeader}>
            <div className={styles.headerContent}>
              <div className={styles.headerIcon}>
                <Brain />
              </div>
              <div className={styles.headerText}>
                <h2>روان‌یار</h2>
                <p>دستیار هوشمند سلامت روان</p>
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
          <div className={styles.messagesArea}>
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
                      <p className={styles.messageText}>{message.text}</p>
                      
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

          {/* Input Area */}
          <div className={styles.inputArea}>
            <div className={styles.inputContainer}>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                placeholder="پیام خود را بنویسید..."
                className={styles.input}
                dir="rtl"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
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
