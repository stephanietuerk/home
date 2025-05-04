import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { OrdinalAxisMixin } from '../ordinal/ordinal-axis';
import { mixinXAxis } from '../x/x-axis';
import { XyAxis } from '../xy-axis';

const XOrdinalAxis = mixinXAxis(OrdinalAxisMixin(XyAxis));

/**
 * A component that is used to create an ordinal x-axis.
 *
 * Must be projected into the `svg-elements` content slot of an `XYChart` component.
 *
 * <p class="comment-inputs">Inputs</p>
 *
 * `config`: AxisConfig. (Inherited from XYAxis)
 *
 * `side`: 'top' | 'bottom'. Default is 'top'. (Inherited from XAxis)
 *
 * <p class="comment-example">Example usage</p>
 *
 * import { VicXOrdinalAxisModule } from '@web-ast/viz-components';
 *
 * imports: [VicXOrdinalAxisModule]
 *
 * @example
 * <vic-xy-chart>
 *   <ng-container svg-elements>
 *     <svg:g vic-x-ordinal-axis [config]="xAxisConfig" side="bottom"></svg:g>
 *     <svg:g
 *        vic-y-quantitative-axis
 *        [config]="yAxisConfig"
 *        side="left"
 *     ></svg:g>
 *     <svg:g
 *       vic-data-marks-bars
 *       [config]="dataConfig"
 *     ></svg:g>
 *   </ng-container>
 * </vic-xy-chart>
 */
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: '[vic-x-ordinal-axis]',
  standalone: true,
  imports: [CommonModule],
  templateUrl: '../x/x-axis.html',
  // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
  inputs: ['side', 'config'],
})
export class XOrdinalAxisComponent extends XOrdinalAxis {}
