import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HttpClientModule, HTTP_INTERCEPTORS } from "@angular/common/http";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from "angularx-social-login";
import { environment } from "src/environments/environment";
import { LoginComponent } from "./auth/login/login.component";
import { JwtInterceptor } from "./_helpers/jwt.interceptor";
import { ErrorInterceptor } from "./_helpers/error.interceptor";
import { CarouselModule } from "ngx-owl-carousel-o";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FontAwesomeModule, FaIconLibrary } from "@fortawesome/angular-fontawesome";
import { ContestComponent } from "./pages/contest/contest.component";
import { HomeLayoutComponent } from "./layouts/home-layout/home-layout.component";
import { ContestDeatailComponent } from "./pages/contest-detail/contest-deatail.component";
import { BannerComponent } from "./component/banner/banner.component";
import { BackTimeComponent } from "./component/back-time/back-time.component";
import { RoundComponent } from "./component/round/round.component";
import { BackTopComponent } from "./component/back-top/back-top.component";
import { LoadingItemComponent } from "./loading/loading-item/loading-item.component";
import { TypeExamPipe } from "./helper/pipe/type-exam.pipe";
import { FormatDatePipe } from "./helper/pipe/format-date.pipe";
import { ListAvatarUserComponent } from "./component/list-avatar-user/list-avatar-user.component";
import { SlickCarouselModule } from "ngx-slick-carousel";
import { NgxSkeletonLoaderModule } from "ngx-skeleton-loader";
import { ContestLoadItemComponent } from "./loading/contest-load-item/contest-load-item.component";
import { MaterialModule } from "./material/material.module";
import { ModalAddTeamComponent } from "./modal/modal-add-team/modal-add-team.component";
import { NgToastModule } from "ng-angular-popup";
import { InfoTeamComponent } from "./pages/info-team/info-team.component";
import { ProfileUserComponent } from "./component/profile-user/profile-user.component";
import { ContestUserJoinComponent } from "./component/contest-user-join/contest-user-join.component";
import { ContestItemComponent } from "./component/contest-item/contest-item.component";
import { ModalListMemberComponent } from "./modal/modal-list-member/modal-list-member.component";
import { RoundDetailComponent } from "./component/round-detail/round-detail.component";
import { IntoExamComponent } from "./pages/into-exam/into-exam.component";
import { ListResultRoundComponent } from "./component/list-result-round/list-result-round.component";
import { RoundContestDetailComponent } from "./pages/round-contest-detail/round-contest-detail.component";
import { LoadingPageComponent } from "./loading/loading-page/loading-page.component";
import { registerLocaleData } from "@angular/common";
import en from "@angular/common/locales/en";
import { HeaderComponent } from "./layouts/header/header.component";
import { FooterComponent } from "./layouts/footer/footer.component";
import { RecruitmentComponent } from "./pages/recruitment/recruitment.component";
import { RecruitmentPostComponent } from "./pages/recruitment-post/recruitment-post.component";
import { ModalInfoTeamComponent } from "./modal/modal-info-team/modal-info-team.component";

registerLocaleData(en);

import { ModalUploadCvComponent } from "./modal/modal-upload-cv/modal-upload-cv.component";
import { ProfileLayoutComponent } from "./layouts/profile-layout/profile-layout.component";
import { MyCapacityTestComponent } from "./pages/my-capacity-test/my-capacity-test.component";
import { CapacityExamComponent } from "./pages/capacity-exam/capacity-exam.component";
import { DialogConfirmComponent } from "./modal/dialog-confirm/dialog-confirm.component";
import { CapacityDetailComponent } from "./pages/capacity-detail/capacity-detail.component";
import { RecruitmentDetailComponent } from "./pages/recruitment-detail/recruitment-detail.component";
import { CapacityItemComponent } from "./component/capacity-item/capacity-item.component";
import { ListPostComponent } from "./component/list-post/list-post.component";
import { PostsComponent } from "./pages/posts/posts.component";
import { RankStudentComponent } from "./modal/rank-student/rank-student.component";
import { AvatarComponent } from "./component/avatar/avatar.component";
import { HomeComponent } from "./pages/home/home.component";
import { ContestAsideComponent } from "./component/contest-aside/contest-aside.component";
import { PostRelatedItemComponent } from "./component/post-related-item/post-related-item.component";
import { ModalHistoryCapacityComponent } from "./modal/modal-history-capacity/modal-history-capacity.component";
import { ModalLoginComponent } from "./modal/modal-login/modal-login.component";
import { AsidePostComponent } from "./component/post/aside-post/aside-post.component";
import { ListSocialComponent } from "./component/list-social/list-social.component";
import { PostDetailComponent } from "./pages/post-detail/post-detail.component";
import { ListTagComponent } from "./component/list-tag/list-tag.component";
import { PostCategoryComponent } from "./pages/post-category/post-category.component";
import { PostResultSearchComponent } from "./pages/post-result-search/post-result-search.component";
import { TestCapacityComponent } from "./pages/test-capacity/test-capacity.component";
import { JoinCapacityComponent } from "./pages/join-capacity/join-capacity.component";
import { CapacityPlayComponent } from "./pages/capacity-play/capacity-play.component";
import { FormatDatePostPipe } from "./helper/pipe/format-date-post.pipe";
import { ContestItemSubComponent } from "./component/contest-item-sub/contest-item-sub.component";
import { PostItemComponent } from "./component/post-item/post-item.component";
import { RecruitmentPositionComponent } from "./component/home/recruitment-position/recruitment-position.component";
import { OutstandingAdvantagesComponent } from "./component/home/outstanding-advantages/outstanding-advantages.component";
import { RankCapacityComponent } from "./pages/rank-capacity/rank-capacity.component";
import { PostLoadItemComponent } from "./loading/post-load-item/post-load-item.component";
import { AngularSplitModule } from "angular-split";
import { MonacoEditorModule } from "ngx-monaco-editor";
import { AlertErrorIntroExamComponent } from "./component/alert-error-intro-exam/alert-error-intro-exam.component";
import { CountDatePipe } from "./helper/pipe/count-date.pipe";
import { PaginationComponent } from "./component/pagination/pagination.component";
import { LoadingOverlayComponent } from "./component/loading-overlay/loading-overlay.component";
import { PopupLoginComponent } from "./component/popup-login/popup-login.component";
import { RankContestComponent } from "./pages/rank-contest/rank-contest.component";
import { ChallengeExamComponent } from "./pages/challenge-exam/challenge-exam.component";
import { ChallengeComponent } from "./pages/challenge/challenge.component";
import { ModalSubmitChallengeSuccessComponent } from "./modal/modal-submit-challenge-success/modal-submit-challenge-success.component";
import { ModalInfoCapacityComponent } from './modal/modal-info-capacity/modal-info-capacity.component';

