import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponsePayload } from '../models/response-payload';


@Injectable({
  providedIn: 'root'
})
export class MajorService {

  constructor(private http: HttpClient) { }

  // Lấy tất cả chuyên ngành
  getAll(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(environment.majorListUrl);
  }

  // Lấy tất cả chuyên ngành tuyển dụng
  getAllForRecruitment(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.majorListUrl}/recruitment`);
  }

  // Lấy chuyên ngành theo slug
  getMajorWhereSlug(slug: string): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.majorListUrl}/${slug}`);
  }

  // Tìm kiếm chuyên ngành
  searchMajor(keyword: string): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.majorListUrl}?q=${keyword}`);
  }

  // Danh sách kết quả cuộc thi.
  getResultWhereMajor(slug: string): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.publicApiUrl}/rating/major-contest/${slug}`);
  }
}
