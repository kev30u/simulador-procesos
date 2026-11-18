export type EstadoProceso =
  | "inactivo"
  | "preparado"
  | "ejecucion"
  | "suspendido";

export interface BcpResponse {
  pid: number;
  quantum: number;
  prioridad: number;
  interactividad: number;
  tiempoCpu: number;
  tiempoRestante: number;
  tiempoInteractividadRestante: number;
}

export interface ProcesoResponse {
  nombre: string;
  color: string;
  estado: EstadoProceso;
  bcp: BcpResponse | null;
}

export interface EstadoSimulador {
  programas: ProcesoResponse[];
  preparados: ProcesoResponse[];
  suspendidos: ProcesoResponse[];
  enEjecucion: ProcesoResponse | null;
  turnoGastado: number;
}

export interface IniciarRequest {
  nombre: string;
}

export interface ErrorResponse {
  error: string;
}