// FloatingArrow.tsx
import { FaArrowLeft } from "react-icons/fa";

export type ArrowProps = {
  top: string;
  left?: string;
  right?: string;
  zIndex?: number;
  rotation: string;
  color?: string;
  overHeader?: boolean; 
};

export default function FloatingArrow({
  top,
  left,
  right,
  zIndex = 9999,
  rotation,
  color = "white",
  overHeader = false, 
}: ArrowProps) {
  return (
    <FaArrowLeft
      className="floating-arrow"
      style={{
        position: "absolute",
        top,
        left,
        right,
        transform: `rotate(${rotation})`,
        fontSize: "4.4rem",
        color,
        zIndex: overHeader ? 10001 : zIndex,
        pointerEvents: "none",
      }}
    />
  );
}
