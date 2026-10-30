import { Proceso } from "../modelos/Proceso";

// Árbol de prioridad mínima (min-heap). Lo dejo en un arreglo porque así no toca
// manejar nodos ni punteros, y la raíz (posición 0) siempre es el siguiente en ejecutarse.
export class ArbolPrioridadMinima {
  // Posiciones en el arreglo: padre de i = (i - 1) / 2 redondeado hacia abajo,
  // hijo izquierdo = 2i + 1, hijo derecho = 2i + 2.
  private procesos: Proceso[] = [];

  public insertar(proceso: Proceso): void {
    // Solo entran procesos con BCP, porque sin BCP no hay quantum ni prioridad para comparar.
    if (!proceso.isProcess) {
      throw new Error(
        `"${proceso.nombre}" no tiene BCP, solo los procesos pueden entrar al árbol`,
      );
    }

    // Evito meter el mismo proceso dos veces por si alguien lo llama repetido.
    if (this.procesos.includes(proceso)) {
      throw new Error(`"${proceso.nombre}" ya está dentro del árbol`);
    }

    this.procesos.push(proceso);
    this.subir(this.procesos.length - 1);
  }

  public extraerMenor(): Proceso | null {
    if (this.estaVacio()) {
      return null;
    }

    const raiz = this.procesos[0];
    const ultimo = this.procesos.pop()!;

    // Ojo: si solo había un proceso, el pop ya dejó el arreglo vacío y no hay nada que reacomodar.
    if (this.procesos.length > 0) {
      // Subo el último a la raíz y lo dejo bajar hasta su lugar.
      this.procesos[0] = ultimo;
      this.bajar(0);
    }

    return raiz;
  }

  public estaVacio(): boolean {
    return this.procesos.length === 0;
  }

  public recorrerEnOrden(): Proceso[] {
    // En el heap solo la raíz está garantizada como la menor, el resto no está ordenado.
    // Por eso ordeno una copia, así no daño el árbol para dibujarlo.
    return [...this.procesos].sort((a, b) => this.comparar(a, b));
  }

  // Para el botón Reiniciar: deja el árbol vacío otra vez.
  public vaciar(): void {
    this.procesos = [];
  }

  // Regla para ver quién va primero:
  // 1. menor quantum, 2. mayor prioridad (5 es la más alta), 3. menor pid.
  // Ojo: no se debe quitar ni cambiar el BCP de un proceso mientras esté acá adentro.
  private comparar(a: Proceso, b: Proceso): number {
    // Uso ! porque insertar ya validó que todos tengan BCP.
    const bcpA = a.bcp!;
    const bcpB = b.bcp!;

    if (bcpA.quantum !== bcpB.quantum) {
      return bcpA.quantum - bcpB.quantum;
    }

    if (bcpA.prioridad !== bcpB.prioridad) {
      return bcpB.prioridad - bcpA.prioridad;
    }

    return bcpA.pid - bcpB.pid;
  }

  // El proceso nuevo entra al final y va subiendo mientras le gane a su padre.
  private subir(posicion: number): void {
    while (posicion > 0) {
      const padre = Math.floor((posicion - 1) / 2);

      if (this.comparar(this.procesos[posicion], this.procesos[padre]) >= 0) {
        break;
      }

      this.intercambiar(posicion, padre);
      posicion = padre;
    }
  }

  // Después de poner el último en la raíz, lo bajo cambiándolo por el hijo
  // que vaya primero, hasta que ya ningún hijo le gane.
  private bajar(posicion: number): void {
    while (true) {
      const izquierdo = 2 * posicion + 1;
      const derecho = 2 * posicion + 2;
      let primero = posicion;

      if (
        izquierdo < this.procesos.length &&
        this.comparar(this.procesos[izquierdo], this.procesos[primero]) < 0
      ) {
        primero = izquierdo;
      }

      if (
        derecho < this.procesos.length &&
        this.comparar(this.procesos[derecho], this.procesos[primero]) < 0
      ) {
        primero = derecho;
      }

      if (primero === posicion) {
        break;
      }

      this.intercambiar(posicion, primero);
      posicion = primero;
    }
  }

  private intercambiar(i: number, j: number): void {
    const temporal = this.procesos[i];
    this.procesos[i] = this.procesos[j];
    this.procesos[j] = temporal;
  }
}
