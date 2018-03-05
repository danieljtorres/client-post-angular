import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { User } from '../-interfaces/user';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  user: User = {
    id: 1,
    nombres: 'Jhon Jhon Doe Doe',
    cedula: '00000000',
    correo: 'jhondoe@gmail.com',
    actividades: [{
      nombre: 'Lorem Ipsum es simplemente el texto de relleno de las imprentas y archivos de texto'.toUpperCase(),
      tipo: 'PONENCIA',
      codigo: '654321'
    }],
    roles: ['ASISTENTE', 'COMITE']
  };

  apiBase = environment.apiBase;

  getInformation(cedula, codigo): Observable<any> {

    return this.http.get<any>(`${this.apiBase}/informacion/${cedula}/${codigo}`).map(res => {
      return res.data;
    });
  }

}
