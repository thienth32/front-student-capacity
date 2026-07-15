import { Component, OnInit, Input } from '@angular/core';
import { QA } from 'src/app/models/qa.model';

@Component({
  selector: 'app-faq-item',
  templateUrl: './faq-item.component.html',
  styleUrls: ["./faq-item.component.css"],
})
export class FaqItemComponent implements OnInit {
  @Input() item!: QA;

  constructor() {}

  ngOnInit(): void {}
}
