import { Component } from '@angular/core';
import { mixinOrdinalAxis } from '../ordinal/ordinal-axis';
import { XyAxis } from '../xy-axis';
import { mixinYAxis } from '../y/y-axis';

const YOrdinalAxis = mixinYAxis(mixinOrdinalAxis(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[y-ordinal-axis]',
  templateUrl: '../y/y-axis.html',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['side', 'config'],
})
export class YOrdinalAxisComponent extends YOrdinalAxis {}
