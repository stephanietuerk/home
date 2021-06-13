import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { animations } from 'src/app/core/constants/animations.constants';
import { CommentsService } from 'src/app/core/services/comments.service';

@Component({
    selector: 'app-comments',
    templateUrl: './comments.component.html',
    styleUrls: ['./comments.component.scss'],
    animations: [animations.slide('create-comment-component')],
})
export class CommentsComponent implements OnInit {
    @ViewChild('leaveButton') leaveButton: ElementRef;
    postId: string;
    showCreateComment: boolean = false;

    constructor(private route: ActivatedRoute, public commentsService: CommentsService) {}

    ngOnInit(): void {
        this.route.url.subscribe((url) => {
            this.postId = url[0].path;
        });
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
