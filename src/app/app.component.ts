import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EnvironmentService } from './core/services/environment.service';
@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterModule],
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
