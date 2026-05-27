import { memo, useState, useRef, useCallback, useEffect } from 'react';
import { Send, Heart } from 'lucide-react';
import styles from './ChatbotPage.module.css';

interface ChatComposerProps {
  disabled: boolean;
  onSend: (text: string) => void;
  placeholder?: string;
}

/** Isolated from the message list so streaming updates do not re-render (and de-focus) the field. */
export const ChatComposer = memo(function ChatComposer({
  disabled,
  onSend,
  placeholder = 'پیام خود را بنویسید...',
}: ChatComposerProps) {
  const [value, setValue] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const focusField = useCallback(() => {
    const el = textareaRef.current;
    if (!el || el.disabled) return;
    el.focus({ preventScroll: true });
    const len = el.value.length;
    el.setSelectionRange(len, len);
  }, []);

  useEffect(() => {
    if (!disabled) {
      focusField();
    }
  }, [disabled, focusField]);

  const submit = useCallback(() => {
    const text = value.trim();
    if (!text || disabled) return;

    setValue('');
    onSend(text);

    queueMicrotask(focusField);
    requestAnimationFrame(focusField);
  }, [value, disabled, onSend, focusField]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key !== 'Enter' || e.shiftKey) return;
    e.preventDefault();
    submit();
  };

  return (
    <div className={styles.inputArea}>
      <div className={styles.inputContainer}>
        <textarea
          ref={textareaRef}
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={styles.input}
          dir="rtl"
          disabled={disabled}
          autoFocus={!disabled}
          enterKeyHint="send"
        />
        <button
          type="button"
          onMouseDown={(e) => e.preventDefault()}
          onClick={submit}
          disabled={!value.trim() || disabled}
          className={styles.sendButton}
          aria-label="ارسال پیام"
        >
          <Send />
        </button>
      </div>
      <div className={styles.privacyNote}>
        <Heart />
        <span className={styles.privacyText}>تمام گفتگوها محرمانه و ایمن هستند</span>
      </div>
    </div>
  );
});
