import { NgModule } from '@angular/core';
import { getAnalytics, provideAnalytics } from '@angular/fire/analytics';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { environment } from 'src/environments/environment';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { RoutingModule } from './routing.module';
import { SharedModule } from './shared/shared.module';
@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        RoutingModule,
        CoreModule,
        SharedModule,
        provideFirebaseApp(() => initializeApp(environment.firebase)),
        provideFirestore(() => getFirestore()),
        provideAnalytics(() => getAnalytics()),
    ],
    providers: [],
    declarations: [AppComponent],
    bootstrap: [AppComponent],
})
export class AppModule {}
