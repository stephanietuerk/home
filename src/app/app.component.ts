import { Component, OnInit } from '@angular/core';
import { EnvironmentService } from './core/services/environment.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'Stephanie Tuerk';

  constructor(private environment: EnvironmentService) {}

  ngOnInit(): void {
    this.environment.init();
  }
}
