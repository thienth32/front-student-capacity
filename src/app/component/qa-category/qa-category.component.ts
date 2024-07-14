import { Component, Input, OnInit } from '@angular/core';
import { QA } from 'src/app/models/qa.model';
import { QAService } from 'src/app/services/qa.service';


@Component({
  selector: 'app-qa-category',
  templateUrl: './qa-category.component.html',
  styleUrls: ['./qa-category.component.css'],
})

export class QACategoryComponent implements OnInit {
  @Input() categories: Array<any>;

  constructor() { }
  ngOnInit(): void {

  }
}
