import * as CSSType from 'csstype';
import { Geometry } from 'geojson';
import { ColorUtilities } from '../../../../core/utilities/colors';
import { Stroke } from '../../../../stroke/stroke';
import { GeographiesFeature } from '../../../geographies-feature';
import { GeographiesLabels } from '../labels/geographies-labels';
import {
  GeographiesLabelsColorOptions,
  GeographiesLabelsFontWeightOptions,
} from '../labels/geographies-labels-options';
import { GeographiesLayerOptions } from './geographies-layer-options';

export interface GeographiesTooltipDatum<Datum> {
  attributeValue?: string;
  color: string;
  datum?: Datum;
  geography: string;
}

export abstract class GeographiesLayer<
  Datum,
  TProperties,
  TGeometry extends Geometry,
> implements GeographiesLayerOptions<TProperties, TGeometry>
{
  enableEventActions: boolean;
  featureClass: (d: TProperties) => string;
  featureIndexAccessor: (
    d: GeographiesFeature<TProperties, TGeometry>
  ) => string;
  geographies: Array<GeographiesFeature<TProperties, TGeometry>>;
  id: number;
  labels: GeographiesLabels<TProperties, TGeometry>;
  stroke: Stroke;

  setFeatureIndexAccessor(
    accessor: (d: GeographiesFeature<TProperties, TGeometry>) => string
  ): void {
    this.featureIndexAccessor = accessor;
  }

  abstract getFill(feature: GeographiesFeature<TProperties, TGeometry>): string;

  abstract getTooltipData(
    path: SVGPathElement
  ): GeographiesTooltipDatum<Datum | undefined>;

  getLabelColor(
    feature: GeographiesFeature<TProperties, TGeometry>
  ): CSSType.Property.Fill {
    const pathColor = this.getFill(feature);
    if (typeof this.labels.color === 'string') {
      return this.labels.color;
    }

    if (pathColor.startsWith('url')) {
      return this.labels.color.pattern ?? this.labels.color.default;
    }

    return ColorUtilities.getHigherContrastColorForBackground(
      pathColor,
      this.labels.color.default,
      this.labels.color.contrastAlternative
    );
  }

  getLabelFontWeight(
    feature: GeographiesFeature<TProperties, TGeometry>
  ): CSSType.Property.FontWeight {
    const pathColor = this.getFill(feature);

    if (!this.isContrastFontWeightOptions(this.labels.fontWeight)) {
      return this.labels.fontWeight;
    }

    if (pathColor.startsWith('url')) {
      return this.labels.fontWeight.pattern ?? this.labels.fontWeight.default;
    }

    if (this.isContrastColorOptions(this.labels.color)) {
      const labelColor = ColorUtilities.getHigherContrastColorForBackground(
        pathColor,
        this.labels.color.default,
        this.labels.color.contrastAlternative
      );
      return labelColor === this.labels.color.default
        ? this.labels.fontWeight.default
        : this.labels.fontWeight.contrastAlternative;
    }

    return this.labels.fontWeight.default;
  }

  isContrastColorOptions(
    options: GeographiesLabelsColorOptions | CSSType.Property.Fill
  ): options is GeographiesLabelsColorOptions {
    return typeof options === 'object' && options !== null;
  }

  isContrastFontWeightOptions(
    options: GeographiesLabelsFontWeightOptions | CSSType.Property.FontWeight
  ): options is GeographiesLabelsFontWeightOptions {
    return typeof options === 'object' && options !== null;
  }
}
