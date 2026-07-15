import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponsePayload } from '../models/response-payload';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobfairService {

  constructor(private http:HttpClient) { }

  getLastestJobfair(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.jobfair}`);
  }
}
