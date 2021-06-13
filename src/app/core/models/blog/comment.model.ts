export class Comment {
    postId: string;
    userName: string = 'User Name';
    content: string;
    date: any;
    fsId?: string;
    parentId?: string;
    reply?: Comment;
}
