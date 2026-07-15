import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map, switchMap } from "rxjs";
import { Contest } from "src/app/models/contest";
import { ContestService } from "src/app/services/contest.service";
import * as moment from "moment/moment";
import { ModalAddTeamComponent } from "src/app/modal/modal-add-team/modal-add-team.component";
import { MatDialog } from "@angular/material/dialog";
import { GetValueLocalService } from "src/app/services/get-value-local.service";
import { Enterprise } from "src/app/models/enterprise.model";
import { param } from "jquery";
import { Round } from "src/app/models/round.model";
import { RoundService } from "src/app/services/round.service";
import { NgToastService } from "ng-angular-popup";
import { FormControl } from "@angular/forms";
import { ResultRound } from "src/app/models/result-round.model";
import { UserService } from "src/app/services/user.service";
import * as $ from "jquery";
import { NgbModalConfig, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import { SliderService } from "src/app/services/slider.service";
import { Slider } from "src/app/models/slider.model";
import { Judges } from "src/app/models/judges.model";
import { ModalInfoTeamComponent } from "src/app/modal/modal-info-team/modal-info-team.component";
import { ListPostService } from "src/app/services/list-post.service";
import { TransmitToPost } from "src/app/models/transmit-to-post.models";
import { Post } from "src/app/models/post.model";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-round-contest-detail",
  templateUrl: "./round-contest-detail.component.html",
  styleUrls: ["./round-contest-detail.component.css"],
})
export class RoundContestDetailComponent implements OnInit {
  forwardComponent: Array<any> = [];
  statusPage: boolean = false;
  statusResultRoundBefore: boolean = false;
  resultRoundBefore: Array<ResultRound>;
  round_id: any;
  statusRound: number;
  statusRound_id: boolean = false;
  roundDetail: Round;
  statusRoundDetail: boolean = false;
  statusIntoExam: boolean = false;
  contestDetail: Contest;
  contestRelated: Array<any> = [];
  contestCompanySuppor: Enterprise;
  statusContestRelated: boolean = false;
  contentItem: Array<Contest> = [];
  closeResult: string;
  statusContest: boolean = false;
  routeStateRegister: boolean = false;
  statusBtnTakeExam: boolean = true;
  contest_id: any;
  nameBtnRegister: string = "Đăng ký";
  dataResultRound: Array<ResultRound>;
  sliderContest: Array<Slider>;
  cinfigData: TransmitToPost;
  listPostResult: Array<Post> = [];
  statusResultRound: boolean = false;
  total: number;
  roundEndTime: any;
  contestRelateTo: Array<Contest>;
  statusCheckDate: boolean = true;
  statusJudges: boolean = false;

  payLinkArrayResult: Array<any>;
  payLinkNextResult: string = "";
  payLinkPrevResult: string = "";

  // --------------------------
  statusUserHasJoinContest: boolean = false;
  teamIdMemberHasJoinTeam: number = 0;
  // ---------------------------
  statusLinks: boolean = false;
  resultRank: Array<ResultRound> = [];

  days: number;
  hours: number;
  minutes: number;
  seconds: number;

  sliderSupporter = {
    slidesToShow: 3,
    infinite: true,
    autoplay: true,
    arrows: true,
    prevArrow: ".supporters-arrow-left",
    nextArrow: ".supporters-arrow-right",
    slidesToScroll: 1,
    fadeSpeed: 1000,
  };

  constructor(
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private contestService: ContestService,
    private getUserLocal: GetValueLocalService,
    private router: Router,
    private roundService: RoundService,
    private toast: NgToastService,
    private userService: UserService,
    private modalService: NgbModal,
    public listPostService: ListPostService,
    private title: Title,
  ) {}

  ngOnInit(): void {
    this.title.setTitle("Chi tiết vòng thi");
    this.runTop();

    this.contest_id = this.route.snapshot.paramMap.get("contest_id");
    this.contestService.getWhereId(this.contest_id).subscribe((res) => {
      if (res.status) {
        this.contestDetail = res.payload;
        this.contestDetail ? (this.statusContest = true) : false;
        this.contestDetail.judges !== undefined ? (this.statusJudges = true) : false;
      }
    });

    this.routeStateRegister = history.state.registerNow;

    this.route.paramMap.subscribe((params) => {
      if (params.get("round_id")) {
        this.round_id = params.get("round_id");
        this.roundService.getRoundWhereId(this.round_id).subscribe((res) => {
          if (res.status) {
            this.roundDetail = res.payload;
            this.roundDetail ? (this.statusRoundDetail = true) : false;
            let startTime = new Date(this.roundDetail.start_time).getTime();
            let dateTime = new Date(this.roundDetail.end_time).getTime();
            let todayTime = new Date().getTime();
            if (todayTime > dateTime || todayTime < startTime) this.statusBtnTakeExam = false;
          }
        });
      }
      this.getResultRank(this.round_id);
    });

    this.getListPost();

    // Các cuộc thi liên quan
    this.contestService.getContestWhereMajor(this.contest_id).subscribe((res) => {
      if (res.status)
        this.contestRelated = res.payload.data.filter((item: Contest) => {
          return item.id != this.contest_id;
        });
      if (this.contestRelated) {
        this.statusContestRelated = true;
      }
    });
  }

