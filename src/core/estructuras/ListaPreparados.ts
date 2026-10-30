import { Proceso } from "../modelos/Proceso";

// TEMPORAL: hace de ArbolBinario mientras A termina el suyo.
// Tiene los mismos métodos, así que luego se cambia sin tocar nada más.
export class ListaPreparados {
  private procesos: Proceso[] = [];

  // Mete el proceso y reordena la lista con la regla de comparación.
  public insertar(proceso: Proceso): void {
    this.procesos.push(proceso);
    this.procesos.sort((a, b) => this.comparar(a, b));
  }

  // El primero de la lista es el "más a la izquierda" del árbol.
  public extraerMenor(): Proceso | null {
    return this.procesos.shift() ?? null;
  }

  public estaVacio(): boolean {
    return this.procesos.length === 0;
  }

  // Copia de la lista para que quien la use no pueda alterar la original.
  public recorrerEnOrden(): Proceso[] {
    return [...this.procesos];
  }

  // Menor quantum primero; si empatan, mayor prioridad; si empatan, menor PID.
  private comparar(a: Proceso, b: Proceso): number {
    const bcpA = a.bcp;
    const bcpB = b.bcp;
    if (!bcpA || !bcpB) {
      throw new Error("Solo los procesos con BCP pueden estar en Preparados");
    }

    if (bcpA.quantum !== bcpB.quantum) return bcpA.quantum - bcpB.quantum;
    if (bcpA.prioridad !== bcpB.prioridad) return bcpB.prioridad - bcpA.prioridad;
    return bcpA.pid - bcpB.pid;
  }
}