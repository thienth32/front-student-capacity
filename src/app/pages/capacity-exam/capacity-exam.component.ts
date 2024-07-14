import { LocalStorageService } from "./../../services/local-storage.service";
import {
  Component,
  ElementRef,
  Inject,
  OnInit,
  QueryList,
  ViewChildren,
  OnDestroy,
  SimpleChanges,
} from "@angular/core";
import { FormGroup, FormControl, Validators, FormArray } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { DOCUMENT } from "@angular/common";
import { MatDialog } from "@angular/material/dialog";
import { map, switchMap } from "rxjs";
import * as moment from "moment";
import { NgToastService } from "ng-angular-popup";
import { CapacityService } from "./../../services/capacity.service";
import { RoundService } from "src/app/services/round.service";
import { UserService } from "src/app/services/user.service";
import { DialogConfirmComponent } from "./../../modal/dialog-confirm/dialog-confirm.component";
import { ModalHistoryCapacityComponent } from "src/app/modal/modal-history-capacity/modal-history-capacity.component";
import { CapacityRound } from "src/app/models/round.model";
import { ExamCapacity, ResultExam, TestResultStorage } from "src/app/models/exam.model";
import { CapacityExamHistory } from "src/app/models/capacity";
import { User } from "src/app/models/user";
import { Title } from "@angular/platform-browser";
import { ModalUploadCvComponent } from "../../modal/modal-upload-cv/modal-upload-cv.component";
import { ModalInfoCapacityComponent } from "../../modal/modal-info-capacity/modal-info-capacity.component";

@Component({
  selector: "app-capacity-exam",
  templateUrl: "./capacity-exam.component.html",
  styleUrls: ["./capacity-exam.component.css"],
})
export class CapacityExamComponent implements OnInit, OnDestroy {
  @ViewChildren("questions") questions: QueryList<ElementRef>;
  userLogged!: User;
  formAnswers!: FormGroup;
  examData!: ExamCapacity;
  // trạng thái làm bài: 0 -> màn hình chờ làm bài, 1 -> đang làm bài, 2 -> đã nộp
  statusTakingExam: number = 0;
  roundDetail!: CapacityRound;
  isFetchingRound = false;
  isFetchingSttExam = false;
  isFetchingExam = false;
  isFullScreen = false;
  // đang làm bài ? button tiếp tục : button bắt đầu
  isContinueExam = false;
  countDownTimeExam: { minutes: number | string; seconds: number | string } = {
    minutes: "00",
    seconds: "00",
  };
  examStatus: number | null = null;
  prevExamStatus: number | null = null;
  // thông báo sắp hết giờ
  isNotiExamTimeOut = false;
  // trạng thái đang call api nộp bài
  isSubmitingExam = false;
  // trạng thái hết giờ làm bài
  isTimeOut = false;
  // trạng thái get ls bài làm
  isFetchingHistoryExam = false;
  isLoggin!: boolean;
  timerId!: any;
  element!: any;

  // kết quả bài đánh giá
  resultExam!: ResultExam;

  // lịch sử làm bài
  examHistory!: CapacityExamHistory;

  // kích thước màn hình
  windowScreenSize!: { width: number; height: number };

  // trạng thái vòng (bài) thi trước
  statusPreRound!: {
    status: boolean; // false: chưa làm
    payload?: number; // 0: đang làm, 1: đã làm
    message: string;
  };

  testResultStorageKey = "test_result";

  constructor(
    private roundService: RoundService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private userService: UserService,
    private toast: NgToastService,
    private router: Router,
    private capacityService: CapacityService,
    private titleService: Title,
    private localstorageService: LocalStorageService,
    @Inject(DOCUMENT) private document: any,
  ) {
  }

