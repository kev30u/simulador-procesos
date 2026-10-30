type BolitaProcesoProps = {
  nombre: string;
  onClick?: () => void;
};

export default function BolitaProceso({
  nombre,
  onClick,
}: BolitaProcesoProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-center text-xs font-bold text-white hover:bg-blue-600"
    >
      {nombre}
    </button>
  );
}