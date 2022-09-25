import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ResponsePayload } from '../models/response-payload';

@Injectable({
  providedIn: 'root'
})
export class ListPostService {

  constructor(private http : HttpClient) { }

  // Get Post Where Category
  getPostWhereCate(cate: string) :Observable<ResponsePayload>{
    return this.http.get<ResponsePayload>(`${environment.postListUrl}?post=${cate}`)
  }

  // Get all list post
  getAllListPost() : Observable<ResponsePayload>{
    return this.http.get<ResponsePayload>(`${environment.postListUrl}`);
  }

  // Get post thuộc tuyển dụng
  getPostRecruitment() : Observable<ResponsePayload>{
    return this.http.get<ResponsePayload>(`${environment.postListUrl}?post=post-recruitment`);
  }
  // Get post thuộc cuộc thi
  getPostContest() : Observable<ResponsePayload>{
    return this.http.get<ResponsePayload>(`${environment.postListUrl}?post=post-contest`);
  }
  // Get post thuộc test năng lực
  getPostCapacity() : Observable<ResponsePayload>{
    return this.http.get<ResponsePayload>(`${environment.postListUrl}?post=post-capacity`);
  }
  getPostByCategory(data: string) : Observable<ResponsePayload>{
    return this.http.get<ResponsePayload>(`${environment.postListUrl}?post=${data}`);
  }
  
  // get detail post
  getPostBySlug(slug: any): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.postListUrl}/${slug}`);
  }

  // search
  searchPost(keyword: any): Observable<ResponsePayload> {
    return this.http.get<ResponsePayload>(`${environment.postListUrl}?keyword=${keyword}`);
  } 

  uploadCV(data: any): Observable<ResponsePayload> {
    return this.http.post<ResponsePayload>(`${environment.candidateUrl}/add`, data);
  }

  filterPost(keyword:string , post: string = "post-contest" , status: number = 0 ):Observable<ResponsePayload>{
    if(keyword == ""){
      return this.http.get<ResponsePayload>(`${environment.postListUrl}`);
    }
    let postChange =  post == "post-contest" ? 'post-contest' : post;
    let statusChange =  status == 0 ? '' : status;
    return this.http.get<ResponsePayload>(`${environment.postListUrl}?keyword=${keyword}&post==${postChange}&postHot=${statusChange}`);
  }
}
