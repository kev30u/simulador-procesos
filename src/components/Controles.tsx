type ControlesProps = {
  onDetener: () => void;
  onPausar: () => void;
  onReproducir: () => void;
  onAvanzar: () => void;
};

export default function Controles({
  onDetener,
  onPausar,
  onReproducir,
  onAvanzar,
}: ControlesProps) {
  return (
    <div className="rounded-md border border-slate-200 p-3">
      <h3 className="mb-3 font-medium">Controles</h3>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          aria-label="Reiniciar"
          title="Reiniciar"
          onClick={onDetener}
          className="cursor-pointer rounded-md bg-red-100 px-3 py-2 font-bold text-red-700 transition-all duration-150 hover:-translate-y-0.5 hover:bg-red-200 active:translate-y-0 active:scale-95"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 11a8 8 0 1 0-2.3 5.7" />
            <path d="M20 6v5h-5" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Pausar"
          title="Pausar"
          onClick={onPausar}
          className="cursor-pointer rounded-md bg-amber-100 px-3 py-2 font-bold text-amber-700 transition-all duration-150 hover:-translate-y-0.5 hover:bg-amber-200 active:translate-y-0 active:scale-95"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <rect x="6" y="5" width="4" height="14" rx="1" />
            <rect x="14" y="5" width="4" height="14" rx="1" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Iniciar o continuar"
          title="Iniciar o continuar"
          onClick={onReproducir}
          className="cursor-pointer rounded-md bg-green-100 px-3 py-2 font-bold text-green-700 transition-all duration-150 hover:-translate-y-0.5 hover:bg-green-200 active:translate-y-0 active:scale-95"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="m8 5 11 7-11 7V5Z" />
          </svg>
        </button>
        <button
          type="button"
          aria-label="Avanzar un tic"
          title="Avanzar un tic"
          onClick={onAvanzar}
          className="cursor-pointer rounded-md bg-slate-200 px-3 py-2 font-bold transition-all duration-150 hover:-translate-y-0.5 hover:bg-slate-300 active:translate-y-0 active:scale-95"
        >
          <svg
            aria-hidden="true"
            className="h-5 w-5"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="m4 5 7 7-7 7V5Zm9 0 7 7-7 7V5Z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
