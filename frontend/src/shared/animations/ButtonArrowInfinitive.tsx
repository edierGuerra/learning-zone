// BtnArrowInfinite.tsx
import { motion } from "framer-motion";
import { MdOutlineKeyboardDoubleArrowDown } from "react-icons/md";
type BtnArrowInfiniteProps = {
    color?: string;
};

export default function BtnArrowInfinite({
    color = "#111827",
}: BtnArrowInfiniteProps) {
    const handleClick = () => {
        window.scrollTo(0, 700);
    }
    return (
        <motion.button onClick={() => handleClick()}
            style={{
            background: "transparent",
            border: "none",
            cursor: "pointer",
            fontSize: "3rem",
            color:color,
            }}
            animate={{
            y: [0, 10, 0], // sube y baja
            opacity: [0, 1, 0], // aparece y desaparece
            }}
            transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            }}
        >
            <MdOutlineKeyboardDoubleArrowDown />
        </motion.button>
        );
        }
