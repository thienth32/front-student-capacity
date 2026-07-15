import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { ServiceService } from 'src/app/services/service.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.css']
})
export class ServiceComponent implements OnInit {
  page: string = 'service';
  services: Array<any> = [];
  selectedService: any = null;
  isLoading: boolean = true;

  constructor(
    private titleService: Title,
    private service: ServiceService,
    private router: Router,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.titleService.setTitle('Dịch vụ việc làm');
    this.getServices();
  }

  getServices() {
    this.service.getListService().subscribe(res => {
      if (res.status) {
        this.services = res.payload;
        this.isLoading = false;
      }
    })
  }

  openModal(service:any) {
    this.selectedService = service;
  }

  closeModal() {
    this.selectedService = null;
  }

  openUrl(url: string) {
    window.open(url, '_blank');
  }
}
