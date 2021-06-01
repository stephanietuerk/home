import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { PipesModule } from '../core/pipes/pipes.module';
import { SharedModule } from '../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { LeavingComponent } from './leaving/leaving.component';
import { QuestionComponent } from './leaving/question/question.component';

@NgModule({
    declarations: [BlogComponent, LeavingComponent, QuestionComponent],
    imports: [CommonModule, BlogRoutingModule, SharedModule, PipesModule],
})
export class BlogModule {}
