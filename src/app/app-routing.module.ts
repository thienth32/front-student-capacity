import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { LoginComponent } from "./auth/login/login.component";
import { HomeComponent } from "./pages/home/home.component";
import { ContestComponent } from "./pages/contest/contest.component";
import { HomeLayoutComponent } from "./layouts/home-layout/home-layout.component";
import { ContestDeatailComponent } from "./pages/contest-detail/contest-deatail.component";
import { ProfileUserComponent } from "./component/profile-user/profile-user.component";
import { ContestUserJoinComponent } from "./component/contest-user-join/contest-user-join.component";
import { PostDetailComponent } from "./pages/post-detail/post-detail.component";
import { PostResultSearchComponent } from "./pages/post-result-search/post-result-search.component";
import { ProfileLayoutComponent } from "./layouts/profile-layout/profile-layout.component";
import { MyCapacityTestComponent } from "./pages/my-capacity-test/my-capacity-test.component";
import { AuthGuard } from "./guard/auth.guard";
import { IntoExamComponent } from "./pages/into-exam/into-exam.component";
import { RoundContestDetailComponent } from "./pages/round-contest-detail/round-contest-detail.component";
import { RecruitmentComponent } from "./pages/recruitment/recruitment.component";
import { RecruitmentPostComponent } from "./pages/recruitment-post/recruitment-post.component";
import { CapacityDetailComponent } from "./pages/capacity-detail/capacity-detail.component";
import { CapacityExamComponent } from "./pages/capacity-exam/capacity-exam.component";
import { PostsComponent } from "./pages/posts/posts.component";
import { RecruitmentDetailComponent } from "./pages/recruitment-detail/recruitment-detail.component";
import { TestCapacityComponent } from "./pages/test-capacity/test-capacity.component";
import { PostCategoryComponent } from "./pages/post-category/post-category.component";
import { JoinCapacityComponent } from "./pages/join-capacity/join-capacity.component";
import { CapacityPlayComponent } from "./pages/capacity-play/capacity-play.component";
import { RankCapacityComponent } from "./pages/rank-capacity/rank-capacity.component";
import { RankContestComponent } from "./pages/rank-contest/rank-contest.component";
import { ChallengeComponent } from "./pages/challenge/challenge.component";
import { ChallengeExamComponent } from "./pages/challenge-exam/challenge-exam.component";
import { QuestionAndAnswerComponent } from "./pages/question-and-answer/question-and-answer.component";

const routes: Routes = [
  {
    path: "",
    component: HomeLayoutComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
      },
      {
        path: "cuoc-thi",
        data: { title: "Cuộc thi" },
        component: ContestComponent,
      },
      {
        path: "tin-tuc",
        data: { title: "Bài viết" },
        component: PostsComponent,
      },
      {
        path: "hoi-dap",
        data: { title: "Hỏi đáp" },
        component: QuestionAndAnswerComponent
      },
      {
        path: "xep-hang-cuoc-thi",
        data: { title: "Bài viết" },
        component: RankContestComponent,
      },
      {
        path: "tin-tuc/:slug",
        component: PostDetailComponent,
      },
      {
        path: "danh-muc-bai-viet",
        component: PostCategoryComponent,
      },
      {
        path: "tim-kiem/bai-viet",
        component: PostResultSearchComponent,
      },
      {
        path: "vao-thi/:contest_id/vong/:round_id",
        component: IntoExamComponent,
      },
      {
        path: "tai-khoan",
        component: ProfileLayoutComponent,
        canActivate: [AuthGuard],
        children: [
          {
            path: "",
            component: ProfileUserComponent,
          },
          {
            path: "cuoc-thi-da-tham-gia",
            component: ContestUserJoinComponent,
          },
          {
            path: "bai-test-da-lam",
            component: MyCapacityTestComponent,
          },
        ],
      },
      {
        path: "cuoc-thi/chuyen-nganh/:slug",
        component: ContestComponent,
      },
      {
        path: "cuoc-thi/trang-thai/:status",
        component: ContestComponent,
      },
      {
        path: "cuoc-thi/:contest_id",
        component: ContestDeatailComponent,
      },
      {
        path: "cuoc-thi/:contest_id/vong/:round_id",
        component: RoundContestDetailComponent,
      },
      {
        path: "tin-tuc-tuyen-dung",
        component: RecruitmentPostComponent,
      },
      {
        path: "dot-tuyen-dung-doanh-nghiep",
        component: RecruitmentComponent,
      },
      {
        path: "danh-gia-nang-luc/list",
        component: TestCapacityComponent,
      },
      {
        path: "tuyen-dung/chi-tiet/:id",
        component: RecruitmentDetailComponent,
      },
      {
        path: "cuoc-thi/:contest_id/vong/:round_id",
        component: RoundContestDetailComponent,
      },
      {
        path: "danh-gia-nang-luc/:capacity_id",
        component: CapacityDetailComponent,
      },
      {
        path: "danh-gia-nang-luc/vao-thi/:capacity_id/bai-thi/:round_id",
        component: CapacityExamComponent,
      },
      {
        path: "capacity-join",
        component: JoinCapacityComponent,
      },
      {
        path: "capacity-play/:code",
        component: CapacityPlayComponent,
      },
      {
        path: "danh-gia-nang-luc",
        component: RankCapacityComponent,
      },
      {
        path: "challenge",
        component: ChallengeComponent,
      },
      {
        path: "challenge/:id",
        component: ChallengeExamComponent,
      },
    ],
  },
  {
    path: "login",
    component: LoginComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
