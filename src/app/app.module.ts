import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoogleLoginProvider, SocialAuthServiceConfig, SocialLoginModule } from 'angularx-social-login';
import { environment } from 'src/environments/environment';
import { LoginComponent } from './auth/login/login.component';
import { HomeComponent } from './pages/home/home.component';
import { JwtInterceptor } from './_helpers/jwt.interceptor';
import { ErrorInterceptor } from './_helpers/error.interceptor';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { ContestComponent } from './pages/contest/contest.component';
import { HomeLayoutComponent } from './layouts/home-layout/home-layout.component';
import { ContestDeatailComponent } from './pages/contest-detail/contest-deatail.component';
import { BannerComponent } from './component/banner/banner.component';
import { BackTimeComponent } from './component/back-time/back-time.component';

import { RoundComponent } from './component/round/round.component';
import { BackTopComponent } from './component/back-top/back-top.component';

import { MatExpansionModule } from '@angular/material/expansion';


import { LoadingItemComponent } from './component/loading-item/loading-item.component';
import { TypeExamPipe } from './helper/pipe/type-exam.pipe';
import { FormatDatePipe } from './helper/pipe/format-date.pipe';
import { ListAvatarUserComponent } from './component/list-avatar-user/list-avatar-user.component';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ContestLoadItemComponent } from './loading/contest-load-item/contest-load-item.component';
import { MaterialModule } from './material/material.module';
import { ModalAddTeamComponent } from './component/modal-add-team/modal-add-team.component';
import { NgToastModule } from 'ng-angular-popup';
import { ModalDirectionTeamComponent } from './component/modal-direction-team/modal-direction-team.component';
import { InfoTeamComponent } from './pages/info-team/info-team.component';
import { ProfileUserComponent } from './component/profile-user/profile-user.component';
import { ContestUserJoinComponent } from './component/contest-user-join/contest-user-join.component';

import { TeamUserJoinDetailComponent } from './component/team-user-join-detail/team-user-join-detail.component';


import { ContestItemComponent } from './component/contest-item/contest-item.component';
import { ModalListMemberComponent } from './component/modal-list-member/modal-list-member.component';
import { RoundDetailComponent } from './component/round-detail/round-detail.component';
import { IntoExamComponent } from './pages/into-exam/into-exam.component';
import { ListResultRoundComponent } from './component/list-result-round/list-result-round.component';
import { RoundContestDetailComponent } from './pages/round-contest-detail/round-contest-detail.component';
import { LoadingPageComponent } from './loading/loading-page/loading-page.component';

import { NZ_I18N } from 'ng-zorro-antd/i18n';
import { en_US } from 'ng-zorro-antd/i18n';
import { registerLocaleData } from '@angular/common';
import en from '@angular/common/locales/en';
import { HeaderComponent } from './layouts/header/header.component';
import { FooterComponent } from './layouts/footer/footer.component';
import { RecruitmentComponent } from './pages/recruitment/recruitment.component';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { RecruitmentComponent as RecruitmentComponentModal } from './modal/recruitment/recruitment.component';
import { ModalInfoTeamComponent } from './modal/modal-info-team/modal-info-team.component';
import { RecruitmentListCompanyComponent } from './modal/recruitment-list-company/recruitment-list-company.component';
// import { AndesginModule } from './anDesgin/andesgin/andesgin.module';

registerLocaleData(en);


import { CapacityExamComponent } from './pages/capacity-exam/capacity-exam.component';
import { DialogConfirmComponent } from './modal/dialog-confirm/dialog-confirm.component';
import { TestCapacityComponent } from './pages/test-capacity/test-capacity.component';
import { Page404Component } from './pages/page404/page404.component';


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent,
    ContestComponent,
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
    ModalDirectionTeamComponent,
    InfoTeamComponent,
    ProfileUserComponent,
    ContestUserJoinComponent,
    TeamUserJoinDetailComponent,
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
    RecruitmentComponentModal,
    ModalInfoTeamComponent,
    RecruitmentListCompanyComponent,
    CapacityExamComponent,
    DialogConfirmComponent,
    TestCapacityComponent,
    Page404Component,
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
    NzSelectModule,
    NzSpinModule,
  ],
  providers: [
    {
      provide: 'SocialAuthServiceConfig',
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
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorInterceptor,
      multi: true
    },
    { provide: NZ_I18N, useValue: en_US }
  ],
  bootstrap: [AppComponent]
})

export class AppModule {
}
