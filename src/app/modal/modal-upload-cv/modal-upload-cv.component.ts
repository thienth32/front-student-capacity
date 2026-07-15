import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { ActivatedRoute } from "@angular/router";
import { NgToastService } from "ng-angular-popup";
import { map, switchMap } from "rxjs";
import { Post } from "src/app/models/post.model";
import { ResponsePayload } from "src/app/models/response-payload";
import { ListPostService } from "src/app/services/list-post.service";
import { MajorService } from "src/app/services/major.service";
import { MatDialog } from "@angular/material/dialog";
import { DialogConfirmComponent } from "../dialog-confirm/dialog-confirm.component";
import { StudentStatusService } from "../../services/student-status.service";

@Component({
  selector: "app-modal-upload-cv",
  templateUrl: "./modal-upload-cv.component.html",
  styleUrls: ["./modal-upload-cv.component.css"],
})
export class ModalUploadCvComponent implements OnInit {
  postDetail: Post;
  validateForm!: FormGroup;
  statusRegister: boolean = true;
  statusLinkCv: boolean = false;
  fileUpload: any;

  majors: any[] = [];

  student_statuses: any[] = [];

  // set up form control
  formUploadCv = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(2)]),
    studentCode: new FormControl("", [Validators.required, Validators.pattern("[a-zA-Z0-9]{7}")]),
    email: new FormControl("", [Validators.required, Validators.email]),
    phone: new FormControl("", [Validators.required, Validators.pattern("[0-9]{10}")]),
    file_link: new FormControl(""),
    major_id: new FormControl("", [Validators.required]),
    student_status: new FormControl("0", [Validators.required]),
  });

  get name() {
    return this.formUploadCv.get("name");
  }

  get studentCode() {
    return this.formUploadCv.get("studentCode");
  }

  get email() {
    return this.formUploadCv.get("email");
  }

  get phone() {
    return this.formUploadCv.get("phone");
  }

  get file_link() {
    return this.formUploadCv.get("file_link");
  }

  get major_id() {
    return this.formUploadCv.get("major_id");
  }

  get student_status() {
    return this.formUploadCv.get("student_status");
  }

  constructor(
    public dialogRef: MatDialogRef<ModalUploadCvComponent>,
    private postService: ListPostService,
    private toast: NgToastService,
    private majorService: MajorService,
    private studentStatusService: StudentStatusService,
    public dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA)
    public dataPostDetail: { postDetail: Post },
  ) {
  }

  ngOnInit(): void {
    this.majorService.getAllForRecruitment().subscribe((res: ResponsePayload) => {
      this.majors = res.payload;
    });

    this.studentStatusService.getListStudentStatuses()
      .subscribe((res: ResponsePayload) => {
        this.student_statuses = res.payload;
        // formDataInput.append("student_status", dataInput.student_status);
        this.formUploadCv.patchValue({
          student_status: this.student_statuses[0].key,
        });
      });
  }

  closeDialog() {
    this.dialogRef.close("Pizza!");
  }

  // review file upload
  preview(files: any) {
    var errorLink = document.querySelector("#error-link");
    let countTrue: number = 0;
    const validFileExtensions = ["pdf"];
    validFileExtensions.forEach((ext) => {
      if (files[0].name.endsWith(ext)) {
        countTrue++;
      }
    });

    if (countTrue !== 0) {
      this.statusLinkCv = true;
      if (files.length === 0) return;
      this.fileUpload = files[0];
      errorLink?.classList.add("d-none");
    } else {
      errorLink?.classList.remove("d-none");
    }
  }

  //Send information Upload cv
  onSubmit() {
    this.statusRegister = false;
    let dataInput = { ...this.formUploadCv.value };
    var formDataInput = new FormData();

    formDataInput.append("name", dataInput.name);
    formDataInput.append("student_code", dataInput.studentCode);
    formDataInput.append("email", dataInput.email);
    formDataInput.append("phone", dataInput.phone);
    formDataInput.append("major_id", dataInput.major_id);
    formDataInput.append("student_status", dataInput.student_status);
    formDataInput.append("file_link", this.fileUpload);
    if (this.dataPostDetail.postDetail) formDataInput.append("post_id", this.dataPostDetail.postDetail.id);

    this.dialog.open(DialogConfirmComponent, {
      width: "500px",
      disableClose: true,
      data: {
        description:
          "Vui lòng không thoát ứng dụng.",
        isNotShowBtn: true,
        title: "Đang gửi thông tin ứng tuyển...",
        isShowLoading: true,
      },
    });

    setTimeout(() => {
      this.postService.uploadCV(formDataInput).subscribe((res: any) => {
        console.log(res);
        this.dialog.closeAll();
        let msg = "";
        let title = "";
        if (res.status == false) {
          title = "Cảnh báo";
          msg = res.message.file_link[0];
        } else {
          this.statusRegister = true;
          title = "Thông báo";
          msg = "Upload CV thành công!";
          this.dialogRef.close();
        }
        this.dialog.open(DialogConfirmComponent, {
          width: "500px",
          disableClose: false,
          data: {
            isNotShowBtnCancel: true,
            title: title,
            description: msg,
          },
        });
        return "Ok";
      });
    }, 1000);
  }

  confirmClose() {
    const confirm = window.confirm("Bạn có muốn hủy không?");
    if (confirm) {
      this.dialogRef.close();
    }
  }
}
