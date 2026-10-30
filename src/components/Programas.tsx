import BolitaProceso from "./BolitaProceso";

type ProgramasProps = {
  programas: string[];
};

export default function Programas({ programas }: ProgramasProps) {
  return (
    <div className="flex flex-wrap gap-4">
      {programas.map((programa) => (
        <div key={programa} className="flex flex-col items-center gap-2">
          <BolitaProceso nombre={programa} />
        </div>
      ))}
    </div>
  );
}