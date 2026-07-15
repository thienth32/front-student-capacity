import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { arrow } from '@popperjs/core';
import { ConfigFunctionService } from 'src/app/services/config-function.service';
import { MentorService } from 'src/app/services/mentor.service';
import { ProjectService } from 'src/app/services/project.service';

@Component({
  selector: 'app-startup',
  templateUrl: './startup.component.html',
  styleUrls: ['./startup.component.css']
})
export class StartupComponent implements OnInit {

  page: string = 'project';
  projects: Array<any> = [];
  mentors: Array<any> = [];
  mentorLoading: boolean = true;
  projectLoading: boolean = true;
  selectedProject: any = null;

  slider = {
    slidesToShow: 3,
    infinite: true,
    autoplay: true,
    arrows: false,
    slidesToScroll: 1,
    // fadeSpeed: 500,
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
    private titleService: Title,
    private mentor: MentorService,
    private project: ProjectService,
    private configFunctionService: ConfigFunctionService
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle("Vườn ươm khởi nghiệp");
    this.configFunctionService.runTop();
    this.getMentors();
    this.getProjects(); 
  }

  getMentors() {
    this.mentor.getListMentor('1').subscribe(res => {
      if (res.status) {
        this.mentors = res.payload.data;
        this.mentorLoading = false;
      }
    })
  }

  getProjects() {
    this.project.getProjects().subscribe(res => {
      if (res.status) {
        this.projects = res.payload.data;
        this.projectLoading = false;
      }
    })
  }

  openModal(project:any) {
    this.selectedProject = project;
  }

  closeModal() {
    this.selectedProject = null;
  }
}
