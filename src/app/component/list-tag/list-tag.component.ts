import { Component, Input, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Keyword } from "src/app/models/keyword";

@Component({
  selector: "app-list-tag",
  templateUrl: "./list-tag.component.html",
  styleUrls: ["./list-tag.component.css"],
})
export class ListTagComponent implements OnInit {
  @Input() tags: Array<any>;
  constructor(private router: Router) {}

  ngOnInit(): void {
    // var numberCheck = Math.ceil(Math.random() * 5);

    const array = new Uint32Array(1);
    window.crypto.getRandomValues(array);
    var numberCheck = Math.ceil(array[0] / (Math.pow(2, 32) + 1) * 5);

    if (numberCheck % 2 == 0) {
      this.tags = this.tags.reverse();
    }
    this.tags = this.tags.slice(numberCheck);
  }

  // Chuyển hưỡng tag trến trang tìm kiếm
  redirectTagname(tagName: string) {
    this.router.navigateByUrl(`/tim-kiem/bai-viet?keyword=${tagName}`);
  }
}
