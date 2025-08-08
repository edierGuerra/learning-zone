import React from "react";
import './styles/Label.css';

// Etiqueta para identificar campos
export function Label({ children }: React.PropsWithChildren) {
  return <label className="custom-label">{children}</label>;
}
