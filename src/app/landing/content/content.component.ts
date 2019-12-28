import { Component, OnInit, Input, TemplateRef, Output } from '@angular/core';
import { EventEmitter } from 'events';

@Component({
  selector: 'app-content',
  templateUrl: './content.component.html',
  styleUrls: ['./content.component.scss']
})
export class ContentComponent implements OnInit {
  @Input() contentPortalTemplate: TemplateRef<any>;

  constructor() {}

  ngOnInit() {}
}
