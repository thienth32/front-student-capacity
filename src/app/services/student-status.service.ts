import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { ResponsePayload } from "../models/response-payload";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: "root",
})
export class StudentStatusService {

  constructor(private http: HttpClient) {
  }

  getListStudentStatuses() {
    return this.http.get<ResponsePayload>(`${environment.studentStatusListUrl}`);
  }
}
