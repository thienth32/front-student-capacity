import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Router } from "@angular/router";
import { NgToastService } from "ng-angular-popup";
import { Contest } from "src/app/models/contest";
import { Post } from "src/app/models/post.model";
import { GetValueLocalService } from "src/app/services/get-value-local.service";
import { LocalStorageService } from "src/app/services/local-storage.service";
import { UserService } from "src/app/services/user.service";
import { WishlistService } from "src/app/services/wishlist.service";
import { ListPostService } from "src/app/services/list-post.service";
@Component({
  selector: "app-recruitment-position",
  templateUrl: "./recruitment-position.component.html",
  styleUrls: ["./recruitment-position.component.css"],
})
export class RecruitmentPositionComponent implements OnInit {
  @Input() item: Post;
  @Output() requestFavorite = new EventEmitter<Post>();
  constructor(
    private userService: GetValueLocalService,
    private countSave: LocalStorageService,
    private wishlist: WishlistService,
    private router: Router,
    private postService: ListPostService,
  ) {}

  ngOnInit(): void {}

  favoriteEvent(event: any, item: Post) {
    const data = {
      type: "post",
      id: item.id,
    };
    
    if (!this.userService.getValueLocalUser("user")) {
      this.countSave.setIsPopup(1);
    } else {
      this.requestFavorite.emit(item);
      if (event.currentTarget.className.includes("primary-color")) {
        event.currentTarget.classList.remove("primary-color");
        event.currentTarget.parentElement.classList.remove("opacity-100");
        event.currentTarget.parentElement.classList.add("my-add-favorite__icon");
        this.wishlist.wishListRemove(data).subscribe((res) => {
          if (res.status) {
            this.countSave.setCurrentSave(1, false);
          }
        });
      } else {
        event.currentTarget.classList.add("primary-color");
        event.currentTarget.parentElement.classList.add("opacity-100");
        event.currentTarget.parentElement.classList.remove("my-add-favorite__icon");
        this.wishlist.wishListAdd(data).subscribe((res) => {
          console.log(res);

          if (res.status) {
            this.countSave.setCurrentSave(1, true);
          }
        });
      }
    }
  }

  increaseViewCount(item: Post) {
    // this.job.luotView++;
    const idPost = item.id;
    
    // console.log(idPost);
    this.postService.increaseViews(idPost).subscribe((res) => {
        // console.log(res);
    });
    
  }
}
