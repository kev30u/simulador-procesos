type ControlesProps = {
  onRetroceder: () => void;
  onDetener: () => void;
  onPausar: () => void;
  onReproducir: () => void;
  onAvanzar: () => void;
};

export default function Controles({
  onRetroceder,
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
          aria-label="Retroceder un tic"
          onClick={onRetroceder}
          className="rounded-md bg-slate-200 px-3 py-2 font-bold hover:bg-slate-300"
        >
          &lt;&lt;
        </button>
        <button
          type="button"
          aria-label="Detener"
          onClick={onDetener}
          className="rounded-md bg-red-100 px-3 py-2 font-bold text-red-700 hover:bg-red-200"
        >
          ■
        </button>
        <button
          type="button"
          aria-label="Pausar"
          onClick={onPausar}
          className="rounded-md bg-amber-100 px-3 py-2 font-bold text-amber-700 hover:bg-amber-200"
        >
          ||
        </button>
        <button
          type="button"
          aria-label="Iniciar o continuar"
          onClick={onReproducir}
          className="rounded-md bg-green-100 px-3 py-2 font-bold text-green-700 hover:bg-green-200"
        >
          &gt;
        </button>
        <button
          type="button"
          aria-label="Avanzar un tic"
          onClick={onAvanzar}
          className="rounded-md bg-slate-200 px-3 py-2 font-bold hover:bg-slate-300"
        >
          &gt;&gt;
        </button>
      </div>
    </div>
  );
}