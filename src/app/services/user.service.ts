import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { ResponsePayload } from "../models/response-payload";
import { User } from "../models/user";

@Injectable({
  providedIn: "root",
})
export class UserService {
  private userSubject: BehaviorSubject<User>;
  private jwtToken: BehaviorSubject<string>;
  public user: Observable<User | null>;
  constructor(private http: HttpClient) {
    this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem("user") || "{}"));
    this.jwtToken = new BehaviorSubject<string>(localStorage.getItem("auth_token") || "");
    this.user = this.userSubject.asObservable();
  }

  public getUserValue() {
    return this.userSubject.value;
  }

  public getJwtToken() {
    return this.jwtToken.value;
  }

  login(authToken: string) {
    return this.http.post<ResponsePayload>(environment.loginUrl, { token: authToken }).pipe(
      map((response) => {
        if (response.status == true) {
          let dataUser = response.payload!.user;
          if (dataUser.avatar == null) {
            dataUser.avatar = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
          }
          localStorage.setItem("user", JSON.stringify(response.payload!.user));
          localStorage.setItem("avatar", JSON.stringify(dataUser.avatar));
          localStorage.setItem("auth_token", response.payload!.token);
          localStorage.setItem("token_type", JSON.stringify(response.payload!.token_type));
          this.userSubject.next(response.payload.user);
          this.jwtToken.next(response.payload.token);
        }

        return response.status;
      }),
    );
  }

  loginLocal(data: any) {

    // localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("avatar", JSON.stringify("https://cdn-icons-png.flaticon.com/512/149/149071.png"));
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("token_type", JSON.stringify(data.token_type));
    // this.userSubject.next(data.user);
    this.jwtToken.next(data.token);
  }

  // Update localStorageHasEdit
  setLocalStorageHasEdit(user: User) {
    localStorage.setItem("user", JSON.stringify(user));
    this.userSubject.next(user);
  }

  logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("auth_token");
    localStorage.removeItem("token_type");
    localStorage.removeItem("test_result");
    this.userSubject.next(JSON.parse("{}"));
    this.jwtToken.next("");
  }

  listUser(): Observable<Array<User>> {
    return this.http.get<Array<User>>(environment.userListUrl);
  }

  //  Các cuộc thi mà user đã tham gia
  getContestByUser(): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.userListUrl}/contest-joined-and-not-joined?sort=desc`);
  }

  // Lộc cuộc thi đã tham gia theo trạng thái
  getContestByUserStatus(key_word: string, status: any): Observable<ResponsePayload> {
    const params = new HttpParams().set("status", status).set("q", key_word);
    return this.http.get<ResponsePayload>(`${environment.userListUrl}/contest-joined?${params}`);
  }

  // Chỉnh sửa thông tin user
  editInfoUser(data: any): Observable<ResponsePayload> {
    const headers = new HttpHeaders();
    return this.http.post<ResponsePayload>(`${environment.userListUrl}/edit`, data);
  }

  // get list contest user has join
  getListContestHasJoin(sta: any, sort: string): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(
      `${environment.userListUrl}/contest-joined-and-not-joined?status=${sta}&sort=${sort}`,
    );
  }

  // ds đánh giá năng lực đã tham gia
  getListCapacityUserHasDone(paramsArgs?: {}): Observable<ResponsePayload> {
    const params = new HttpParams({
      fromObject: {
        type: 1,
        ...paramsArgs,
      },
    });

    return this.http.get<ResponsePayload>(`${environment.userListUrl}/contest-joined`, {
      params,
    });
  }

  // Phân trang theo link
  getContestWherePage(url: string): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${url}?sort=desc`);
  }

  filterContestHasLogin(keyword: string = "", major_id: number, status: number): Observable<ResponsePayload> {
    let majorValue;
    let statusValue;
    majorValue = major_id == undefined ? "" : major_id;
    statusValue = status == 0 ? 1 : status;
    const params = new HttpParams().set("q", keyword).set("status", statusValue).set("major_id", majorValue);
    return this.http.get<ResponsePayload>(`${environment.userListUrl}/contest-joined-and-not-joined?${params}`);
  }

  registerCapacity(data: any): Observable<ResponsePayload> {
    return this.http.post<ResponsePayload>(`${environment.userUrl}/register-capacity`, data);
  }
}
