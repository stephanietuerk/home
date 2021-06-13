import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Comment } from '../models/blog/comment.model';

@Injectable({
    providedIn: 'root',
})
export class CommentsService {
    private commentsCollection: AngularFirestoreCollection<Comment>;
    comments: Observable<Comment[]>;

    constructor(private firestore: AngularFirestore) {
        this.commentsCollection = firestore.collection<Comment>('comments');
        this.comments = this.commentsCollection.valueChanges({ idField: 'fsId' });
    }

    add(comment: Comment): void {
        this.commentsCollection.add(comment);
    }
}
