import { Router } from "@angular/router";
import { Component, OnInit } from "@angular/core";
import { Post } from "src/app/models/post.model";
import { ListPostService } from "src/app/services/list-post.service";
import { Title } from "@angular/platform-browser";

@Component({
  selector: "app-posts",
  templateUrl: "./posts.component.html",
  styleUrls: ["./posts.component.css"],
})
export class PostsComponent implements OnInit {
  postRecruitmentFirst: Post;
  listPostRecruitment: Post[];

  postContestFirst: Post;
  listPostContest: Post[];

  postEventFirst: Post;
  listPostEvent: Post[];

  postCapacityFirst: Post;
  listPostCapacity: Post[];

  sliderPost = {
    slidesToShow: 2,
    autoplay: true,
    slidesToScroll: 1,
    fadeSpeed: 3000,
    arrows: false,
    cssEase: "linear",
  };

  constructor(private postService: ListPostService, private router: Router, private titleService: Title) {}

  ngOnInit(): void {
    this.backTop();
    this.titleService.setTitle("Danh Sách tin tức");
    this.getListPostRecruitment();
    this.getListPostCapacity();
    this.getListPostContest();
    this.getListEvent();
  }

  // Change screen back top
  backTop() {
    $("html , body").animate(
      {
        scrollTop: 0,
      },
      1000,
    );
  }

  getListPostRecruitment() {
    this.postService.getPostByCategory("post-recruitment", "1").subscribe((res) => {
      if (res.status) {
        let arrResult = res.payload.data;
        this.postRecruitmentFirst = arrResult[0];
        this.listPostRecruitment = arrResult.filter((res: Post, index: number) => {
          return index <= 10 && res.id !== arrResult[0].id;
        });
      }
    });
  }

  getListPostContest() {
    this.postService.getPostByCategory("post-contest", "1").subscribe((res) => {
      if (res.status) {
        let arrResult = res.payload.data;
        this.postContestFirst = arrResult[0];
        this.listPostContest = arrResult.filter((res: Post, index: number) => {
          return index <= 2;
        });
      }
    });
  }

  getListEvent() {
    this.postService.getPostByCategory("post-event", "1").subscribe((res) => {
      if (res.status) {
        let arrResult = res.payload.data;
        console.log(arrResult);

        this.postEventFirst = arrResult[0];
        this.listPostEvent = arrResult.filter((res: Post, index: number) => {
          return index <= 2;
        });
      }
    });
  }

  getListPostCapacity() {
    this.postService.getPostByCategory("post-capacity", "1").subscribe((res) => {
      if (res.status) {
        let arrResult = res.payload.data;
        this.postCapacityFirst = arrResult[0];
        this.listPostCapacity = arrResult.filter((res: Post, index: number) => {
          return index <= 2;
        });
      }
    });
  }

  clickChangeUrlToCategoryPost(data: string) {
    this.router.navigateByUrl(`danh-muc-bai-viet?cate=${data}`);
  }

  sliderHeaderPost = {
    slidesToShow: 2,
    infinite: true,
    autoplay: true,
    arrows: true,
    prevArrow: ".prev-arrow",
    nextArrow: ".next-arrow",
    slidesToScroll: 1,
    fadeSpeed: 1000,
  };
}
