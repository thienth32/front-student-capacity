import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponsePayload } from '../models/response-payload';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MentorService {

    constructor(private http:HttpClient) { }
  
    getListMentor(page: string | null): Observable<ResponsePayload> {
      let pageQuery = page == null ? "1" : page;
      
      return this.http.get<ResponsePayload>(`${environment.mentor}?page=${pageQuery}`);
    }

    getTopMentor(): Observable<ResponsePayload> {
      return this.http.get<ResponsePayload>(`${environment.mentor}`);
    }

    filterMentor(keyword: string, page: string): Observable<ResponsePayload> {
      return this.http.get<ResponsePayload>(`${environment.mentor}?page=${page}&keyword=${keyword}`);
    }

    getDetailMentor(mentor: any): Observable<ResponsePayload> {
      return this.http.get<ResponsePayload>(`${environment.mentor}/detail/${mentor}`);
    }
}
