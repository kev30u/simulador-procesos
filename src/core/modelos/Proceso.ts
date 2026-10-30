import { BCP } from "./BCP";

// Zona donde esta el proceso: programas, preparados o en ejecucion.
export type Estado = "inactivo" | "preparado" | "ejecucion";

// Esta misma clase sirve para el programa y para el proceso, lo que cambia es si tiene BCP.
export class Proceso {
  public readonly nombre: string;

  // Dejo _bcp privado para que solo se cambie con asignarBCP y quitarBCP.
  // Es null cuando todavía es solo un programa.
  private _bcp: BCP | null = null;

  public estado: Estado = "inactivo";

  constructor(nombre: string) {
    this.nombre = nombre;
    this.estado = "inactivo";
    this._bcp = null;
  }

  public get bcp(): BCP | null {
    return this._bcp;
  }

  // Si tiene BCP es un proceso, si no es un programa.
  public get isProcess(): boolean {
    return this._bcp !== null;
  }

  // Asignar y quitar el BCP no cambia el estado, eso lo maneja el simulador.
  public asignarBCP(bcp: BCP): void {
    this._bcp = bcp;
  }

  public quitarBCP(): void {
    this._bcp = null;
  }
}
