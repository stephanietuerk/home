export class Comment {
    postId: string;
    parentId: string | null;
    userName: string = 'User Name';
    content: string;
    date: any;
    fsId?: string;
    replies?: Comment[];
}
