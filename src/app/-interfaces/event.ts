import { Signatory } from './signatory';

export interface Event {
    id: number;
    nombre: string;
    codigo: string;
    encabezado: string;
    institucion: string;
    tipo: string;
    lugar: string;
    inicio: string;
    fin: string;
    mes: string;
    ano: string;
    url: string;
    logo_1: string;
    logo_2: string;
    fondo: string;
    firmantes: Array<Signatory>;
}
