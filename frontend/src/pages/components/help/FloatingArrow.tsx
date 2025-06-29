import { FaArrowLeft } from "react-icons/fa";
import './styles/Help.css';

type ArrowProps = {
  top: string;
  left?: string;
  right?: string;
  zIndex?: number;
  rotation: string;
};

export default function FloatingArrow({
  top,
  left,
  right,
  zIndex = 9999, 
  rotation
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
        fontSize: "8rem",
        color: "",
        zIndex,
        pointerEvents: "none",
      }}
    />
  );
}

