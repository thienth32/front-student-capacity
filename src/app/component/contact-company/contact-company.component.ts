import { NgToastService } from "ng-angular-popup";
import { FormControl, FormGroup } from "@angular/forms";
import { Component, OnInit } from "@angular/core";
import { ContactCompanyService } from "src/app/services/contact-company.service";
import { Router } from "@angular/router";
import { Title } from "@angular/platform-browser";

@Component({
  selector: 'app-contact-company',
  templateUrl: './contact-company.component.html',
  styleUrls: ['./contact-company.component.css']
})
export class ContactCompanyComponent implements OnInit {
  formContact!: FormGroup;
  isContact = false;

  constructor(
    private ContactCompanyService: ContactCompanyService,
    private router: Router,
    private toastService: NgToastService,
    private titleService: Title,
  ) { }

  ngOnInit(): void {
    this.formContact = new FormGroup({
      fullname: new FormControl(""),
      companyname: new FormControl(""),
      email: new FormControl(""),
      phone: new FormControl(""),
    });

  }


  handleSubmitCompany(){

    const { fullname,companyname,email,phone } = this.formContact.value;
    if (!fullname.trim()) {
      return this.toastService.info({ summary: "Vui lòng nhập Họ và Tên", detail: "Thông báo" });
    }

    if (!companyname.trim()) {
      return this.toastService.info({ summary: "Vui lòng nhập Tên công ty", detail: "Thông báo" });
    }

    if (!email.trim()) {
      return this.toastService.info({ summary: "Vui lòng nhập email", detail: "Thông báo" });
    }

    if (!phone.trim()) {
      return this.toastService.info({ summary: "Vui lòng nhập Số điện thoại", detail: "Thông báo" });
    }


    this.isContact = true;
    
    this.ContactCompanyService.contactAddCompany({
      "fullName" :  fullname,
      "companyName" : companyname,
      "email" : email,
      "phone" : phone
    }).subscribe(
      (res: any) => {
        console.log(res);
        if(!res.status){
          if (res && res.message) {
            // Xử lý các thông báo lỗi
            Object.keys(res.message).forEach(key => {
              const errorMessage = res.message[key][0]; // Lấy thông báo đầu tiên cho mỗi trường
              this.toastService.warning({ 
                summary: errorMessage, 
                duration: 2000, 
                detail: `Lỗi: ${key}` 
              });
            });
          } else {
            // Nếu không có cấu trúc lỗi cụ thể, hiển thị thông báo lỗi chung
            this.toastService.warning({ 
              summary: 'Đã xảy ra lỗi', 
              duration: 2000, 
              detail: "Cảnh báo" 
            });
          }
          this.isContact = false;
        }else {
          this.toastService.success({ 
            summary: `${res.payload}`, 
            duration: 2000, 
            detail: "Thành Công" 
          });
          this.formContact.reset();
          this.isContact = false;
        }
      },
    );

    
  }

}