import { QuestionAndAnswerComponent } from './pages/question-and-answer/question-and-answer.component';
import { QACategoryComponent } from "./component/qa-category/qa-category.component";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ContestComponent,
    HomeComponent,
    HomeLayoutComponent,
    ContestDeatailComponent,
    BannerComponent,
    BackTimeComponent,
    RoundComponent,
    BackTopComponent,
    LoadingItemComponent,
    TypeExamPipe,
    FormatDatePipe,
    ListAvatarUserComponent,
    ContestLoadItemComponent,
    ModalAddTeamComponent,
    InfoTeamComponent,
    ProfileUserComponent,
    ContestUserJoinComponent,
    ContestItemComponent,
    ModalListMemberComponent,
    RoundDetailComponent,
    IntoExamComponent,
    ListResultRoundComponent,
    RoundContestDetailComponent,
    LoadingPageComponent,
    HeaderComponent,
    FooterComponent,
    RecruitmentComponent,
    RecruitmentPostComponent,
    ModalInfoTeamComponent,
    CapacityExamComponent,
    DialogConfirmComponent,
    CapacityDetailComponent,
    CapacityItemComponent,
    ModalHistoryCapacityComponent,
    RecruitmentDetailComponent,
    ListPostComponent,
    PostsComponent,
    PostRelatedItemComponent,
    RankStudentComponent,
    AvatarComponent,
    AsidePostComponent,
    ListSocialComponent,
    PostDetailComponent,
    ListTagComponent,
    PostRelatedItemComponent,
    PostCategoryComponent,
    PostResultSearchComponent,
    PostRelatedItemComponent,
    ModalLoginComponent,
    ModalUploadCvComponent,
    ProfileLayoutComponent,
    MyCapacityTestComponent,
    ContestAsideComponent,
    TestCapacityComponent,
    JoinCapacityComponent,
    CapacityPlayComponent,
    FormatDatePostPipe,
    ContestItemSubComponent,
    PostItemComponent,
    RecruitmentPositionComponent,
    OutstandingAdvantagesComponent,
    RankCapacityComponent,
    PostLoadItemComponent,
    AlertErrorIntroExamComponent,
    CountDatePipe,
    PaginationComponent,
    LoadingOverlayComponent,
    PopupLoginComponent,
    RankContestComponent,
    ChallengeExamComponent,
    ChallengeComponent,
    ModalSubmitChallengeSuccessComponent,
    ModalInfoCapacityComponent,
    QuestionAndAnswerComponent,
    QACategoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    SocialLoginModule,
    HttpClientModule,
    CarouselModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
    SlickCarouselModule,
    NgxSkeletonLoaderModule,
    MaterialModule,
    NgToastModule,
    AngularSplitModule,
    MonacoEditorModule.forRoot(),
  ],
  providers: [
    {
      provide: "SocialAuthServiceConfig",
      useValue: {
        autoLogin: false,
        providers: [
          {
            id: GoogleLoginProvider.PROVIDER_ID,
            provider: new GoogleLoginProvider(environment.GG_CLIENT_ID),
          },
        ],
      } as SocialAuthServiceConfig,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: JwtInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
