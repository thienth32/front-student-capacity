import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgToastService } from 'ng-angular-popup';
import { QAService } from 'src/app/services/qa.service';

@Component({
  selector: 'app-modal-down-rate',
  templateUrl: './modal-down-rate.component.html',
  styleUrls: ['./modal-down-rate.component.css']
})
export class ModalDownRateComponent {
  validateForm!: FormGroup;
  id: Number;

  downRateForm = new FormGroup({
    content: new FormControl("", [Validators.required, Validators.minLength(10)]),
  })

  get content() {
    return this.downRateForm.get("content");
  }

  constructor(
    public dialogRef: MatDialogRef<ModalDownRateComponent>,
    private qaService: QAService,
    private toastService: NgToastService,
    @Inject(MAT_DIALOG_DATA)
    public faqId: { id: Number },
  ) {
    console.log(this.faqId);
  }

  onSubmit() {
    let dataInput = { ...this.downRateForm.value };
    var formDataInput = new FormData();
    formDataInput.append("content", dataInput.content);
    
    this.qaService.rating(this.faqId.id, {
      "type": 0,
      "content": this.content?.value
    }).subscribe((res: any) => {
      if (!res.status) {
        // Nếu không có cấu trúc lỗi cụ thể, hiển thị thông báo lỗi chung
        this.toastService.warning({ 
          summary: 'Đã xảy ra lỗi', 
          duration: 2000, 
          detail: "Cảnh báo" 
        });
      } else {
        this.toastService.success({ 
          summary: `${res.payload}`, 
          duration: 2000, 
          detail: "Thành Công" 
        });
      }
    })
  }
  
  confirmClose() {
    const confirm = window.confirm("Bạn có muốn hủy không?");
    if (confirm) {
      this.dialogRef.close();
    }
  }
}
