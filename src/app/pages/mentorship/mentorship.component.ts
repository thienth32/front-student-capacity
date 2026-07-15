import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfigFunctionService } from 'src/app/services/config-function.service';
import { MentorService } from 'src/app/services/mentor.service';

@Component({
  selector: 'app-mentorship',
  templateUrl: './mentorship.component.html',
  styleUrls: ['./mentorship.component.css']
})
export class MentorshipComponent implements OnInit {
  page: string = 'mentor';
  isLoading: boolean = true;
  mentors: Array<any> = [];

  currentPage: string = '1';
  first_page_url: string;
  next_page_url: string;
  prev_page_url: string;
  last_page_url: string;
  last_page: string;
  links: any;

  constructor(
    private titleService: Title,
    private mService: MentorService,
    private router: Router,
    private configFunctionService: ConfigFunctionService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Mentorship');
    // this.configFunctionService.runTop();
    this.getMentors();
  }

  getMentors() {
    this.mService.getListMentor(this.currentPage).subscribe(res => {
      if (res.status) {
        this.mentors = res.payload.data;
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
        this.mentors = [];
        this.isLoading = true;
        let listTab = document.querySelectorAll(".pagination-item");
        for (let i = 0; i < listTab.length; i++) {
            listTab[i]?.classList.remove("active");
        }
        event.currentTarget.classList.add("active");
        this.router.navigate(["/chuong-trinh-mentor"], {
            queryParams: {
                page: pageNumber,
            },
            queryParamsHandling: "merge",
        });
        this.currentPage = pageNumber;
        this.getMentors();
    }
  }
}
