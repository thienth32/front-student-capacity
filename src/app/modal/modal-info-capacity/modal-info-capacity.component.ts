import { Component, Inject, OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { NgToastService } from "ng-angular-popup";
import { ResponsePayload } from "../../models/response-payload";
import { DialogConfirmComponent } from "../dialog-confirm/dialog-confirm.component";
import { UserService } from "../../services/user.service";

@Component({
  selector: "app-modal-info-capacity",
  templateUrl: "./modal-info-capacity.component.html",
  styleUrls: ["./modal-info-capacity.component.css"],
})
export class ModalInfoCapacityComponent implements OnInit {

  validateForm!: FormGroup;
  statusRegister: boolean = true;

  dataReturn: any = null;

  // set up form control
  formRegisterUser = new FormGroup({
    name: new FormControl("", [Validators.required, Validators.minLength(2)]),
    email: new FormControl("", [Validators.required, Validators.email]),
  });

  get name() {
    return this.formRegisterUser.get("name");
  }

  get email() {
    return this.formRegisterUser.get("email");
  }

  constructor(
    public dialogRef: MatDialogRef<ModalInfoCapacityComponent>,
    private userService: UserService,
    private toast: NgToastService,
    public dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {

  }

  // review file upload

  //Send information Upload cv
  onSubmit() {
    this.statusRegister = false;
    let dataInput = { ...this.formRegisterUser.value };
    var formDataInput = new FormData();

    this.dialogRef.close(this.formRegisterUser.value);

    return "Ok";
  }

  confirmClose() {
    const confirm = window.confirm("Bạn có muốn hủy không?");
    if (confirm) {
      this.dialogRef.close();
    }
  }

}
