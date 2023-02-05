import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { animations } from 'src/app/core/constants/animations.constants';
import { Comment } from 'src/app/core/models/blog/comment.model';

@Component({
    selector: 'app-comment',
    templateUrl: './comment.component.html',
    styleUrls: ['./comment.component.scss'],
    animations: [animations.slide('create-comment-component')],
})
export class CommentComponent implements OnInit {
    @Input() parentId: string;
    @Input() postId: string;
    @Input() comment: Comment;
    @ViewChild('replyButton') replyButton: ElementRef;
    private commentsCollection: AngularFirestoreCollection<Comment>;
    childComments: Observable<Comment[]>;
    showCreateComment: boolean = false;

    constructor(private afs: AngularFirestore) {}

    ngOnInit(): void {
        this.commentsCollection = this.afs.collection<Comment>('comments-dev', (ref) =>
            ref.where('postId', '==', this.postId)
        );
        this.childComments = this.commentsCollection
            .valueChanges({ idField: 'fsId' })
            .pipe(
                map((comments) =>
                    comments.filter((comment) => comment.parentId === this.parentId && comment.parentId !== null)
                )
            );
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
