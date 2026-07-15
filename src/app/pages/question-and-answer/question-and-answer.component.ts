import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Title } from "@angular/platform-browser";
import { ActivatedRoute, Router } from "@angular/router";
import { QaCategory } from "src/app/models/qa-category.model";
import { ConfigFunctionService } from "src/app/services/config-function.service";
import { QAService } from "src/app/services/qa.service";

@Component({
    selector: "app-question-and-answer",
    templateUrl: "./question-and-answer.component.html",
    styleUrls: [
        "./question-and-answer.component.css",
    ],
})


export class QuestionAndAnswerComponent implements OnInit {
    faqs: Array<any> = [];
    categories: Array<any> = [];
    filterObj: any;
    keyword: any;
    categoryId: any;
    statusFaq: boolean = false;
    statusCategory: boolean = false;
    statusSubmit: boolean = false;
    currCate: QaCategory;

    currentPage: string = '1';
    first_page_url: string;
    next_page_url: string;
    prev_page_url: string;
    last_page_url: string;
    last_page: string;
    links: any;

    constructor(
        private titleService: Title,
        private qaService: QAService,
        private router: Router,
        private location: Location,
        private route: ActivatedRoute,
        private configFunctionService: ConfigFunctionService
    ) { }

    formFilter = new FormGroup({
        filterName: new FormControl(""),
    })

    ngOnInit() {
        this.titleService.setTitle("Hỏi đáp");
        this.configFunctionService.runTop();
        this.getFaqCategories();
        this.route.queryParamMap.subscribe((params) => {
            this.filterObj = { ...params };
        });

        if (this.filterObj.params) {
            this.keyword = this.filterObj.params.keyword ?? "";
            this.categoryId = this.filterObj.params.categoryId ?? "";
            this.formFilter.controls["filterName"].setValue(this.keyword);
        } 
        
        this.filterFaq();

    }
    
    getFaqCategories() {
        this.qaService.getListCategory().subscribe(res => {
            if (res.status) {
                this.statusCategory = true;
                this.categories = res.payload;
                this.currCate = this.categories[0];
                this.categoryId = this.currCate.id;
                this.filterFaq();
            }
        })
    }

    searchFaq() {
        this.statusFaq = false;
        this.keyword = this.formFilter.controls['filterName'].value;
        this.filterFaq();
    }

    seeDetail(id: any) {
        this.router.navigate([`/hoi-dap/${id}`])
    }

    setValueKeyword($event: any) {
        this.formFilter.controls["filterName"].setValue($event.target.value);
        this.checkBtnSubmit();
    }

    setValueFilterCategory($event: any) {
        this.statusSubmit = true;
        this.formFilter.controls["filterCategory"].setValue($event.target.value);
    }
    
    checkBtnSubmit() {
        if (
            this.formFilter.controls["filterCategory"].value ||
            this.formFilter.controls["filterName"].value
        ) {
            this.statusSubmit = true;
        } else {
            this.statusSubmit = false;
        }
    }
    
    updateCategoryFaq(event: any, category: QaCategory) {
        if (this.statusFaq) {
            this.currCate = category;
            const rootCates = document.querySelectorAll(".faq__nav-item");
            rootCates.forEach((element) => {
                element.classList.remove("active");
            })
            this.categoryId = category.id
            this.filterFaq();
            event.currentTarget.classList.add("active");
        }
    }

    getByChildCate(event: any, item: QaCategory) {
        const childCates = document.querySelectorAll(".faq__content-aside-category--item");
        childCates.forEach((element) => {
            element.classList.remove("active");
        });

        this.categoryId = item.id 
        event.currentTarget.classList.add("active");
        this.filterFaq();
    }

    filterFaq() {
        this.statusFaq = false;
        if (this.keyword || this.categoryId) {
            this.router.navigate(["/hoi-dap"], {
                queryParams: {
                    keyword: this.keyword,
                    categoryId: this.categoryId,
                    page: this.currentPage,
                },
                queryParamsHandling: "merge",
            });
        }
        
        this.qaService.filterFaq(this.keyword, this.categoryId, this.currentPage).subscribe((res) => {
            if (res.status) {
                this.faqs = res.payload.data;
                this.statusFaq = true;

                //data for paginate
                let totalItemPages = res.payload.links.length;
                this.first_page_url = res.payload.first_page_url;
                this.next_page_url = res.payload.next_page_url;
                this.prev_page_url = res.payload.prev_page_url;
                this.last_page_url = res.payload.last_page_url;
                this.last_page = res.payload.last_page;
                this.links = res.payload.links.slice(1, totalItemPages - 1);
            }
        })
    }

    paginationPages(url: string, active: boolean, pageNumber: string, event: any) {
        if (pageNumber == "...") {
            //không xử lý
        } else {
            this.faqs = [];
            this.statusFaq = false;
            let listTab = document.querySelectorAll(".pagination-item");
            for (let i = 0; i < listTab.length; i++) {
                listTab[i]?.classList.remove("active");
            }
            event.currentTarget.classList.add("active");
            this.router.navigate(["/hoi-dap"], {
                queryParams: {
                    keyword: this.keyword,
                    categoryId: this.categoryId,
                    page: pageNumber,
                },
                queryParamsHandling: "merge",
            });
            this.currentPage = pageNumber;
            this.filterFaq();
        }
    }
}
