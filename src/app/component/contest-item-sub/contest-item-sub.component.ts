import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Contest } from 'src/app/models/contest';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-contest-item-sub',
  templateUrl: './contest-item-sub.component.html',
  styleUrls: ['./contest-item-sub.component.css']
})
export class ContestItemSubComponent implements OnInit {
  @Input() contestItem: Contest;
  date_end : number;
  date_start : number;
  date_register_start : number;
  date_register_end : number;
  today : number;
  disabled: boolean = true;

  days: number;
  hours: number;
  minutes: number;
  seconds: number;

  constructor() { }

  ngOnInit(): void {
     
      this.date_start = new Date(moment(this.contestItem.register_deadline).format('lll')).getTime();
      this.date_register_start = new Date(moment(this.contestItem.start_register_time).format('lll')).getTime();
      this.date_register_end = new Date(moment(this.contestItem.end_register_time).format('lll')).getTime();
     
    
      setInterval(() => {
        this.date_end = new Date(moment(this.contestItem.date_start).format('lll')).getTime();
        this.today = new Date().getTime();
        let distance =  this.date_register_end - this.today;
        this.date_register_start > this.today ? this.disabled = false : this.disabled;
      
        if (distance < 0 || this.contestItem.status == 2 || this.date_register_start > this.today) {
          this.days = 0;
          this.hours = 0;
          this.minutes = 0;
          this.seconds = 0;
        } else {
          this.days = Math.floor(distance / (1000 * 60 * 60 * 24));
          this.hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
          this.minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
          this.seconds = Math.floor((distance % (1000 * 60)) / 1000);
        }
      }, 1000);
  }


  checkStatusContest(item: Contest): any {
    let result;
    let status;
    if (item.status <= 1) {
      if(this.date_register_start > this.today){
        result = 'Sắp diễn ra';
      }else if(this.date_register_end > this.today){
        result = 'Đang mở đăng ký';
      }else if(this.date_start > this.today){
        result = 'Đã đóng đăng ký';
      }else if(this.date_end > this.today){
        result = 'Đang diễn ra';
      }else{
        result = 'Đã diễn ra';
      }
    } else {
      result = 'Đã kết thúc';
    }
    return result;
  }
}