import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ResponsePayload } from "../models/response-payload";

@Injectable({
  providedIn: "root",
})
export class SliderService {
  constructor(private http: HttpClient) {}

  getListSlider(namePage: string, nameId: string, pageId: any): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.sliderListUrl}?${namePage}=1&${nameId}=${pageId}`);
  }

  getSliderByParams(paramsArgs?: {}): Observable<ResponsePayload> {
    const params = new HttpParams({
      fromObject: paramsArgs,
    });

    return this.http.get<ResponsePayload>(`${environment.sliderListUrl}`, {
      params,
    });
  }

  //lấy thông số cho trang chủ
  getListStat(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.stats}`);
  }
}