  ngOnInit(): void {
    // chặn f12, f11
    window.onkeydown = (e: any) => {
      this.handleDisableKeydown(e);
      this.handleDisableF11Key(e);
    };

    // chặn chuột phải
    window.oncontextmenu = (e: any) => this.disabledEvent(e);

    this.element = this.document.documentElement;

    this.isFetchingRound = true;
    this.route.params.subscribe((params) => {
      // initial title
      this.titleService.setTitle("Đánh giá năng lực");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      const { round_id } = params;
      this.roundService.getRoundWhereId(round_id).subscribe((responseRound) => {
        if (responseRound.status) {
          // update title
          this.titleService.setTitle(`Phần thi: ${responseRound.payload.name} - ${responseRound.payload.contest.name}`);

          this.isFetchingRound = false;
          this.isFetchingSttExam = true;
          this.roundDetail = responseRound.payload;

          // check login
          const user = this.userService.getUserValue();
          const jwtToken = this.userService.getJwtToken();
          this.isLoggin = !!(Object.keys(user).length !== 0 && jwtToken);
          // nếu đã login ? check trạng thái làm bài : hiển thị màn hình chờ làm bài
          if (this.isLoggin) {
            this.userLogged = this.userService.getUserValue();
            this.checkCapacity();
          } else {
            this.isFetchingSttExam = false;
          }
        }
      });
    });
  }

  ngDoCheck() {
    if (this.examStatus !== this.prevExamStatus) {
      if (this.examStatus == 0 || this.examStatus == 1) {
        // Code khi examStatus thay đổi thành true
        this.handleTakeExam();
      } else if (this.examStatus == 2) {
        // Code khi examStatus thay đổi thành false
        this.dialog.open(DialogConfirmComponent, {
          width: "450px",
          data: {
            title: "Thông báo",
            description: "Bạn đã làm bài thi này rồi",
            isNotShowBtnCancel: true,
            textOk: "Đồng ý",
          },
        });
      }
      this.prevExamStatus = this.examStatus;
    }
  }

  checkCapacity(): any {
    const isOverrideExamStatus = this.isLoggin && Object.keys(this.userService.getUserValue()).length == 0;
    this.roundService
      .getInfoCapacityExamRound({
        round_id: this.roundDetail.id,
      })
      .subscribe(
        ({ status, payload, result }) => {
          // nếu đang làm ? tiếp tục làm bài
          this.isFetchingSttExam = false;
          if (!status) return;
          if (payload === 0) {
            this.isContinueExam = true;
            if (isOverrideExamStatus) this.examStatus = 1;
          } else if (payload === 1) {
            // đã nộp bài
            if (isOverrideExamStatus) this.statusTakingExam = 2;
            if (this.isLoggin) this.examStatus = 2;
            const { minutes, seconds } = this.getMinutesAndSecondBetweenTwoDate(
              result.created_at,
              result.updated_at,
            );

            // tổng số giây làm bài
            const secondsExam = (+new Date(result.updated_at) - +new Date(result.created_at)) / 1000;

            // trạng thái nộp bài muộn
            const isLateSubmission =
              secondsExam >
              this.convertTimeExamToSeconds(this.roundDetail.time_exam, this.roundDetail.time_type_exam);

            this.resultExam = {
              capacityId: result.id,
              score: Number.isInteger(result.scores) ? result.scores.toString() : result.scores.toFixed(1),
              examTime: !+minutes ? `${seconds} giây` : `${minutes} phút ${seconds} giây`,
              submitAt:
                +moment(result.updated_at).format("YYYY") !== +new Date().getFullYear()
                  ? moment(result.updated_at).format("DD [tháng] MM, YYYY [lúc] HH:mm")
                  : moment(result.updated_at).format("DD [tháng] MM [lúc] HH:mm"),
              donotAnswer: result.donot_answer,
              falseAnswer: result.false_answer,
              trueAnswer: result.true_answer,
              isLateSubmission,
              maxPointExam: result.exam[0].max_ponit,
            };

            // clear data lịch sử làm bài của vòng trước
            this.examHistory = null as any;
          }
        },
        (error) => {
          //chưa làm bài
          if (isOverrideExamStatus) this.examStatus = 0;
          // check trạng thái pass vòng thi trước
          const preRoundExits = this.getPreRound();
          if (preRoundExits.status) {
            const preRoundId = preRoundExits.round_id;

            this.roundService.getInfoCapacityExamRound({ round_id: preRoundId }).subscribe(
              (res) => {
                this.statusPreRound = {
                  status: true,
                  payload: res.payload,
                  message: res.message,
                };
              },
              () => {
                this.statusPreRound = {
                  status: false,
                  message: "Chưa làm",
                };
                this.isFetchingSttExam = false;
              },
              () => {
                this.isFetchingSttExam = false;
              },
            );
            return;
          }
          this.isFetchingSttExam = false;

          return false;
        },
      );
  }

  ngOnDestroy(): void {
    this.handleRemoveAllEvent();
  }

