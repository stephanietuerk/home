import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { animations } from 'src/app/core/constants/animations.constants';
import { Comment } from 'src/app/core/models/blog/comment.model';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss'],
    animations: [animations.slide('create-comment-component')],
})
export class CommentComponent implements OnInit {
    @Input() parentComment: Comment;
    @Input() postId: string;
    @Input() comment: Comment;
    @ViewChild('replyButton') replyButton: ElementRef;
    showCreateComment: boolean = false;

    constructor() {}

    ngOnInit(): void {
        console.log(this.comment);
    }

    onReply(): void {
        this.showCreateComment = true;
        this.replyButton.nativeElement.disabled = true;
    }

    onCloseComment(): void {
        this.showCreateComment = false;
        this.replyButton.nativeElement.disabled = false;
    }
}
