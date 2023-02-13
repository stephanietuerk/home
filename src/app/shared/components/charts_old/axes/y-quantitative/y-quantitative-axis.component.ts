import { Component } from '@angular/core';
import { mixinQuantitativeAxis } from '../quantitative/quantitative-axis';
import { XyAxis } from '../xy-axis';
import { mixinYAxis } from '../y/y-axis';

const YQuantitativeAxis = mixinYAxis(mixinQuantitativeAxis(XyAxis));

@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[y-quantitative-axis]',
  templateUrl: '../y/y-axis.html',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['side', 'config'],
})
export class YQuantitativeAxisComponent extends YQuantitativeAxis {}
