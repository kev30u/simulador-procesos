type BolitaProcesoProps = {
  nombre: string;
};

export default function BolitaProceso({ nombre }: BolitaProcesoProps) {
  return (
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-center text-xs font-bold text-white">
      {nombre}
    </div>
  );
}