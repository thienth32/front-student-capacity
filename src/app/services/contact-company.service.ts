import { publicApiUrl } from "./../../environments/environment";
import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { ResponsePayload } from "../models/response-payload";
import { HttpClient, HttpParams } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class ContactCompanyService {

  constructor(private http: HttpClient) {}

  contactAddCompany(data: any): Observable<ResponsePayload> {
    return this.http.post<ResponsePayload>(`${publicApiUrl}/company-contact/add`, data);
  }


}
