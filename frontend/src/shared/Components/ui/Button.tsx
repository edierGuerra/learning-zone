import React from "react";
import './styles/Button.css';

export function Button({ children, onClick, type = "button" }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button className="custom-button" onClick={onClick} type={type}>
      {children}
    </button>
  );
}
