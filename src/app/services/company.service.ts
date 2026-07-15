import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponsePayload } from '../models/response-payload';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) { }

  // Lấy ra tất cả doanh nghiệp
  getAllCompany(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.companyListUrl}?status=1&limit=20`);
  }
}
