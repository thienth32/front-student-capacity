import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponsePayload } from '../models/response-payload';
import { QA } from '../models/qa.model';

@Injectable({
    providedIn: 'root'
})
export class QAService {

    constructor(private http: HttpClient) { }

    getQAInternship(): Observable<ResponsePayload> {
        return this.http.get<ResponsePayload>(`${environment.qaUrl}/internship`);
    }

    getQAJob(): Observable<ResponsePayload> {
        return this.http.get<ResponsePayload>(`${environment.qaUrl}/job`);
    }

    getQAEvent(): Observable<ResponsePayload> {
        return this.http.get<ResponsePayload>(`${environment.qaUrl}/event`);
    }
}
