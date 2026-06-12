import Image from 'next/image';
import styles from './Logo.module.css';

type LogoSize = 'sm' | 'md' | 'lg' | 'hero' | 'featured';

const sizeMap: Record<LogoSize, number> = {
  sm: 32,
  md: 48,
  lg: 56,
  hero: 144,
  featured: 192,
};

interface LogoProps {
  size?: LogoSize;
  showText?: boolean;
  className?: string;
  priority?: boolean;
}

export function Logo({
  size = 'md',
  showText = false,
  className,
  priority = false,
}: LogoProps) {
  const dimension = sizeMap[size];

  return (
    <div className={`${styles.logo} ${className ?? ''}`}>
      <Image
        src="/logo.png"
        alt="روانصد"
        width={dimension}
        height={dimension}
        className={`${styles.logoImage} ${styles[`logoImage_${size}`]}`}
        priority={priority}
      />
      {showText ? <span className={styles.logoText}>روانصد</span> : null}
    </div>
  );
}
