import { Component, Input, OnInit } from '@angular/core';
import { Slider } from 'src/app/models/slider.model';
import { SliderService } from 'src/app/services/slider.service';
@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css'],
})
export class BannerComponent implements OnInit {
  @Input() page: string;
  banner: Array<Slider> = [];
  bannerStatus: boolean = false;

  constructor(private sliderService: SliderService) {
  }

  ngOnInit(): void {
    this.sliderService.getListSlider(this.page,'', '').subscribe(res => {
      if (res.status) {
        this.banner = res.payload;
        this.banner ? this.bannerStatus = true : this.bannerStatus;
      }
    });
  }
}
