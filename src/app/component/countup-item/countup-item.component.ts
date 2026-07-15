import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-countup-item',
  templateUrl: './countup-item.component.html',
  styleUrls: ['./countup-item.component.css']
})
export class CountupItemComponent implements OnInit {

  @Input() stats: Array<any>;
  constructor() { }

  ngOnInit(): void {
  }

}
