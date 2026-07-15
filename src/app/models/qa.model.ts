import { QaCategory } from "./qa-category.model";

class QAItem {
    question: string;
    answer: string;
}

export class QA {
    id?: any;
    question: string;
    answer: string;
    view: number;
    listItems: QAItem[];
    category?: QaCategory;
    created_at?: Date; 
}
