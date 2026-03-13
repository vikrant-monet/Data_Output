import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class Api {

  constructor(private _http : HttpClient){}

  getApi(endpoint:string){
    return this._http.get(environment.apiUrl + endpoint);
  }
}
