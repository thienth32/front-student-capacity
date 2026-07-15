import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponsePayload } from '../models/response-payload';
import { faQq } from '@fortawesome/free-brands-svg-icons';

@Injectable({
    providedIn: 'root'
})
export class QAService {

    constructor(private http: HttpClient) { }

    getFaqList(page: string | null): Observable<ResponsePayload> {
        let pageQuery = page == null ? "1" : page;
        return this.http.get<ResponsePayload>(`${environment.qaUrl}?page=${pageQuery}`);
    }

    filterFaq(keyword: string, categoryId: string = '', page: string): Observable<ResponsePayload> {
        return this.http.get<ResponsePayload>(`${environment.qaUrl}?page=${page}&keyword=${keyword}&category_id=${categoryId}`);
    }

    getQADetail(faq: any): Observable<ResponsePayload> {
        return this.http.get<ResponsePayload>(`${environment.qaUrl}/detail/${faq}`);
    }

    getRelated(faq: any): Observable<ResponsePayload> {
        return this.http.get<ResponsePayload>(`${environment.qaUrl}/related/${faq}`);
    }

    rating(faq: any, data: any): Observable<ResponsePayload> {
        return this.http.post<ResponsePayload>(`${environment.qaUrl}/rate/${faq}`, data);
    }

    getListCategory(): Observable<ResponsePayload> {
        return this.http.get<ResponsePayload>(`${environment.qaUrl}/categories`);
    }
}