  // làm bài
  handleTakeExam() {

    if (!this.isLoggin && this.roundDetail.access_from_outside == 1) {
      this.openUserInfoModal();
      return;
    }

    const confimExamRef = this.dialog.open(DialogConfirmComponent, {
      width: "450px",
      data: {
        title: "Lưu ý",
        description:
          "Bài làm sẽ được nộp tự động sau khi hết thời gian, không thoát toàn màn hình trong quá trình làm bài!",
        textCancel: "Thoát",
        textOk: "Đồng ý",
      },
    });

    confimExamRef.afterClosed().subscribe((res) => {
      if (res === "true") {

        // check user logged
        if (!this.isLoggin) {
          this.localstorageService.setIsPopup(1);
          return;
        }

        // check thời gian thi
        const todayTime = new Date().getTime();
        const timeStart = new Date(this.roundDetail.start_time).getTime();
        const timeEnd = new Date(this.roundDetail.end_time).getTime();

        if (todayTime < timeStart) {
          this.toast.warning({ summary: "Chưa đến thời gian làm bài!", detail: "Thông báo" });
          return;
        }
        if (todayTime >= timeEnd) {
          this.toast.warning({ summary: "Phần thi đã kết thúc!", detail: "Thông báo" });
          return;
        }

        // check trạng thái pass vòng thi trước
        const preRoundExits = this.getPreRound();
        if (preRoundExits.status) {
          const { status, payload } = this.statusPreRound;
          if (status) {
            if (payload === 0) {
              this.toast.info({ summary: "Vui lòng hoàn thành phần thi trước đó!", detail: "Thông báo" });
              return;
            }

            this.openFullscreen();
            this.takeExam();
          } else {
            this.toast.info({ summary: "Bạn chưa làm phần thi trước đó!", detail: "Thông báo" });
          }

          return;
        }

        this.openFullscreen();
        this.takeExam();
      }
    });
  }

  handleContinueTakeExam() {
    const confimExamRef = this.dialog.open(DialogConfirmComponent, {
      width: "450px",
      data: {
        title: "Lưu ý",
        description:
          "Bài làm sẽ được nộp tự động sau khi hết thời gian, không thoát toàn màn hình trong quá trình làm bài!",
        textCancel: "Thoát",
        textOk: "Đồng ý",
      },
    });

    confimExamRef.afterClosed().subscribe((res) => {
      if (res === "true") {
        this.openFullscreen();
        this.takeExam();
      }
    });
  }

  takeExam() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    this.isFetchingExam = true;

