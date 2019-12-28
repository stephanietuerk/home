import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AboutComponent } from "./landing/about/about.component";
import { LandingPageComponent } from "./landing/landing-page.component";

const routes: Routes = [
  { path: "about", component: AboutComponent },
  { path: "", component: LandingPageComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
