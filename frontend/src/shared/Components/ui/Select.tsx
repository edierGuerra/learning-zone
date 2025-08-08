import React, { useState, useRef, useEffect } from "react";
import "./styles/Select.css";

interface SelectProps {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}

export function Select({ value, onValueChange, children }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        selectRef.current &&
        !selectRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Proporcionar contexto a los hijos
  const contextValue = {
    value,
    onValueChange,
    isOpen,
    setIsOpen,
  };

  return (
    <div className="custom-select" ref={selectRef}>
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              selectContext: contextValue,
            })
          : child
      )}
    </div>
  );
}

export function SelectTrigger({ children, selectContext }: any) {
  const handleClick = () => {
    selectContext?.setIsOpen(!selectContext.isOpen);
  };

  return (
    <div className="select-trigger" onClick={handleClick}>
      {children}
    </div>
  );
}

export function SelectContent({ children, selectContext }: any) {
  if (!selectContext?.isOpen) return null;

  return (
    <div className="select-content">
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child as React.ReactElement<any>, {
              selectContext,
            })
          : child
      )}
    </div>
  );
}

export function SelectItem({ value, children, selectContext }: any) {
  const handleClick = () => {
    selectContext?.onValueChange(value);
    selectContext?.setIsOpen(false);
  };

  return (
    <div className="select-item" onClick={handleClick}>
      {children}
    </div>
  );
}

export function SelectValue({
  placeholder = "Seleccione...",
  selectContext,
}: any) {
  // Buscar el texto del item seleccionado
  const getDisplayValue = () => {
    if (!selectContext?.value) return placeholder;

    // Aquí puedes mapear valores a textos más amigables
    const valueMap: Record<string, string> = {
      text: "Texto",
      video: "Video",
      image: "Imagen",
      open_question: "Abierta",
      multiple_choice: "Cerrada",
    };

    return valueMap[selectContext.value] || selectContext.value;
  };

  return <span className="select-value">{getDisplayValue()}</span>;
}
