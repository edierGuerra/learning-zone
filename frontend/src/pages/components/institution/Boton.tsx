type BotonProps = {
  isActive: boolean;
  onClick: () => void;
};

export default function Boton({ isActive, onClick }: BotonProps) {
  return (
    <span
      className={`dot ${isActive ? "active" : ""}`}
      onClick={onClick}
    />
  );
}