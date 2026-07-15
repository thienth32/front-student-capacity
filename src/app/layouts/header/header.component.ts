import { Component, Input, OnInit } from "@angular/core";
import { User } from "src/app/models/user";
import { UserService } from "src/app/services/user.service";
import { Contest } from "src/app/models/contest";
import { Post } from "src/app/models/post.model";
import { WishlistService } from "src/app/services/wishlist.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
})
export class HeaderComponent implements OnInit {
  user: User;
  statusWindow: boolean = false;
  contests: Array<Contest> = [];
  posts: Array<Post> = [];
  statusPage: boolean = false;
  typeTab: number = 0;
  countContest: number;
  countPost: number;
  totalSave: number = 0;
  isOpenMenuMobile = false;
  isLogin: boolean = false;
  countInfoSaveItem: number = 0;
  isChangeSave: boolean = false;
  menu: Array<any> = [
    { label: 'Trang chủ', link: '/', exact: true },
    { label: 'Về chúng tôi', link: '/gioi-thieu' },

    {
      label: 'Hoạt động',
      children: [
        { label: 'Tin tức', link: '/tin-tuc' },
        { label: 'Cuộc thi', link: '/cuoc-thi' },
        { label: 'Dịch vụ việc làm', link: '/dich-vu' },
        { label: 'Mentorship', link: '/chuong-trinh-mentor' },
        { label: 'Ngày hội việc làm', link: '/ngay-hoi-viec-lam' },
        { label: 'Vườn ươm khởi nghiệp', link: '/vuon-uom-khoi-nghiep' },
        { label: 'Đặc quyền sinh viên', link: '/dac-quyen-sinh-vien' },
      ],
    },
    {
      label: 'Tuyển dụng',
      children: [
        { label: 'Tin tức tuyển dụng', link: '/tin-tuc-tuyen-dung' },
        { label: 'Đợt tuyển dụng', link: '/dot-tuyen-dung-doanh-nghiep' },
      ],
    },
    { label: 'Hỏi đáp', link: '/hoi-dap' },
  ];
  openSubMenu: any = null;

  constructor(
    private userService: UserService,
    private wishlist: WishlistService,
    private localStorageService: LocalStorageService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.userService.user.subscribe((data) => {
      this.user = data!;
    });

    if (this.userService.getUserValue().id) {
      this.getListCount();
    }

    this.localStorageService.watchStorage().subscribe((data) => {
      if (data) {
        this.isChangeSave = true;
        if (this.userService.getUserValue().id) {
          this.getListCount();
        }

        this.countInfoSaveItem = data;
      }
    });
  }

  getListCount() {
    this.wishlist.wishListCount().subscribe((res) => {
      if (res.status) {
        this.countContest = res.payload.count_post;
        this.countPost = res.payload.count_contest;
        this.countInfoSaveItem = this.countContest + this.countPost;
        localStorage.setItem("info-save", JSON.stringify(this.countInfoSaveItem));
      }
    });
  }

  getContest() {
    this.wishlist.getlistWish("contest").subscribe((res) => {
      if (res.status) {
        this.contests = res.payload;
        this.statusPage = true;
      }
    });
  }

  getPost() {
    this.statusPage = false;
    this.wishlist.getlistWish("post").subscribe((res) => {
      if (res.status) {
        this.posts = res.payload;
        this.statusPage = true;
      }
    });
  }

  getContestStatus(event: any) {
    if (this.posts) {
      document.querySelector(".post")?.classList.remove("active");

      event.currentTarget.classList.add("active");
      this.getContest();
      this.typeTab = 0;
    }
  }

  filterContest(item: Contest) {
    this.statusPage = false;
    this.statusPage = true;
    if (item.user_wishlist) {
      this.contests = this.contests.filter((res: Contest) => {
        return res.id !== item.id;
      });
    }
  }

  filterPost(item: Post) {
    this.statusPage = false;
    this.statusPage = true;
    if (item.user_wishlist) {
      this.posts = this.posts.filter((res: Post) => {
        return res.id !== item.id;
      });
    }
  }

  getPostStatus(event: any) {
    if (this.statusPage) {
      this.statusPage = false;
      this.getPost();
      document.querySelector(".contest")?.classList.remove("active");
      event.currentTarget.classList.add("active");
      this.typeTab = 1;
    }
  }

  openSaveInfo() {
    this.statusPage = false;
    this.getListCount();
    this.getContest();
    document.querySelector(".sidepanel")?.classList.add("save-info-acive");
    document.querySelector(".overlay")?.classList.remove("d-none");
  }

  scrollToContactForm() {
    if (window.location.pathname == '/') {
      const contactForm = document.querySelector("#contactForm");
      contactForm?.scrollIntoView(false);
    } else {
      this.router.navigateByUrl("/#contactForm");
    }
  }

  closeSaveInfo(status: boolean) {
    const menuRes = document.querySelector(".sidepanel");
    const overlay = document.querySelector(".overlay");
    menuRes?.classList.remove("save-info-acive");
    overlay?.classList.add("d-none");
  }

  closeMenu() {
    const overlay = document.querySelector(".overlay");
  }

  toggleMobileSubMenu(item: any) {
    this.openSubMenu = this.openSubMenu === item ? null : item;
  }

  // LogOut
  logOut() {
    localStorage.clear();
    this.ngOnInit();
    this.userService.logout();
    this.router.navigate(["/"]);
  }

  // toggle menu mobile
  handleToggleMenuMobile(value: boolean) {
    this.isOpenMenuMobile = value ?? !this.isOpenMenuMobile;
  }

  backStatusPopup(event: any) {
    this.isLogin = event;
  }

  // check empty object
  checkEmpty(obj: {}) {
    return Object.keys(obj).length > 0;
  }

  handleLogin() {
    this.localStorageService.saveCurrentRoute();
    this.router.navigate(["/login"]);
  }
}