    setTimeout(() => {
      // kích thước khi full màn hình
      this.windowScreenSize = {
        width: window.innerWidth,
        height: window.innerHeight,
      };

      // bắt sự kiện thay đổi kích thước màn hình (f11)
      window.onresize = (e: any) => {
        if (this.isTimeOut || this.isSubmitingExam) return;

        const currentWindowWidth = e.target.innerWidth;
        const currentWindowHeight = e.target.innerHeight;

        const { width, height } = this.windowScreenSize;

        if (currentWindowWidth !== width || currentWindowHeight !== height) {
          this.dialog.closeAll();

          const dialogFullscreen = this.dialog.open(DialogConfirmComponent, {
            width: "300px",
            disableClose: true,
            data: {
              isNotShowBtnCancel: true,
              title: "Cảnh báo",
              description: "Vui lòng bật full màn hình khi làm bài!",
            },
          });

          dialogFullscreen.afterClosed().subscribe((result) => {
            result === "true" && this.openFullscreen();
          });
        } else {
          this.dialog.closeAll();
        }
      };

      // chặn f12, chặn copy
      window.onkeydown = (e: any) => {
        this.handleDisableKeydown(e);
        this.handleDisableCopy(e);
      };

      this.roundService.takeExam({ round_id: this.roundDetail.id }).subscribe(
        (res) => {
          if (res.status) {
            this.examData = {
              ...res.payload,
              exam_at: res.exam_at,
              time_exam:
                this.convertTimeExamToSeconds(this.roundDetail.time_exam, this.roundDetail.time_type_exam) / 60,
            };

            this.isFetchingExam = false;
            // cập nhật trạng thái đang làm bài
            this.statusTakingExam = 1;

            this.createFormControl();

            const durationExam = this.convertTimeExamToSeconds(
              this.roundDetail.time_exam,
              this.roundDetail.time_type_exam,
            );
            this.handleStartExam(durationExam, this.examData.exam_at);
          }
        },
        () => {
          this.toast.warning({ detail: "Lỗi", summary: "Đã có lỗi xảy ra, vui lòng thử lại" });
        },
      );
    }, 100);
  }

  // nộp bài
  handleSubmitExam() {
    // check làm thiếu câu hỏi
    if (this.formAnswers.valid) {
      const confirmSubmitExam = this.dialog.open(DialogConfirmComponent, {
        disableClose: true,
        width: "350px",
        data: {
          title: "Xác nhận nộp bài",
          description: "Bạn có chắc chắn muốn nộp bài?",
          textCancel: "Thoát",
          textOk: "Đồng ý",
        },
      });

      confirmSubmitExam.afterClosed().subscribe((result) => {
        // xác nhận nộp bài
        if (result === "true") {
          this.openDialogSubmitExam();
          this.submitExam();
        }
      });
    } else {
      const listQuesNum = this.getFormValidationErrors();

      const confirmSubmitExam = this.dialog.open(DialogConfirmComponent, {
        disableClose: true,
        width: "350px",
        data: {
          title: "Xác nhận nộp bài",
          description: `Bạn chưa hoàn thành các câu: ${listQuesNum.join(", ")}`,
          textCancel: "Tiếp tục",
          textOk: "Nộp bài",
        },
      });

      confirmSubmitExam.afterClosed().subscribe((result) => {
        // xác nhận nộp bài
        if (result === "true") {
          this.openDialogSubmitExam();
          this.submitExam();
        }
      });
    }
  }

  // nộp bài
  submitExam() {
    const answersData = this.getAnswersData();

    this.roundService
      .capacitySubmitExam({
        exam_id: this.examData.id,
        data: answersData,
      })
      .subscribe(({ status, payload, exam }) => {
        if (status) {
          // kết quả bài làm
          const { minutes, seconds } = this.getMinutesAndSecondBetweenTwoDate(payload.created_at, payload.updated_at);

          // tổng số giây làm bài
          const secondsExam = (+new Date(payload.updated_at) - +new Date(payload.created_at)) / 1000;

          // trạng thái nộp bài muộn
          const isLateSubmission =
            secondsExam > this.convertTimeExamToSeconds(this.roundDetail.time_exam, this.roundDetail.time_type_exam);

          this.resultExam = {
            capacityId: payload.id,
            score: Number.isInteger(payload.scores) ? payload.scores.toString() : payload.scores.toFixed(1),
            examTime: !+minutes ? `${seconds} giây` : `${minutes} phút ${seconds} giây`,
            submitAt: moment(payload.updated_at).format("DD [tháng] MM [lúc] HH:mm"),
            donotAnswer: payload.donot_answer,
            falseAnswer: payload.false_answer,
            trueAnswer: payload.true_answer,
            isLateSubmission,
            maxPointExam: exam.max_ponit,
          };

          this.dialog.closeAll();
          // reset variable
          this.statusTakingExam = 2;
          clearInterval(this.timerId);
          this.isFetchingRound = false;
          this.isFetchingSttExam = false;
          this.isFetchingExam = false;
          this.isFullScreen = false;
          this.isContinueExam = false;
          this.isNotiExamTimeOut = false;
          this.isSubmitingExam = false;
          this.isTimeOut = false;
          this.isLoggin = false;

          // remove event listener
          window.onresize = () => {
          };

          // mặc định chặn f12, f11
          window.onkeydown = (e: any) => {
            this.handleDisableKeydown(e);
            this.handleDisableF11Key(e);
          };

          // remove storage test result
          const testResultLocal: TestResultStorage[] = JSON.parse(
            localStorage.getItem(this.testResultStorageKey) as string,
          );
          localStorage.setItem(
            this.testResultStorageKey,
            JSON.stringify(testResultLocal.filter((item) => item.round_id !== this.roundDetail.id)),
          );

          // thoát toàn màn hình
          this.closeFullscreen();
        }
      });
  }

  getAnswersData() {
    const answerFormData = this.formAnswers.value;

    // danh sách id câu hỏi và câu trả lời
    const answersData: {
      questionId: number;
      answerId?: number;
      answerIds?: [];
      answer?: string;
      type: number; // 0: câu hỏi 1 đáp án, 1: câu hỏi nhiều đáp án, 2: code onl
    }[] = [];
    for (const key in answerFormData) {
      const questionId = key.split("-")[2];
      const questionType = +key.split("-")[3];

      if (questionType === 0) {
        answersData.push({
          questionId: +questionId,
          answerId: answerFormData[key],
          type: questionType,
        });
      } else if (questionType === 1) {
        answersData.push({
          questionId: +questionId,
          answerIds: answerFormData[key],
          type: questionType,
        });
      } else if (questionType === 2) {
        answersData.push({
          questionId: +questionId,
          answer: answerFormData[key],
          type: questionType,
        });
      }
    }

    return answersData;
  }

  createFormControl() {
    const ctrls: { [name: string]: FormControl | FormArray } = {};
    this.examData.questions.forEach((question, index: number) => {
      const fieldName = `question-${++index}-${question.id}-${question.type}`; // question-stt câu hỏi-id câu hỏi-loại câu hỏi

      // câu hỏi 1 đáp án
      if (question.type === 0) {
        ctrls[fieldName] = new FormControl("", Validators.required);
      } else if (question.type === 1) {
        ctrls[fieldName] = new FormArray([], Validators.required);
      }
    });

    this.formAnswers = new FormGroup(ctrls);

    // check câu trả lời trong localStorage
    const testResultLocal: TestResultStorage[] = JSON.parse(localStorage.getItem(this.testResultStorageKey) as string);
    const resultRoundExits = testResultLocal && testResultLocal.find((item) => item.round_id === this.roundDetail.id);
    if (testResultLocal && resultRoundExits && resultRoundExits.data) {
      for (const item in resultRoundExits.data) {
        const questionType = +item.split("-")[3];

        // câu hỏi 1 đáp án
        if (questionType === 0) {
          this.formAnswers.patchValue({
            [item]: resultRoundExits.data[item],
          });
        } else if (questionType === 1) {
          // câu hỏi nhiều đáp án
          const formArray: FormArray = this.formAnswers.get(item) as FormArray;

          resultRoundExits.data[item].forEach((answerId: string) => {
            formArray.push(new FormControl(answerId));
          });
        }
      }
    }
  }

  // lấy danh sách câu hỏi chưa trả lời
  getFormValidationErrors() {
    const listQuestionNum: number[] = [];
    Object.keys(this.formAnswers.controls).forEach((key) => {
      const controlErrors: any = this.formAnswers.get(key)?.errors;

      if (controlErrors != null) {
        const questionNum = key.split("-")[1];
        listQuestionNum.push(+questionNum);
      }
    });

    return listQuestionNum;
  }

  // lưu các câu hỏi đã trả lời
  handleAutoSaveAnswer(formControlName: string) {
    if (this.isTimeOut) return;
    const tempValue = { ...this.formAnswers.value };
    const testResultLocal = JSON.parse(localStorage.getItem(this.testResultStorageKey) as string);

    this.formAnswers.get(formControlName)?.valueChanges.subscribe((value) => {
      tempValue[formControlName] = value;

      if (testResultLocal && Array.isArray(testResultLocal)) {
        let testResultByRoundIdExits = testResultLocal.find((item) => item.round_id === this.roundDetail.id);
        if (testResultByRoundIdExits) {
          testResultByRoundIdExits.data = tempValue;
        } else {
          testResultLocal.push({
            round_id: this.roundDetail.id,
            data: tempValue,
          });
        }

        localStorage.setItem(this.testResultStorageKey, JSON.stringify(testResultLocal));
      } else {
        localStorage.setItem(
          this.testResultStorageKey,
          JSON.stringify([
            {
              round_id: this.roundDetail.id,
              data: tempValue,
            },
          ]),
        );
      }
    });
  }

  // check câu hỏi đã làm
  checkQuesAnswered(controlName: string) {
    let isAnswerd = false;
    const formValues = this.formAnswers.value;

    for (const item in formValues) {
      if (item === controlName) {
        if (Array.isArray(formValues[item]) && formValues[item].length >= 1) {
          isAnswerd = true;
        }

        if (!Array.isArray(formValues[item]) && formValues[item]) {
          isAnswerd = true;
        }
      }
    }

    return isAnswerd;
  }

  // scroll khi click câu hỏi
  scrollToQuestion(indexQuestion: number) {
    this.questions.forEach((questionRef, index) => {
      if (indexQuestion === index) {
        questionRef.nativeElement.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // bắt đầu làm bài
  handleStartExam(duration: number, timeStart: any) {
    // tính thời gian làm bài ban đầu
    const { minutes: minutesExam, seconds: secondsExam } = this.convertMsToMinutesAndSecond(duration * 1000);
    this.countDownTimeExam.minutes = minutesExam;
    this.countDownTimeExam.seconds = secondsExam;

    let timeStartExam: any = new Date(timeStart).getTime();
    const timeWillEndExam = new Date(timeStartExam + duration * 1000 + 2000);

    this.timerId = setInterval(() => {
      let futureDate = new Date(timeWillEndExam).getTime();
      let today = new Date().getTime();
      let timeEndRound = new Date(this.roundDetail.end_time).getTime();

      let distance = futureDate - today;

      // hết giờ hoặc vòng thi đóng
      if (distance < 0 || today > timeEndRound) {
        this.countDownTimeExam.minutes = "00";
        this.countDownTimeExam.seconds = "00";
        clearInterval(this.timerId);
        this.isTimeOut = true;

        // nếu đang không nộp bài => tự động nộp bài
        if (!this.isSubmitingExam) {
          // thông báo nộp bài khi hết thời gian
          this.dialog.closeAll();

          const submitExamRef = this.dialog.open(DialogConfirmComponent, {
            disableClose: true,
            width: "450px",
            data: {
              title: "Hết giờ làm bài",
              description:
                "Thời gian làm bài của bạn đã hết!. Chúng tôi sẽ nộp kết quả đã lưu vào trước đó của bạn. Ấn nút để nộp bài!",
              isNotShowBtnCancel: true,
              textOk: "Nộp bài",
            },
          });

          submitExamRef.afterClosed().subscribe((result) => {
            if (result === "true") {
              this.openDialogSubmitExam();
              this.submitExam();
            }
          });
        }
      } else {
        const { minutes, seconds } = this.convertMsToMinutesAndSecond(distance);
        this.countDownTimeExam.minutes = minutes;
        this.countDownTimeExam.seconds = seconds;

        // thông báo sắp hết giờ
        if (minutes <= 1 && !this.isNotiExamTimeOut) {
          this.toast.warning({
            summary: "Hãy kiểm tra lại bài làm của bạn",
            duration: 10000,
            detail: "Sắp hết thời gian làm bài",
          });
          this.isNotiExamTimeOut = true;
        }
      }
    }, 1000);
  }

  // convert milisecond to minus
  convertMsToMinutesAndSecond(milisecond: number) {
    let minutes: string | number = Math.floor(milisecond / 60000);
    let seconds: string | number = +((milisecond % 60000) / 1000).toFixed(0);
    if (seconds === 60) {
      seconds = 0;
      minutes += 1;
    }

    if (minutes < 10) minutes = `0${minutes}`;
    if (seconds < 10) seconds = `0${seconds}`;

    return { minutes, seconds };
  }

  openDialogSubmitExam() {
    this.isSubmitingExam = true;
    this.dialog.open(DialogConfirmComponent, {
      width: "500px",
      disableClose: true,
      data: {
        description:
          "Vui lòng không thoát ứng dụng. Hệ thống sẽ tự động chuyển đến trang kết quả sau khi nộp bài thành công.",
        isNotShowBtn: true,
        title: "Đang nộp bài...",
        isShowLoading: true,
      },
    });
  }

  openUserInfoModal() {
    const registerInfoModalDialog = this.dialog.open(ModalInfoCapacityComponent, {
      width: "700px",
    });

    registerInfoModalDialog.afterClosed().subscribe((result: any) => {
      if (result && typeof result !== "string") {
        this.dialog.open(DialogConfirmComponent, {
          width: "500px",
          disableClose: true,
          data: {
            description:
              "Vui lòng không thoát ứng dụng.",
            isNotShowBtn: true,
            title: "Đang kiểm tra thông tin người dùng...",
            isShowLoading: true,
          },
        });

        this.userService.registerCapacity(result).subscribe(async res => {
          this.dialog.closeAll();
          let msg = "";

          let title = "";

          if (res.status == false) {
            title = "Đã xảy ra lỗi";
            msg = "Có lỗi khi kiểm tra thông tin người dùng";
            this.dialog.open(DialogConfirmComponent, {
              width: "500px",
              disableClose: false,
              data: {
                isNotShowBtnCancel: true,
                title: title,
                description: msg,
              },
            });

          } else {

            title = "Thông báo";

            msg = "Kiểm tra thông tin người dùng thành công!";

            // console.log(res.payload);

            this.userService.loginLocal(res.payload);

            this.isLoggin = true;

            this.checkCapacity();
          }
        });

      }
    });
  }

  // get vòng thi trước
  getPreRound() {
    let preRound: { status: boolean; round_id?: number };
    const listRound = this.roundDetail.contest.rounds;

    const currentRoundIndex = listRound.findIndex((item) => item.id === this.roundDetail.id);
    if (currentRoundIndex > 0 && listRound.length >= 2) {
      preRound = {
        status: true,
        round_id: listRound[currentRoundIndex - 1].id,
      };
    } else {
      preRound = {
        status: false,
      };
    }

    return preRound;
  }

  // get vòng tiếp theo
  getNextRound(): { status: boolean; round_id?: number } {
    let nextRound: { status: boolean; round_id?: number };
    const listRound = this.roundDetail.contest.rounds;

    const currentRoundIndex = listRound.findIndex((item) => item.id === this.roundDetail.id);
    if (currentRoundIndex < listRound.length - 1) {
      nextRound = {
        status: true,
        round_id: listRound[currentRoundIndex + 1].id,
      };
    } else {
      nextRound = {
        status: false,
      };
    }

    return nextRound;
  }

  // click vòng thi tiếp theo
  handleGoToNextRound(round_id?: number) {
    this.statusTakingExam = 0;
    this.isSubmitingExam = false;
    this.isFetchingRound = true;
    this.router.navigate(["/danh-gia-nang-luc/vao-thi", this.roundDetail.contest.id, "bai-thi", round_id]);
  }

  // open full screen
  openFullscreen() {
    if (this.element.requestFullscreen) {
      this.element.requestFullscreen();
    } else if (this.element.mozRequestFullScreen) {
      /* Firefox */
      this.element.mozRequestFullScreen();
    } else if (this.element.webkitRequestFullscreen) {
      /* Chrome, Safari and Opera */
      this.element.webkitRequestFullscreen();
    } else if (this.element.msRequestFullscreen) {
      /* IE/Edge */
      this.element.msRequestFullscreen();
    }

    this.isFullScreen = true;
  }

  /* Close fullscreen */
  closeFullscreen() {
    if (this.document.exitFullscreen) {
      this.document.exitFullscreen();
    } else if (this.document.mozCancelFullScreen) {
      /* Firefox */
      this.document.mozCancelFullScreen();
    } else if (this.document.webkitExitFullscreen) {
      /* Chrome, Safari and Opera */
      this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
      /* IE/Edge */
      this.document.msExitFullscreen();
    }

    this.isFullScreen = false;
  }

  // disable event
  disabledEvent(e: Event) {
    if (e.stopPropagation) {
      e.stopPropagation();
    } else if (window.event) {
      window.event.cancelBubble = true;
    }
    e.preventDefault();
    return false;
  }

  // chặn f12
  handleDisableKeydown(e: any) {
    if (e.ctrlKey && e.shiftKey && e.keyCode == 73) {
      this.disabledEvent(e);
    }
    // "J" key
    if (e.ctrlKey && e.shiftKey && e.keyCode == 74) {
      this.disabledEvent(e);
    }

    // "C" key
    if (e.ctrlKey && e.shiftKey && e.keyCode == 67) {
      this.disabledEvent(e);
    }

    // "S" key + macOS
    if (e.keyCode == 83 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
      this.disabledEvent(e);
    }
    // "U" key
    if (e.ctrlKey && e.keyCode == 85) {
      this.disabledEvent(e);
    }
    // "F12" key
    if (e.keyCode == 123) {
      this.disabledEvent(e);
    }

    // Ctrl + Tab
    if (e.ctrlKey && e.keyCode == 9) {
      this.disabledEvent(e);
    }

    // Ctrl + Shift + Tab
    if (e.ctrlKey && e.shiftKey && e.keyCode == 9) {
      this.disabledEvent(e);
    }

    // Ctrl + Up arrow
    if (e.ctrlKey && e.keyCode == 38) {
      this.disabledEvent(e);
    }

    // Command + ` (MacOS)
    if (e.keyCode == 192 && e.mateKey) {
      this.disabledEvent(e);
    }

    // Alt + Tab
    if (e.keyCode == 9 && e.altKey) {
      this.disabledEvent(e);
    }

    // Windows + Tab
    if (e.keyCode == 9 && e.metaKey) {
      this.disabledEvent(e);
    }

    if (e.ctrlKey && (e.key == "p" || e.charCode == 16 || e.charCode == 112 || e.keyCode == 80)) {
      e.cancelBubble = true;
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }

  // chặn f11
  handleDisableF11Key(e: any) {
    if (e.keyCode === 122) {
      this.disabledEvent(e);
    }
  }

  // chặn copy
  handleDisableCopy(e: any) {
    if (e.ctrlKey && e.keyCode === 67) {
      this.disabledEvent(e);
      navigator.clipboard.writeText("Thí sinh không được gian lận trong quá trình làm bài!");
    }
  }

  // remove all event in page
  handleRemoveAllEvent() {
    window.onresize = () => {
    };
    window.onkeydown = (e: any) => {
      this.disabledEvent(e);
    };
    window.oncontextmenu = () => {
    };
  }

  // get thời gian làm bài
  convertTimeExamToSeconds(time: number, time_type: number) {
    // time_type: 0 => phút, 1 => giờ, 2 => ngày
    let timeExam = 0;

    switch (time_type) {
      case 0:
        timeExam = time * 60;
        break;
      case 1:
        timeExam = time * 60 * 60;
        break;
      case 2:
        timeExam = time * 24 * 60 * 60;
        break;
    }

    return +timeExam;
  }

  // xử lý đối với câu hỏi có nhiều đáp án
  onCheckChange(formControlName: string, event: any) {
    const formArray: FormArray = this.formAnswers.get(formControlName) as FormArray;

    /* Selected */
    if (event.target.checked) {
      // Add a new control in the arrayForm
      formArray.push(new FormControl(event.target.value));
    } else {
      /* unselected */
      // find the unselected element
      let i: number = 0;

      formArray.controls.forEach((ctrl) => {
        if (ctrl.value == event.target.value) {
          // Remove the unselected element from the arrayForm
          formArray.removeAt(i);
          return;
        }

        i++;
      });
    }
  }

  // check đáp án của câu hỏi có nhiều đáp án
  checkAnswerd(formControlNam: string, answerId: number) {
    let isChecked = false;
    const testResultLocal: TestResultStorage[] = JSON.parse(localStorage.getItem(this.testResultStorageKey) as string);
    const resultRoundExits = testResultLocal && testResultLocal.find((item) => item.round_id === this.roundDetail.id);

    if (testResultLocal && resultRoundExits && resultRoundExits.data) {
      for (const item in resultRoundExits.data) {
        if (item === formControlNam) {
          isChecked = resultRoundExits.data[item].includes(answerId.toString()) ? true : false;
        }
      }
    }

    return isChecked;
  }

  // modal lịch sử làm bài
  handleOpenHistoryExam() {
    // chưa có data ls làm bài ? get data : open modal
    if (!this.examHistory) {
      this.isFetchingHistoryExam = true;
      // get ls làm bài
      this.capacityService.getHistoryExam(this.resultExam.capacityId).subscribe(
        (res) => {
          this.examHistory = {
            capacity: this.roundDetail.contest,
            round: this.roundDetail,
            exam: {
              ...res.exam,
              time_exam:
                this.convertTimeExamToSeconds(this.roundDetail.time_exam, this.roundDetail.time_type_exam) / 60,
            },
          };

          this.dialog.open(ModalHistoryCapacityComponent, {
            width: "1000px",
            maxWidth: "100%",
            data: this.examHistory,
          });
        },
        () => {
        },
        () => (this.isFetchingHistoryExam = false),
      );
    } else {
      this.dialog.open(ModalHistoryCapacityComponent, {
        width: "1000px",
        maxWidth: "100%",
        data: this.examHistory,
      });
    }
  }

  // tính thời gian làm bài
  getMinutesAndSecondBetweenTwoDate(firstDate: Date, lastDate: Date) {
    const firstDateMs = new Date(firstDate).getTime();
    const lastDateMs = new Date(lastDate).getTime();
    const diffMs = lastDateMs - firstDateMs;

    return this.convertMsToMinutesAndSecond(diffMs);
  }
}
