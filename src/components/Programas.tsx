import type { ProcesoResponse } from "@/types/estado";
import BolitaProceso from "./BolitaProceso";

type ProgramasProps = {
  programas: ProcesoResponse[];
  onProgramaClick: (nombre: string) => void;
};

export default function Programas({
  programas,
  onProgramaClick,
}: ProgramasProps) {
  if (programas.length === 0) {
    return (
      <p className="rounded-md border border-dashed border-slate-200 bg-slate-50 px-3 py-6 text-center text-sm text-slate-500">
        No hay programas disponibles
      </p>
    );
  }

  return (
    <div className="space-y-2.5">
      {programas.map((programa) => (
        <BolitaProceso
          key={programa.nombre}
          proceso={programa}
          variante="tarjeta"
          onClick={() => onProgramaClick(programa.nombre)}
        />
      ))}
    </div>
  );
}
