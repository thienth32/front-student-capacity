import { Component, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";
import { Contest } from "src/app/models/contest";
import { ContestService } from "src/app/services/contest.service";
import { Major } from "src/app/models/major";
import { ResultMajor } from "src/app/models/result-major.model";
import { CompanyService } from "src/app/services/company.service";
import { Company } from "src/app/models/company.models";
import { Post } from "src/app/models/post.model";
import { ListPostService } from "src/app/services/list-post.service";
import { ResponsePayload } from "src/app/models/response-payload";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.css"],
})
export class HomeComponent implements OnInit {
  listPostEvent: Post[] | null;
  listRecruitmentPosition: Post[] | null;
  advanIndex: number = 0;

  majors: Array<Major>;
  statusResultMajor: boolean = false;
  users: Array<User>;
  loggedInUser: User;
  contests: Array<Contest>;
  nameSelectMajor: string;
  resultMajor: Array<ResultMajor>;
  loadingResultContest: boolean = false;
  statusResult: boolean = false;
  companies: Array<Company>;
  majorIdSelect: number = 1;
  nameMajor: string;
  slugMajor: string;
  arrLinkPost: Array<any>;
  currentIndex: number = 1;
  statusListPostRecruitment: boolean = false;

  sliderRecruitmentPosition = {
    slidesToShow: 1,
    dots: true,
    autoplay: true,
    arrows: true,
    slidesToScroll: 1,
    fadeSpeed: 1000,
  };

  sliderCompany = {
    slidesToShow: 5,
    infinite: true,
    autoplay: true,
    arrows: true,
    slidesToScroll: 1,
    fadeSpeed: 1000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 749,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  sliderFeature = {
    slidesToShow: 1,
    infinite: true,
    cssEase: "linear",
    autoplay: true,
    slidesToScroll: 1,
    fadeSpeed: 4000,
    fade: true,
  };

  constructor(
    private contestService: ContestService,
    private userService: UserService,
    private companyService: CompanyService,
    private postService: ListPostService,
    private titleService: Title,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("Trang chủ");
    this.getRecruitmentPosition();
    this.contestService.getWhereStatus(1, "desc").subscribe((res) => {
      if (res.status == true) {
        this.contests = res.payload.filter((res: Contest, index: number) => {
          return index > -1 && index < 4;
        });
      }
    });
    this.getListPost();
    this.getAllCompany();
    // Slider tính năng

    const advantageFrist = document.querySelector(".advantage__tag--1");
    const advantageImage = document.querySelector(".advantage-show__img");
    const advantageDots = document.querySelector(".advantage-show__dots-item");
    advantageDots?.classList.add("advantage-show__dots-red");
    advantageFrist?.classList.add("active");
    advantageImage?.classList.add("d-block");

    setInterval(() => {
      // Slider đợt giới thiệu chức năng code online.
      this.advanIndex++;

      const advantageEleImage = document.querySelectorAll(".advantage-show__img");
      advantageEleImage.forEach((element, index) => {
        element.classList.add("d-none");
        if (this.advanIndex == index + 1) {
          element.classList.remove("d-none");
          element.classList.add("d-block");
        }
      });

      const advantage = document.querySelectorAll(".advantage__tag");
      advantage.forEach((element, index) => {
        element.classList.remove("active");
        if (this.advanIndex == index + 1) {
          element.classList.add("active");
        }
      });

      if (advantage) {
        if (this.advanIndex == advantage.length + 1) {
          this.advanIndex = 0;
          advantage[0].classList.add("active");
          advantageEleImage[0].classList.remove("d-none");
        }
      }

      // Slider đợt tuyển dụng.
    }, 20000);

    setInterval(() => {
      if (this.arrLinkPost) {
        if (this.currentIndex == this.arrLinkPost.length) {
          this.payingRecruitmentPositionSlider(1);
        } else if (this.currentIndex < this.arrLinkPost.length) {
          let index = this.currentIndex + 1;
          this.payingRecruitmentPositionSlider(index);
        }
      }
    }, 10000);
  }

  // Get api list contest after login
  getListHasAfterLogin() {
    this.userService.getListContestHasJoin(1, "desc").subscribe((res) => {
      res.status ? (this.contests = res.payload) : this.contests;
    });
  }

  // Get api recruitments
  getAllCompany() {
    this.companyService.getAllCompany().subscribe((res) => {
      if (res.status) {
        this.companies = res.payload.data;
      }
    });
  }

  // Control next
  nextRecruitmentPosition() {
    this.statusListPostRecruitment = false;
    let index = this.currentIndex + 1;
    if (index > this.arrLinkPost.length) {
      this.payingRecruitmentPosition(1);
    } else {
      this.payingRecruitmentPosition(index);
    }
  }

  //  Prev next
  prevRecruitmentPosition() {
    this.statusListPostRecruitment = false;
    let index = this.currentIndex - 1;
    if (index < 1) {
      this.payingRecruitmentPosition(this.arrLinkPost.length);
    } else {
      this.payingRecruitmentPosition(index);
    }
  }

  // Get list các đợt tuyển dụng
  getRecruitmentPosition() {
    this.statusListPostRecruitment = false;
    this.postService.recruitmentPosition().subscribe((res) => {
      this.setDataRecruitmentPosition(res);
    });
  }

  // Set value after click control
  setDataRecruitmentPosition(res: ResponsePayload) {
    if (res.status) {
      this.listRecruitmentPosition = res.payload.data;
      console.log(this.listRecruitmentPosition);
      
      this.arrLinkPost = res.payload.links;
      this.arrLinkPost.pop();
      this.arrLinkPost.shift();
      this.statusListPostRecruitment = true;
    }
  }

  // PaydingSlider
  payingRecruitmentPositionSlider(index: number) {
    this.currentIndex = index;
    this.postService.paydingRecruitmentPosition(index).subscribe((res) => {
      this.setDataRecruitmentPosition(res);
    });
  }

  //  Phân trang các bài viết tuyển dụng
  payingRecruitmentPosition(index: number) {
    this.statusListPostRecruitment = false;
    this.currentIndex = index;
    this.postService.paydingRecruitmentPosition(index).subscribe((res) => {
      this.setDataRecruitmentPosition(res);
    });
  }

  //-----------------------  Danh sách các 3 bài viết
  getListPost() {
    this.postService.getPostByCategory("post-contest", "1").subscribe((res) => {
      if (res.status == true) {
        let arrResult = res.payload.data;
        this.listPostEvent = arrResult.filter((res: Post, index: number) => {
          return index < 3;
        });
      }
    });
  }
}
