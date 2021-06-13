import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import firebase from 'firebase/app';
import { Comment } from 'src/app/core/models/blog/comment.model';
import { CommentsService } from 'src/app/core/services/comments.service';
import Timestamp = firebase.firestore.Timestamp;

export interface comment {
    userName: string;
    content: string;
}

@Component({
    selector: 'app-create-comment',
    templateUrl: './create-comment.component.html',
    styleUrls: ['./create-comment.component.scss'],
})
export class CreateCommentComponent implements OnInit {
    @Input() postId: string;
    @Input() parentId: string;
    @Output() close: EventEmitter<any> = new EventEmitter();
    comment: comment = {
        content: 'Your comment',
        userName: '',
    };

    constructor(private commentsService: CommentsService) {}

    ngOnInit(): void {}

    onCancel(): void {
        this.close.emit(null);
    }

    onSubmit(): void {
        const comment: Comment = {
            postId: this.postId,
            userName: this.comment.userName,
            content: this.comment.content,
            date: Timestamp.fromDate(new Date()),
        };
        if (this.parentId) {
            comment.parentId = this.parentId;
        }
        this.addComment(comment);
    }

    addComment(comment: Comment) {
        this.commentsService.add(comment);
    }
}
