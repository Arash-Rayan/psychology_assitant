import styles from "./Badge.module.css";
import { cn } from "@/lib/utils";

type BadgeProps = {
  children: React.ReactNode;
  variant?: "default" | "primary" | "accent" | "validation";
  className?: string;
};

export function Badge({ children, variant = "default", className }: BadgeProps) {
  return <span className={cn(styles.badge, styles[variant], className)}>{children}</span>;
}
