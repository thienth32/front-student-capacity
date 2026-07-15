import { Component, Input, OnInit } from '@angular/core';
import { Enterprise } from 'src/app/models/enterprise.model';

@Component({
  selector: 'app-enterprise-item',
  templateUrl: './enterprise-item.component.html',
  styleUrls: ['./enterprise-item.component.css']
})
export class EnterpriseItemComponent implements OnInit {

  @Input() enterprise!:Enterprise;
  constructor() { }

  ngOnInit(): void {
  }

}
