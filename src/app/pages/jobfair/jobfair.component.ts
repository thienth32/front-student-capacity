import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { JobfairService } from 'src/app/services/jobfair.service';

@Component({
  selector: 'app-jobfair',
  templateUrl: './jobfair.component.html',
  styleUrls: ['./jobfair.component.css']
})
export class JobfairComponent implements OnInit {
  page: string = 'event';
  jobfair: any;
  posts: Array<any> = [];
  sponsorCount: number;
  host: Array<any> = []; //đơn vị tổ chức
  sponsors: Array<any> = []; //đơn vị tài trợ kim cương, vàng, bạc
  participants: Array<any> = []; //đơn vị tham gia
  stats: Array<any> = [];
  isLoading: boolean = true;
  slider = {
    slidesToShow: 3,
    infinite: true,
    autoplay: true,
    arrows: true,
    slidesToScroll: 1,
    speed: 1000,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 749,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  constructor(
    private jobfairService: JobfairService,
    private titleService: Title
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Ngày hội việc làm');
    this.getJobfair();
  }

  getJobfair() {
    this.jobfairService.getLastestJobfair().subscribe(res => {
      if (res.status) {
        this.jobfair = res.payload;
        this.sponsorCount = this.jobfair.sponsors.length;
        this.host = this.jobfair.sponsors.filter((sponsor:any) => sponsor.priority == 0);
        this.sponsors = this.jobfair.sponsors.filter((sponsor:any) => [2,3,4].includes(sponsor.priority));
        this.participants = this.jobfair.sponsors.filter((sponsor:any) => sponsor.priority == 1);
        console.log(this.sponsors);
        this.posts = this.jobfair.posts;
        this.stats = [
          {
            name: 'doanh nghiệp tham gia',
            value: this.sponsorCount,
            unit: 'doanh nghiệp tham gia',
          },
          {
            name: 'lượt phỏng vấn',
            value: this.jobfair.interview_count,
            unit: 'lượt phỏng vấn',
          },
          {
            name: 'vị trí tuyển dụng',
            value: this.jobfair.jobs_opening_count,
            unit: 'vị trí tuyển dụng',
          }
        ];
        this.isLoading = false;
      }
    })
  }

  openUrl() {
    window.open(this.jobfair.register_link, '_blank');
  }
}
