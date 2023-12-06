import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PipesModule } from '../core/pipes/pipes.module';
import { CommentsService } from '../core/services/comments.service';
import { SharedModule } from '../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { LeavingComponent } from './leaving/leaving.component';
import { QuestionComponent } from './leaving/question/question.component';

@NgModule({
  declarations: [BlogComponent, LeavingComponent, QuestionComponent],
  providers: [CommentsService],
  imports: [
    CommonModule,
    BlogRoutingModule,
    SharedModule,
    PipesModule,
    FormsModule,
  ],
})
export class BlogModule {}
