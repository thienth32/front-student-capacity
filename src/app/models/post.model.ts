import { User } from "./user";

export class Post {
    id?: any;
    thumbnail_url: string
    slug?: string
    title: string;
    user: User;
    published_at: Date;
    description: string;
    content: string;
    postable_type: string;
    postable?: any;
    user_wishlist: boolean;
    view : number;
    deadline?: Date;
    enterprise?: any;
    major?: any;
}
