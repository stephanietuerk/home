import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { BeyondBarComponent } from './beyond-bar/beyond-bar.component';
import { BeyondMapComponent } from './beyond-map/beyond-map.component';
import { BeyondComponent } from './beyond.component';

@NgModule({
  declarations: [BeyondComponent, BeyondBarComponent, BeyondMapComponent],
  imports: [CommonModule],
  exports: [BeyondComponent],
})
export class BeyondModule {}
