export type EstadoProceso = "inactivo" | "preparado" | "ejecucion";

export interface BcpResponse {
  pid: number;
  quantum: number;
  prioridad: number;
  interactividad: number;
  tiempoCpu: number;
  tiempoRestante: number;
}

export interface ProcesoResponse {
  nombre: string;
  estado: EstadoProceso;
  bcp: BcpResponse | null;
}

export interface EstadoSimulador {
  programas: ProcesoResponse[];
  preparados: ProcesoResponse[];
  enEjecucion: ProcesoResponse | null;
  turnoGastado: number;
}

export interface IniciarRequest {
  nombre: string;
}

export interface ErrorResponse {
  error: string;
}