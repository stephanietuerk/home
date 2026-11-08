import { Timestamp } from '@angular/fire/firestore';

export class Comment {
  postId: string;
  parentId: string | null;
  userName = 'User Name';
  content: string;
  date: Timestamp;
  fsId?: string;
  replies?: Comment[];
}
