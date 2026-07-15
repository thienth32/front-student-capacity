import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponsePayload } from '../models/response-payload';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {

  constructor(private http:HttpClient) { }

  getListService(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.service}`);
  }
}
