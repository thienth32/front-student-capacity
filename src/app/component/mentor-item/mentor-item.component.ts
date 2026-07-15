import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-mentor-item',
  templateUrl: './mentor-item.component.html',
  styleUrls: ['./mentor-item.component.css']
})
export class MentorItemComponent implements OnInit {

  @Input() mentor: any;
  constructor() { }

  ngOnInit(): void {
  }

}
