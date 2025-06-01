import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentsService } from '../core/services/comments.service';
import { LeavingComponent } from '../projects/leaving/leaving.component';
import { QuestionComponent } from '../projects/leaving/question/question.component';
import { SharedModule } from '../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { CommentComponent } from './comments/comment/comment.component';
import { CommentsComponent } from './comments/comments.component';

@NgModule({
  declarations: [BlogComponent, LeavingComponent, QuestionComponent],
  providers: [CommentsService],
  imports: [CommonModule, BlogRoutingModule, SharedModule, FormsModule],
  exports: [CommentsComponent, CommentComponent],
})
export class BlogModule {}
