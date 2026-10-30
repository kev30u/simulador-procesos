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
  return (
    <div className="flex flex-wrap gap-4">
      {programas.map((programa) => (
        <div key={programa.nombre} className="flex flex-col items-center gap-2">
          <BolitaProceso
            nombre={programa.nombre}
            onClick={() => onProgramaClick(programa.nombre)}
          />
        </div>
      ))}
    </div>
  );
}