  getResultRank(sort: string) {
    this.roundService.getResultRound(this.round_id, sort, 6).subscribe((res) => {
      if (res.status) {
        this.resultRank = res.payload.data;
        this.payLinkArrayResult = res.payload.links;
        this.payLinkNextResult = res.payload.next_page_url;
        this.payLinkPrevResult = res.payload.prev_page_url;
        this.total = res.payload.total;
        this.payLinkArrayResult.pop();
        this.payLinkArrayResult.shift();
        this.statusLinks = true;
      }
    });
  }

  getUrlPaying(url: string) {
    this.statusLinks = false;
    this.roundService.getResultRoundUrl(url).subscribe((res) => {
      if (res.status) {
        this.resultRank = res.payload.data;
        this.payLinkArrayResult = res.payload.links;
        this.payLinkNextResult = res.payload.next_page_url;
        this.payLinkPrevResult = res.payload.prev_page_url;
        this.payLinkArrayResult.pop();
        this.payLinkArrayResult.shift();
        this.statusLinks = true;
      }
    });
  }

  sortResult(status: boolean) {
    this.statusLinks = false;
    status ? this.getResultRank("desc") : this.getResultRank("asc");
  }

  scrollWin(elementString: any, distanceApart: number) {
    let element = document.querySelector(elementString);
    let numberScroll = element.offsetTop;
    window.scrollTo({ top: numberScroll - distanceApart, behavior: "smooth" });
  }

  //Cac bai post
  getListPost() {
    this.listPostService.getPostWhereCate("post-round").subscribe((res) => {
      if (res.status) {
        this.listPostResult = res.payload.data;
      }
    });
  }

  // Check trạng thái vòng thi
  checkStatusRound(start_time: Date, end_time: Date): any {
    let result;
    let startTime = new Date(start_time).getTime();
    let endTime = new Date(end_time).getTime();
    let todayTime = new Date().getTime();

    if (todayTime > endTime) {
      this.statusRound = 1;
      result = "Đã hết bạn";
    } else if (startTime < todayTime && todayTime < endTime) {
      this.statusRound = 2;
      result = "Đang mở";
    } else if (todayTime < endTime) {
      this.statusRound = 3;
      result = "Sắp mở";
    }

    return result;
  }

  // Mơ lắm
  openFormRegister(): void {
    if (this.statusCheckDate == true && this.getUserLocal.getValueLocalUser("user")) {
      this.openDialog();
    } else {
      this.router.navigate(["./login"]);
    }
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ModalAddTeamComponent, {
      width: "490px",
      data: {
        contest_id: this.contestDetail.id,
        team_id: "",
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }

  runTop() {
    $("html , body").animate(
      {
        scrollTop: 0,
      },
      1000,
    );
  }

  takeTheExam(round_id: number) {
    this.statusIntoExam = true;
    if (!this.userService.getUserValue()) {
      this.toast.warning({
        summary: "Bạn chưa đăng nhập !!!",
        duration: 3000,
        detail: "Cảnh báo",
      });
      this.router.navigate(["./login"]);
    }

    this.roundService.getInfoExamRound({ round_id: round_id }).subscribe((res) => {
      if (res.payload.error) {
        this.toast.warning({
          summary: res.payload.error,
          duration: 5000,
          detail: "Cảnh báo",
        });
        this.statusIntoExam = false;
      } else {
        this.router.navigate(["/vao-thi", this.roundDetail.contest_id, "vong", this.roundDetail.id]);
      }
    });
  }

  open(content: any) {
    this.modalService.open(content, { centered: true });
  }

  // Thông tin đội
  openInfoTeam() {
    this.dialog.open(ModalInfoTeamComponent, {
      width: "900px",
      data: {
        contest_id: this.contestDetail.id,
        team_id: this.teamIdMemberHasJoinTeam,
      },
    });
  }

  //
  generateRandomInteger(min: number, max: number) {
    // return Math.floor(min + Math.random() * (max - min + 1));

    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    const randomValue = array[0] / (Math.pow(2, 32) - 1);
    return Math.floor(min + randomValue * (max - min + 1));
  }
}
