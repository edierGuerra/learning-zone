import React, { useState } from "react";
import './styles/Select.css';

export function Select({ value, onValueChange, children }: any) {
  return <div className="custom-select">{children}</div>;
}

export function SelectTrigger({ children }: React.PropsWithChildren) {
  return <div className="select-trigger">{children}</div>;
}

export function SelectContent({ children }: React.PropsWithChildren) {
  return <div className="select-content">{children}</div>;
}

export function SelectItem({ value, children }: { value: string, children: React.ReactNode }) {
  return <div className="select-item" data-value={value}>{children}</div>;
}

export function SelectValue() {
  return <span className="select-value">Seleccione...</span>;
}
