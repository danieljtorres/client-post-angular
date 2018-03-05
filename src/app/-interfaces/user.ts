import { Activity } from './activity';

export interface User {
    id: number;
    nombres: string;
    cedula: string;
    correo: string;
    actividades: Array<Activity>;
    roles: Array<string>;
}
