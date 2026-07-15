import { Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import * as moment from "moment";
import { Contest } from "src/app/models/contest";
import { Major } from "src/app/models/major";
import { ConfigFunctionService } from "src/app/services/config-function.service";
import { ContestService } from "src/app/services/contest.service";
import { MajorService } from "src/app/services/major.service";
import { UserService } from "src/app/services/user.service";

@Component({
  selector: "app-contest",
  templateUrl: "./contest.component.html",
  styleUrls: ["./contest.component.css"],
})
export class ContestComponent implements OnInit {
  majors: Array<Major>;
  major_id: any;
  major_slug: any;
  contests: Array<Contest> = [];
  keywordSearchContest: string;
  orderObj: any;
  statusContest: boolean = false;
  statusMajor: boolean = false;
  checkUserHasLogin: boolean = false;
  statusCurrContest: number = 0;
  contestType: any;

  constructor(
    public majorService: MajorService,
    public contestService: ContestService,
    public userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private titleService: Title,
    private configFunctionService: ConfigFunctionService,
  ) {}

  formSearchMajor = new FormGroup({
    keywordMajor: new FormControl(""),
  });

  formSearchContest = new FormGroup({
    keywordContest: new FormControl(""),
  });

  ngOnInit(): void {
    // Load lên đầu trang
    this.configFunctionService.runTop();

    this.userService.getUserValue().id != undefined ? (this.checkUserHasLogin = true) : this.checkUserHasLogin;

    this.route.queryParamMap.subscribe((params) => {
      this.orderObj = { ...params };
    });

    if (this.orderObj.params.status || this.orderObj.params.keyword) {
      this.statusCurrContest = this.orderObj.params.status;
      this.keywordSearchContest = this.orderObj.params.keyword;
      this.formSearchContest.controls["keywordContest"].setValue(this.keywordSearchContest);
    }

    if (this.orderObj.params.major_id) {
      this.majorService.getMajorWhereSlug(this.orderObj.params.major).subscribe((res) => {
        this.major_id = res.payload.id;
      });
    }

    this.filterContest();

    this.titleService.setTitle("Cuộc thi");

    window.addEventListener("scroll", this.scrollNavSub);

    this.getAllMajor();
  }

  scrollNavSub() {
    let element = document.querySelector(".contest__nav");
    if (window.scrollY > 250) {
      element?.classList.add("fixed-nav");
    } else {
      element?.classList.remove("fixed-nav");
    }
  }

  // Tìm kiếm chuyên ngành
  searchMajor() {
    this.statusMajor = false;
    this.majorService.searchMajor(this.formSearchMajor.controls["keywordMajor"].value).subscribe((res) => {
      if (res.status) {
        this.majors = res.payload;
        this.statusMajor = true;
      }
    });
  }

  // Tìm kiếm cuộc thi
  searchContest() {
    this.statusContest = false;
    this.keywordSearchContest = this.formSearchContest.controls["keywordContest"].value;
    this.filterContest();
  }

  // Gọi tất cả chuyên ngành
  getAllMajor() {
    this.statusMajor = false;
    this.majorService.getAll().subscribe((res) => {
      if (res.status) {
        this.majors = res.payload;
        this.statusMajor = true;
      }
    });
  }

  // Reset Chuyên ngành
  resetMajor() {
    this.major_id = null;
    this.formSearchMajor.controls["keywordMajor"].setValue(null);
    this.major_slug = null;
    this.filterContest();
    this.getAllMajor();
  }

  resetType() {
    this.contestType = null;
    const types = document.querySelectorAll(".contest__content-aside-type--item");
    types.forEach((element) => {
      element.classList.remove("active");
    });
    this.filterContest();
  }

  // Update status  contest
  updateStatusContest(event: any, status: number) {
    if (this.statusContest) {
      this.statusCurrContest = status;
      const statusAll = document.querySelectorAll(".contest__nav-item");
      for (let i = 0; i < statusAll.length; i++) {
        statusAll[i]?.classList.remove("active");
      }
      this.filterContest();
      event.currentTarget.classList.add("active");
    }
  }

  // Function dùng chung để lọc sản phẩm
  filterContest() {
    this.statusContest = false;
    this.router.navigate(["/cuoc-thi"], {
      queryParams: {
        status: this.statusCurrContest,
        keyword: this.keywordSearchContest,
        major: this.major_slug,
        type: this.contestType,
      },
      queryParamsHandling: "merge",
    });
    this.contestService
      .filterContest(this.keywordSearchContest, this.major_id, this.statusCurrContest, this.contestType)
      .subscribe((res) => {
        if (res.status) {
          this.statusContest = true;
          let contests = res.payload.data;
          let today = new Date().getTime();
          if (this.statusCurrContest == 1) {
            this.contests = [];
            this.contests = contests.filter((item: Contest) => {
              let time = this.getTime(item);
              return time.date_register_start > today;
            });
          } else if (this.statusCurrContest == 0) {
            this.contests = contests.filter((item: Contest) => {
              let time = this.getTime(item);
              return time.date_end > today && !(time.date_register_start > today);
            });
          } else {
            this.contests = contests;
          }
        }
      });
    this.configFunctionService.runTop();
  }

  getTime(item: Contest) {
    let date_end = new Date(moment(item.register_deadline).format("lll")).getTime();
    let date_register_start = new Date(moment(item.start_register_time).format("lll")).getTime();

    return {
      date_end: date_end,
      date_register_start: date_register_start,
    };
  }

  // Gọi các cuộc thi theo chuyên ngành
  getWhereMajor(event: any, item: Major) {
    const majors = document.querySelectorAll(".contest__content-aside-major--item");
    majors.forEach((element) => {
      element.classList.remove("active");
    });

    this.major_slug = item.slug;
    this.major_id = item.id;
    event.currentTarget.classList.add("active");
    this.filterContest();
  }

  getByType(event: any, type: number) {
    const types = document.querySelectorAll(".contest__content-aside-type--item");
    types.forEach((element) => {
      element.classList.remove("active");
    });
    
    event.currentTarget.classList.add("active");
    this.contestType = type;
    this.filterContest();
  }
}
