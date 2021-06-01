import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RoutingModule } from './routing.module';
import { CoreModule } from './core/core.module';
import { SharedModule } from './shared/shared.module';
@NgModule({
    imports: [BrowserModule, BrowserAnimationsModule, RoutingModule, CoreModule, SharedModule],
    providers: [],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
