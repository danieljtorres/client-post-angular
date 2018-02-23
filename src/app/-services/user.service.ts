import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { environment } from '../../environments/environment';
import { User } from '../-interfaces/user';

@Injectable()
export class UserService {

  constructor(private http: HttpClient) { }

  apiBase = environment.apiBase;

  getInformation(cedula, codigo): Observable<any> {

    return this.http.get<User>(`${this.apiBase}/informacion/${cedula}/${codigo}`).map(res => {
      return res;
    });
  }

}
