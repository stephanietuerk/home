import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
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
  childComments$: Observable<Comment[]>;
  showCreateComment = false;

  constructor(private firestore: AngularFirestore) {}

  ngOnInit(): void {
    this.childComments$ = this.getComments()
      .valueChanges({ idField: 'fsId' })
      .pipe(
        map((comments) =>
          comments.filter(
            (comment) =>
              comment.parentId === this.parentId && comment.parentId !== null
          )
        )
      );
  }

  getComments(): AngularFirestoreCollection<Comment> {
    return this.firestore.collection<Comment>('comments-dev', (ref) =>
      ref.where('postId', '==', this.postId)
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
