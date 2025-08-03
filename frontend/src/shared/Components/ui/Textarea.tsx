import React from "react";
import './styles/Textarea.css';

// Área de texto para escribir párrafos largos
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className="custom-textarea" {...props} />;
}
