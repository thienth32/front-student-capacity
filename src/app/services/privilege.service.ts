import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponsePayload } from '../models/response-payload';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PrivilegeService {

  constructor(private http: HttpClient) { }

  getPrivileges(page: string | null): Observable<ResponsePayload> {
    let pageQuery = page == null ? "1" : page;
    return this.http.get<ResponsePayload>(`${environment.privilege}?page=${pageQuery}`);
  }
}
