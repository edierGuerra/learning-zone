import React from "react";
import './styles/Card.css';

export function Card({ children }: React.PropsWithChildren) {
  return <div className="custom-card">{children}</div>;
}

export function CardHeader({ children }: React.PropsWithChildren) {
  return <div className="card-header">{children}</div>;
}

export function CardContent({ children }: React.PropsWithChildren) {
  return <div className="card-content">{children}</div>;
}

export function CardTitle({ children }: React.PropsWithChildren) {
  return <h3 className="card-title">{children}</h3>;
}
