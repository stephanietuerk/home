import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { animations } from 'src/app/core/constants/animations.constants';
import { Comment } from 'src/app/core/models/blog/comment.model';
import { EnvironmentService } from 'src/app/core/services/environment.service';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss'],
    animations: [animations.slide('create-comment-component')],
})
export class CommentsComponent implements OnInit {
    @ViewChild('leaveButton') leaveButton: ElementRef;
    private commentsCollection: AngularFirestoreCollection<Comment>;
    nestedComments: Comment[];
    postId: string;
    showCreateComment: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private afs: AngularFirestore,
        private environmentService: EnvironmentService
    ) {}

    ngOnInit(): void {
        this.route.url.subscribe((url) => {
            this.postId = url[0].path;
        });
        this.commentsCollection = this.afs.collection<Comment>(
            this.environmentService.environmentSettings.comments,
            (ref) => ref.where('postId', '==', this.postId)
        );
        this.commentsCollection.valueChanges({ idField: 'fsId' }).subscribe((comments) => {
            this.createdNestedComments(comments);
        });
    }

    createdNestedComments(comments: Comment[]) {
        const parents = comments.filter((comment) => comment.parentId === null);
        this.nestedComments = this.nestComments(comments, parents);
    }

    nestComments(all: Comment[], parents: Comment[]) {
        for (let i = 0; i < parents.length; i++) {
            const parent = parents[i];
            const children = all.filter((comment) => comment.parentId === parent.fsId);
            parent.replies = children;
            if (children.length > 0) {
                this.nestComments(all, children);
            }
        }
        return parents;
    }

    onLeaveCommentClick(): void {
        this.showCreateComment = true;
        this.leaveButton.nativeElement.disabled = true;
    }

    onCloseComment(): void {
        this.leaveButton.nativeElement.disabled = false;
        this.showCreateComment = false;
    }
}
