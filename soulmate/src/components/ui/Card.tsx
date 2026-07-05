import styles from "./Card.module.css";
import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
};

export function Card({ children, className, hover, padding = "md" }: CardProps) {
  return (
    <div className={cn(styles.card, styles[padding], hover && styles.hover, className)}>
      {children}
    </div>
  );
}
