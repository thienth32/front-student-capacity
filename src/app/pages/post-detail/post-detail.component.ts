import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { map, switchMap } from "rxjs";
import { ListPostService } from "src/app/services/list-post.service";
import { Post } from "src/app/models/post.model";
import { ModalUploadCvComponent } from "src/app/modal/modal-upload-cv/modal-upload-cv.component";
import { MatDialog } from "@angular/material/dialog";
import { Title } from "@angular/platform-browser";
import { KeywordService } from "src/app/services/keyword.service";
import { Keyword } from "src/app/models/keyword";
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { DialogConfirmComponent } from "src/app/modal/dialog-confirm/dialog-confirm.component";

@Component({
  selector: "app-post-detail",
  templateUrl: "./post-detail.component.html",
  styleUrls: ["./post-detail.component.css"],
})
export class PostDetailComponent implements OnInit {
  postDetail!: Post;
  statusPost: boolean = false;
  routeCategoryPost: string = "";
  listTag: Array<Keyword>;
  content: any;

  constructor(
    private postService: ListPostService,
    private router: Router,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    public title: Title,
    private keywordService: KeywordService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.backTop();
    this.title.setTitle("Chi tiết tin tức");

    this.route.paramMap
      .pipe(
        map((params) => params.get("slug")),
        switchMap((slug) => this.postService.getPostBySlug(slug)),
      )
      .subscribe((res) => {
        if (res.status) {
          this.postDetail = res.payload;
          this.content = this.getSafeHtml(this.postDetail?.content ?? "");
          this.postDetail.postable_type === "App\\Models\\Contest"
            ? ((this.postDetail.postable_type = "Cuộc thi"), (this.routeCategoryPost = "post-contest"))
            : this.postDetail.postable_type === "App\\Models\\Recruitment"
            ? ((this.postDetail.postable_type = "Tuyển dụng"), (this.routeCategoryPost = "post-recruitment"))
            : ((this.postDetail.postable_type = "Đánh giá năng lực"), (this.routeCategoryPost = "post-capacity"));
          this.postDetail ? (this.statusPost = true) : this.statusPost;
        }
      });

    this.getAllKeywordPost();
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

  // Open-modal upload cv
  openModal() {
    const dialogRef = this.dialog.open(ModalUploadCvComponent, {
      width: "700px",
      data: {
        postDetail: this.postDetail,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log("result", result);
    });
  }

  fullRecruitmentModal() {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: "600px",
      data: {
        isNotShowBtnCancel: true,
        title: `${this.postDetail.position ?? ''} - <${this.postDetail?.code_recruitment}>`,
        description: `Doanh nghiệp ${this.postDetail?.enterprise?.name} đã tuyển đủ nhân sự cho vị trí ${this.postDetail.position ?? 'này'}. Bạn vui lòng ứng tuyển vào vị trí phù hợp khác`,
      },
    });
  }

  // Chuyển đến trang danh mục bài viết
  clickChangeUrlToCategoryPost(data: string) {
    this.router.navigateByUrl(`danh-muc-bai-viet?cate=${data}`);
  }

  // Chuyển đến trang tin tức tuyển dụng theo chuyên ngành
  clickChangeUrlToRecruitmentPostByMajor(data = null) {
    let url = "tin-tuc-tuyen-dung?";
    if (data) {
      url += `major_id=${data}`;
    }
    this.router.navigateByUrl(url);
  }

  // Get all key word bài viết
  getAllKeywordPost() {
    this.keywordService.getKeywordWhereType(0).subscribe((res) => {
      if (res.status) {
        this.listTag = res.payload;
      }
    });
  }

  getSafeHtml(html: string = ""): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(html);
  }
}
