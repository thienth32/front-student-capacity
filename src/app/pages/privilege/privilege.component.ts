import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigFunctionService } from 'src/app/services/config-function.service';
import { PrivilegeService } from 'src/app/services/privilege.service';

@Component({
  selector: 'app-privilege',
  templateUrl: './privilege.component.html',
  styleUrls: ['./privilege.component.css']
})
export class PrivilegeComponent implements OnInit {
  page: string = 'privilege';
  privileges: Array<any> = [];
  isLoading: boolean = true;
  selectedPrivilege: any = null;

  currentPage: string = '1';
  first_page_url: string;
  next_page_url: string;
  prev_page_url: string;
  last_page_url: string;
  last_page: string;
  links: any;

  constructor(
    private titleService: Title,
    private privilege: PrivilegeService,
    private router: Router,
    private configFunctionService: ConfigFunctionService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Đặc quyền sinh viên");
    this.configFunctionService.runTop();
    this.getPrivileges();
  }

  getPrivileges() {
    this.privilege.getPrivileges(this.currentPage).subscribe((res) => {
      if (res.status) {
        this.privileges = res.payload.data;
        this.isLoading = false;

        //data for paginate
        let totalItemPages = res.payload.links.length;
        this.first_page_url = res.payload.first_page_url;
        this.next_page_url = res.payload.next_page_url;
        this.prev_page_url = res.payload.prev_page_url;
        this.last_page_url = res.payload.last_page_url;
        this.last_page = res.payload.last_page;
        this.links = res.payload.links.slice(1, totalItemPages - 1);
      }
    })
  }

  paginationPages(url: string, active: boolean, pageNumber: string, event: any) {
    if (pageNumber == "...") {
        //không xử lý
    } else {
        this.privileges = [];
        this.isLoading = true;
        let listTab = document.querySelectorAll(".pagination-item");
        for (let i = 0; i < listTab.length; i++) {
            listTab[i]?.classList.remove("active");
        }
        event.currentTarget.classList.add("active");
        this.router.navigate(["/dac-quyen-sinh-vien"], {
            queryParams: {
                page: pageNumber,
            },
            queryParamsHandling: "merge",
        });
        this.currentPage = pageNumber;
        this.getPrivileges();
    }
  }

  openPrivilegeModal(item: any) {
    this.selectedPrivilege = item;
  }

  openUrl(url: string) {
    window.open(url, '_blank');
  }
}
