import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ResponsePayload } from "../models/response-payload";

@Injectable({
  providedIn: "root",
})
export class ContestService {
  constructor(private http: HttpClient) {}

  // Gọi tất cả các cuộc thi
  getAll(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.contestListUrl}?sort=desc`);
  }

  // Lấy ra cuộc thi theo id
  getWhereId(id: any): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.contestListUrl}/${id}`);
  }

  // Gọi cuộc thi theo trạng thái
  getWhereStatus(status: number, sort: string): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.contestListUrl}?status=${status}&sort=${sort}`);
  }

  // Phân trang theo link
  getContestWherePage(url: string): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(url);
  }

  getWhereStatusAndMajor(status: number, major_id: number): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(
      `${environment.contestListUrl}?status=${status}&major_id=${major_id}&sort='desc'`,
    );
  }

  // Tìm kiếm cuộc thi
  searchContest(keyword: string): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.contestListUrl}` + keyword);
  }

  // Lọc theo chuyên ngành
  getWhereMajor(major_id: any): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.contestListUrl}?major_id=${major_id}&sort='desc'`);
  }

  // Cuộc thi liên quan
  getContestWhereMajor(contest_id: number): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.contestListUrl}/${contest_id}/related`);
  }

  // Bộ lọc cuộc thi
  filterContest(keyword: string = "", major_id: number, status: number = 1, type: number): Observable<ResponsePayload> {
    let majorValue;
    let statusValue;
    let contestType;
    majorValue = major_id == undefined ? "" : major_id;
    contestType = type == undefined ? "" : type;
    statusValue = status == 0 ? 1 : status;
    const params = new HttpParams().set("q", keyword).set("status", statusValue).set("major_id", majorValue).set('type', contestType);
    return this.http.get<ResponsePayload>(`${environment.contestListUrl}?${params}`);
  }

  // getAllContest Rank
  getAllContestRank() {
    return this.http.get<ResponsePayload>(`${environment.contestListUrl}/demo`);
  }

  getDetailContest(contestId: number) {
    return this.http.get<ResponsePayload>(`${environment.contestListUrl}/${contestId}/demo`);
  }
}
