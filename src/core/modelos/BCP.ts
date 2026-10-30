export class BCP {
  // Rata de quantum provisional, se define solo aqui para cambiarla facil despues.
  private static readonly RATA_QUANTUM = 2;

  // Limites de los valores aleatorios.
  private static readonly TIEMPO_CPU_MIN = 1;
  private static readonly TIEMPO_CPU_MAX = 10;
  private static readonly PRIORIDAD_MIN = 1;
  private static readonly PRIORIDAD_MAX = 5;
  private static readonly INTERACTIVIDAD_MIN = 1;
  private static readonly INTERACTIVIDAD_MAX = 5;

  // Uso static para que todas las instancias de BCP compartan la misma secuencia de PID.
  private static contadorPid = 1;

  public readonly pid: number;
  public readonly tiempoCpu: number;
  public readonly quantum: number;
  public readonly prioridad: number;
  public readonly interactividad: number;
  private _tiempoRestante: number;

  constructor() {
    this.pid = BCP.contadorPid;
    BCP.contadorPid++;

    // El tiempo de CPU se genera primero porque el quantum depende de el.
    this.tiempoCpu = BCP.numeroAleatorio(BCP.TIEMPO_CPU_MIN, BCP.TIEMPO_CPU_MAX);

    // Se redondea hacia arriba y nunca puede ser menor que 1.
    this.quantum = Math.max(1, Math.ceil(this.tiempoCpu / BCP.RATA_QUANTUM));

    // 5 es la prioridad mas alta.
    this.prioridad = BCP.numeroAleatorio(BCP.PRIORIDAD_MIN, BCP.PRIORIDAD_MAX);

    this.interactividad = BCP.numeroAleatorio(
      BCP.INTERACTIVIDAD_MIN,
      BCP.INTERACTIVIDAD_MAX,
    );

    this._tiempoRestante = this.tiempoCpu;
  }

  get tiempoRestante(): number {
    return this._tiempoRestante;
  }

  // El proceso termino cuando ya no le queda tiempo de CPU.
  public get estaTerminado(): boolean {
    return this._tiempoRestante <= 0;
  }

  // Lo usa el boton Reiniciar para que los PID vuelvan a empezar en 1.
  public static reiniciarContador(): void {
    BCP.contadorPid = 1;
  }

  public gastarTiempo(): void {
    // Solo resto si queda tiempo, asi nunca baja de 0.
    if (this._tiempoRestante > 0) {
      this._tiempoRestante--;
    }
  }

  private static numeroAleatorio(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }
}
