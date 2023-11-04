import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/compat/firestore';
import firebase from 'firebase/compat/app';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Comment } from '../models/blog/comment.model';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  private commentsCollection: AngularFirestoreCollection<Comment>;
  comments$: Observable<Comment[]>;
  postFilter$: BehaviorSubject<string | null> = new BehaviorSubject(null);
  postFilter = this.postFilter$.asObservable();
  topLevelFilter$: BehaviorSubject<null> = new BehaviorSubject(null);
  topLevelFilter = this.topLevelFilter$.asObservable();

  constructor(private firestore: AngularFirestore) {
    this.init();
  }

  init(): void {
    this.commentsCollection =
      this.firestore.collection<Comment>('comments-dev');
    this.topLevelFilter$ = new BehaviorSubject(null);
    this.comments$ = combineLatest([
      this.postFilter$,
      this.topLevelFilter$,
    ]).pipe(
      switchMap(([postId, parentId]) =>
        this.firestore
          .collection<Comment>('comments-dev', (ref) => {
            let query:
              | firebase.firestore.CollectionReference
              | firebase.firestore.Query = ref;
            if (postId) {
              query = query.where('postId', '==', postId);
            }
            if (parentId) {
              query = query.where('parentId', '==', null);
            }
            return query;
          })
          .valueChanges({ idField: 'fsId' })
      )
    );
  }

  getCommentsForPost(postId: string | null) {
    this.postFilter$.next(postId);
  }

  getTopLevelComments() {
    this.topLevelFilter$.next(null);
  }

  add(comment: Comment): void {
    this.commentsCollection.add(comment);
  }
}
