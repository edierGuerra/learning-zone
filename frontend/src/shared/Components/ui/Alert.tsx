import React from "react";
import './styles/Alert.css';

export function Alert({ children, className }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={`custom-alert ${className || ''}`}>{children}</div>;
}

export function AlertDescription({ children }: React.PropsWithChildren) {
  return <p className="alert-description">{children}</p>;
}
