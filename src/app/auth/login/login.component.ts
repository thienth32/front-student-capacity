import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { GoogleLoginProvider, SocialAuthService, SocialUser } from "angularx-social-login";
import { UserService } from "src/app/services/user.service";
import { NgToastService } from "ng-angular-popup";
import { Title } from "@angular/platform-browser";
import { LocalStorageService } from "src/app/services/local-storage.service";

@Component({
  selector: "app-login",
  templateUrl: "./login.component.html",
  styleUrls: ["./login.component.css"],
})
export class LoginComponent implements OnInit {
  socialUser!: SocialUser;
  c?: boolean = true;
  statusLogin: boolean = false;
  alert = {
    type: "danger",
    message: "",
  };

  constructor(
    private socialAuthService: SocialAuthService,
    private userService: UserService,
    private router: Router,
    private toast: NgToastService,
    private titleService: Title,
    private localStorageService: LocalStorageService,
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle("Đăng nhập");
    console.log("uy");
  }

  loginWithGoogle(): void {
    this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID).then((data) => {
      this.statusLogin = true;
      this.userService.login(data.authToken).subscribe((status) => {
        if (status == true) {
          this.statusLogin = false;
          setTimeout(() => {
            this.toast.success({ summary: "Đăng nhập thành công", detail: "Thông báo", duration: 5000 });
            const backRoute = this.localStorageService.getBackRoute();
            if (!backRoute) {
              this.router.navigate(["/"]);
            } else {
              if (backRoute.includes("?")) {
                const backRouteArr = backRoute.split("?");
                const queryArr = backRouteArr[1].split("&");

                let queryParams = {};
                queryArr.forEach((item) => {
                  const strToArr = item.split("=");

                  Object.assign(queryParams, {
                    [strToArr[0]]: decodeURI(strToArr[1]),
                  });
                });

                this.router.navigate([backRouteArr[0]], {
                  queryParams,
                  queryParamsHandling: "merge",
                });
              } else {
                this.router.navigate([backRoute]);
              }
            }
          }, 1000);
        } else {
          this.statusLogin = false;
          this.toast.error({ summary: "Tài khoản không hợp lệ", detail: "Thông báo", duration: 5000 });
        }
      });
    });
  }

  logOut(): void {
    this.socialAuthService.signOut();
  }
}
