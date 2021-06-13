import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import firebase from 'firebase/app';
import { Comment } from 'src/app/core/models/blog/comment.model';
import { environment } from 'src/environments/environment';
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
    private commentsCollection: AngularFirestoreCollection<Comment>;
    comment: comment = {
        content: '',
        userName: '',
    };

    constructor(private afs: AngularFirestore) {
        this.commentsCollection = this.afs.collection<Comment>(environment.commentsCollection);
    }

    ngOnInit(): void {}

    onCancel(): void {
        this.close.emit(null);
    }

    onSubmit(): void {
        const comment: Comment = {
            postId: this.postId,
            parentId: this.parentId ? this.parentId : null,
            userName: this.comment.userName,
            content: this.comment.content,
            date: Timestamp.fromDate(new Date()),
        };
        this.addComment(comment);
    }

    addComment(comment: Comment) {
        this.commentsCollection.add(comment);
    }
}
