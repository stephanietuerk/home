import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import { Timestamp } from '@angular/fire/firestore';
import { Comment } from 'src/app/core/models/blog/comment.model';
import { EnvironmentService } from 'src/app/core/services/environment.service';

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
  @Output() closeEvent: EventEmitter<void> = new EventEmitter();
  private commentsCollection: AngularFirestoreCollection<Comment>;
  comment: comment = {
    content: '',
    userName: '',
  };
  d;

  constructor(
    private afs: AngularFirestore,
    private environmentService: EnvironmentService
  ) {}

  ngOnInit(): void {
    this.commentsCollection = this.afs.collection<Comment>(
      this.environmentService.currentEnvironment.comments
    );
  }

  onCancel(): void {
    this.closeEvent.emit(null);
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
