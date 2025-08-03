import React from "react";
import './styles/Input.css';

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className="custom-input" {...props} />;
}
