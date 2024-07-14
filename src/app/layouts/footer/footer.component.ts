import { Component, OnInit } from "@angular/core";
import { BranchService } from "src/app/services/branch.service";
import { Branch } from "src/app/models/branch.model";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-footer",
  templateUrl: "./footer.component.html",
  styleUrls: ["./footer.component.css"],
})
export class FooterComponent implements OnInit {

  branches!: Branch[];

  groupBranches: Branch[][] = [];

  constructor(
    private branchService: BranchService,
  ) {
  }

  ngOnInit(): void {
    this.getAllBranches();
  }

  getAllBranches() {
    this.branchService.getAll().subscribe((res) => {
      if (res.status) {
        this.branches = res.payload;
        for (let i = 0; i < this.branches.length; i += 3) {
          this.groupBranches.push(this.branches.slice(i, i + 3));
        }
      }
    });
  }

}
