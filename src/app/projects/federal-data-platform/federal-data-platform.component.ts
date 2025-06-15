import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-federal-data-platform',
  imports: [CommonModule],
  templateUrl: './federal-data-platform.component.html',
  styleUrl: './federal-data-platform.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FederalDataPlatformComponent {}
