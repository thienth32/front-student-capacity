import { UserService } from "src/app/services/user.service";
import { User } from "src/app/models/user";
import { NgToastService } from "ng-angular-popup";
import { ActivatedRoute, Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { CapacityService } from "src/app/services/capacity.service";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-capacity-play",
  templateUrl: "./capacity-play.component.html",
  styleUrls: ["./capacity-play.component.css"],
})
export class CapacityPlayComponent implements OnInit {
  users: User[] = [];
  flagStart: boolean = false;
  flagEnd: boolean = false;
  question: any = {};
  answers: any = [];
  usersRanks: any = [];
  userRank: any = [];
  rank: number = 0;
  audio: any;
  userLogged: User;
  exam: any;
  loadingSubmit: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private capacityService: CapacityService,
    private toastService: NgToastService,
    private userService: UserService,
    private titleSerive: Title,
  ) {}

  ngOnInit(): void {
    this.titleSerive.setTitle("Trò chơi");

    const user = this.userService.getUserValue();
    const token = this.userService.getJwtToken();
    const isLogged = user && token;
    if (!isLogged) {
      this.toastService.info({ summary: "Vui lòng đăng nhập trước khi tham gia!", detail: "Thông báo" });
      this.router.navigate(["/login"]);
      return;
    }

    this.userLogged = user;

    this.route.params.subscribe((params) => {
      const { code } = params;
      const that = this;
      this.capacityService.connectRoom(code).subscribe(
        (res: any) => {
          this.titleSerive.setTitle(`Trò chơi: ${res.payload.exam.name}`);

          that.userRank = res.payload.rank;
          that.usersRanks = res.payload.ranks;
          that.renderRankUser();

          if (res.payload.exam.status == 2 || res.payload.status == "Done") {
            that.flagEnd = true;
            return;
          }

          that.exam = res.payload.exam;

          //  code online
          if (that.exam.type == 0) {
            that.channel(code, that);
            if (!that.exam.room_token) return;

            if (res.payload.status == false) return;
            that.answers = [];
            that.question = res.payload.question;
            that.flagStart = true;
          } else {
            that.channel(code, that, true);
            if (!that.exam.room_token) return;
            that.answers = [];
            that.question = res.payload.question;
            that.flagStart = true;
          }
        },
        (err) => {
          this.toastService.warning({
            summary: "Không thể tiếp tục tham gia trò chơi!",
            detail: "Đã có lỗi xảy ra",
          });
          that.router.navigate(["/capacity-join"]);
        },
      );
    });
  }

  ngOnDestroy(): void {
    this.route.params.subscribe((params) => {
      const { code } = params;
      (window as any).Echo.leave("room." + code);
    });
  }

  renderRankUser() {
    if (this.userRank) {
      var that = this;
      this.usersRanks.filter(function (data: any, key: any) {
        if (data.id == that.userRank.id) that.rank = key + 1;
      });
    }
  }

  submitQuestion() {
    var that = this;
    that.loadingSubmit = true;
    this.route.params.subscribe((params) => {
      const { code } = params;
      this.capacityService
        .nextSubmitCode(code, {
          question_id: that.question.id,
          answers: that.answers,
        })
        .subscribe(
          (res: any) => {
            that.answers = [];
            that.loadingSubmit = false;
            that.usersRanks = res.payload.ranks;
            that.question = res.payload.question;
            that.userRank = res.payload.rank;
            if (res.payload.status == "Done") {
              that.flagEnd = true;
              return;
            }
            that.flagStart = true;
            that.renderRankUser();
          },
          (err: any) => {
            that.loadingSubmit = false;
            that.toastService.warning({
              summary: "Không thể tiếp tục tham gia trò chơi!",
              detail: "Đã có lỗi xảy ra",
            });
            that.router.navigate(["/capacity-join"]);
          },
        );
    });
  }

  channel(code: any, that: any, type: any = false) {
    const echoChannel = (window as any).Echo.join("room." + code)
      .here((users: any) => {
        this.users = users;
      })
      .joining((user: any) => {
        this.users.push(user);
      })
      .leaving((user: any) => {
        var us = this.users.filter(function (data: any) {
          return data.id !== user.id;
        });
        this.users = us;
      })
      .listen("UpdateGameEvent", function (data: any) {
        that.usersRanks = data.ranks;
        that.renderRankUser();
      })
      .listen("PlayGameEvent", function (data: any) {
        that.flagStart = true;
        that.usersRanks = data.ranks;
        that.renderRankUser();
        that.question = data.question;
      })
      .listen("EndGameEvent", function (data: any) {
        if (that.exam.type == 1) {
          that.flagEnd = true;
          return;
        }
        that.capacityService
          .submitCode(code, {
            question_id: that.question.id,
            answers: that.answers,
            flagEvent: true,
          })
          .subscribe(
            (res: any) => {
              that.usersRanks = res.payload.ranks;
              that.userRank = res.payload.rank;
              that.flagEnd = true;
              that.renderRankUser();
            },
            (err: any) => {
              that.toastService.warning({
                summary: "Không thể tiếp tục tham gia trò chơi!",
                detail: "Đã có lỗi xảy ra",
              });
              that.router.navigate(["/capacity-join"]);
            },
          );
      })
      .listen("BeforNextGame", function (data: any) {});
    if (type == false) {
      echoChannel.listen("NextGameEvent", function (data: any) {
        that.capacityService
          .submitCode(code, {
            question_id: that.question.id,
            answers: that.answers,
          })
          .subscribe(
            (res: any) => {
              that.usersRanks = res.payload.ranks;
              that.renderRankUser();
            },
            (err: any) => {
              that.toastService.warning({
                summary: "Không thể tiếp tục tham gia trò chơi!",
                detail: "Đã có lỗi xảy ra",
              });
              that.router.navigate(["/capacity-join"]);
            },
          );
        that.answers = [];
        that.question = data.question;
        that.flagStart = true;
      });
    } else {
    }
  }

  clickAnswer(id: any) {
    var key = 0;
    var keyAnswer = null;
    this.question.answers.filter(function (data: any, k: any) {
      if (data.id == id) key = k;
      return data.id == id;
    });
    var check = this.answers.filter(function (data: any, k: any) {
      if (data == id) keyAnswer = k;
      return data == id;
    });
    if (this.question.type == 1) {
      if (check.length > 0) {
        this.question.answers[key].status = false;
        this.answers.splice(keyAnswer, 1);
      } else {
        this.answers.push(id);
        this.question.answers[key].status = true;
      }
    } else {
      this.answers = [id];
      this.question.answers = this.question.answers.map(function (data: any) {
        return {
          content: data.content,
          id: data.id,
          question_id: data.question_id,
          status: false,
        };
      });
      this.question.answers[key].status = true;
    }
  }

  renderContent(content: string, type: number) {
    return ` ${content} ( ${type == 1 ? "Nhiều đáp án" : "Một đáp án "} ) `;
  }
}
