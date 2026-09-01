import type { CSSProperties } from "react";
import type { LucideIcon } from "lucide-react";

interface SFSymbolProps {
  icon: LucideIcon;
  size?: number;
  color?: string;
  strokeWidth?: number;
  fill?: string;
  style?: CSSProperties;
}

export function SFSymbol({
  icon: Icon,
  size = 20,
  color = "currentColor",
  strokeWidth = 1.7,
  fill = "none",
  style,
}: SFSymbolProps) {
  return (
    <Icon
      aria-hidden="true"
      size={size}
      color={color}
      strokeWidth={strokeWidth}
      fill={fill}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ display: "block", flexShrink: 0, ...style }}
    />
  );
}
