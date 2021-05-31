import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { LeavingComponent } from './leaving/leaving.component';

@NgModule({
    declarations: [BlogComponent, LeavingComponent],
    imports: [CommonModule, BlogRoutingModule, SharedModule],
})
export class BlogModule {}
