import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../core/pipes/pipes.module';
import { CommentsService } from '../core/services/comments.service';
import { SharedModule } from '../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { CommentComponent } from './comments/comment/comment.component';
import { CommentsComponent } from './comments/comments.component';
import { CreateCommentComponent } from './comments/create-comment/create-comment.component';
import { LeavingComponent } from './leaving/leaving.component';
import { QuestionComponent } from './leaving/question/question.component';
import { ResponsiveVizComponent } from './responsive-viz/responsive-viz.component';

@NgModule({
    declarations: [
        BlogComponent,
        LeavingComponent,
        QuestionComponent,
        CommentComponent,
        CommentsComponent,
        CreateCommentComponent,
        ResponsiveVizComponent,
    ],
    providers: [CommentsService],
    imports: [CommonModule, BlogRoutingModule, SharedModule, PipesModule, FormsModule],
})
export class BlogModule {}
