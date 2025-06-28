/* eslint-disable @angular-eslint/prefer-standalone */
import { Component, Input } from '@angular/core';
import { ascending, max } from 'd3';
import {
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { uniqBy } from 'lodash-es';
import * as topojson from 'topojson-client';
import { GeometryCollection, Objects, Topology } from 'topojson-specification';
import {
  ChartConfig,
  VicChartConfigBuilder,
  VicChartModule,
  VicGeographiesConfigBuilder,
  VicGeographiesModule,
} from '../../../../../../../public-api';
import {
  StateIncomePopulationYearDatum,
  stateIncomePopulationYearData,
} from '../../../../../../testing/data/state-population-income-year-data';
import { GeographiesConfig } from '../../../../geographies-config';

const margin = { top: 36, right: 36, bottom: 36, left: 36 };
const chartHeight = 400;
const chartWidth = 600;
const attributeData = stateIncomePopulationYearData
  .filter((x) => x.year === 2020)
  .filter((x) => x.state !== 'Puerto Rico');

interface TestMapGeometryProperties extends GeoJsonProperties {
  name: string;
  id: string;
}

interface TestMapObjects extends Objects {
  country: GeometryCollection<TestMapGeometryProperties>;
  states: GeometryCollection<TestMapGeometryProperties>;
}

type TestUsMapTopology = Topology<TestMapObjects>;

// ***********************************************************
// Geographies component set up
// ***********************************************************
@Component({
  // eslint-disable-next-line @angular-eslint/component-selector
  selector: 'app-test-geographies',
  template: `
    <vic-map-chart [config]="chartConfig">
      <svg:g
        vic-primary-marks-geographies
        svg-elements
        [config]="geographiesConfig"
        [vicGeographiesHoversActions]="hoverActions"
        (vicGeographiesHoverOutput)="updateTooltipForNewOutput($event)"
      ></svg:g>
    </vic-map-chart>
  `,
  styles: [],
  standalone: false,
})
class TestGeographiesComponent {
  @Input() geographiesConfig: GeographiesConfig<
    StateIncomePopulationYearDatum,
    TestMapGeometryProperties
  >;
  chartConfig: ChartConfig = new VicChartConfigBuilder()
    .margin(margin)
    .width(chartWidth)
    .height(chartHeight)
    .resize({ useViewbox: false })
    .getConfig();
}

const mountGeographiesComponent = (
  geographiesConfig: GeographiesConfig<
    StateIncomePopulationYearDatum,
    TestMapGeometryProperties
  >
): void => {
  const declarations = [TestGeographiesComponent];
  const imports = [VicChartModule, VicGeographiesModule];

  cy.mount(TestGeographiesComponent, {
    declarations,
    imports,
    componentProperties: {
      geographiesConfig: geographiesConfig,
    },
  });
};

// ***********************************************************
// Test dimension
// ***********************************************************
describe('the Equal Frequencies Bins Attribute Data dimension', () => {
  let geographiesConfig: GeographiesConfig<
    StateIncomePopulationYearDatum,
    TestMapGeometryProperties
  >;
  beforeEach(() => {
    geographiesConfig = undefined;
  });
  it('Uses dimension defaults and creates bins in the data and colors values accordingly with default colors', () => {
    cy.fixture('usMap.json').then((response) => {
      const usMap: TestUsMapTopology = response;
      const usBoundary = topojson.feature(
        usMap,
        usMap.objects.country
      ) as FeatureCollection<MultiPolygon, TestMapGeometryProperties>;
      const states = topojson.feature(
        usMap,
        usMap.objects.states
      ) as FeatureCollection<MultiPolygon | Polygon, TestMapGeometryProperties>;
      geographiesConfig = new VicGeographiesConfigBuilder<
        StateIncomePopulationYearDatum,
        TestMapGeometryProperties
      >()
        .boundary(usBoundary)
        .featureIndexAccessor((d) => d.properties.name)
        .attributeDataLayer((dimension) =>
          dimension
            .data(attributeData)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .equalFrequenciesBins((bins) => bins.valueAccessor((d) => d.income))
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      // see https://d3js.org/d3-scale/quantile#quantile_domain for how d3 quantile works
      const sortedAttributeData = attributeData
        .filter((x) => {
          const coerced = Number(x.income);
          return !(isNaN(coerced) || coerced === null || coerced === undefined);
        })
        .sort((a, b) => ascending(Number(a.income), Number(b.income)));
      const binMaxValues = [
        ...geographiesConfig.attributeDataLayer.attributeDimension
          .getScale()
          ['quantiles'](),
        max(sortedAttributeData.map((x) => x.income)),
      ];
      const statesByBin = sortedAttributeData.reduce((acc, d) => {
        const binNumber = binMaxValues.reduce((acc, maxValue, i) => {
          if (
            (d.income < maxValue || i === binMaxValues.length - 1) &&
            acc === null
          ) {
            acc = i;
            return acc;
          } else {
            return acc;
          }
        }, null);
        if (!acc[binNumber]) {
          acc[binNumber] = [];
        }
        acc[binNumber].push(d.state);
        return acc;
      }, []);
      cy.get('.vic-geographies-group path').then((states) => {
        // get unique bin colors for geographies in attribute data
        const binColors = uniqBy(
          states
            .filter(
              (i, el) =>
                !!attributeData.find(
                  (x) => x.state.split(' ').join('-') === el.classList[0]
                )
            )
            .map((i, el) => {
              const rg = el.getAttribute('fill').split('(')[1].split(',');
              return { r: rg[0].trim(), g: rg[1].trim() };
            }),
          (x) => x.r
        )
          .sort((a, b) => b.r - a.r)
          .map((x) => `rgb(${x.r}, ${x.g}, 255)`);
        binColors.forEach((color, i) => {
          // check that the states in each bin have the same color
          statesByBin[i].forEach((state) => {
            cy.get(
              `.vic-geographies-group.${state.split(' ').join('-')} path`
            ).then((path) => {
              expect(path.attr('fill')).to.eq(color);
            });
          });
        });
      });
    });
  });

  it('Colors the data with provided range when a user provides a range of the same length as num bins', () => {
    const range = ['red', 'orange', 'yellow', 'green', 'blue'];
    cy.fixture('usMap.json').then((response) => {
      const usMap: TestUsMapTopology = response;
      const usBoundary = topojson.feature(
        usMap,
        usMap.objects.country
      ) as FeatureCollection<MultiPolygon, TestMapGeometryProperties>;
      const states = topojson.feature(
        usMap,
        usMap.objects.states
      ) as FeatureCollection<MultiPolygon | Polygon, TestMapGeometryProperties>;
      geographiesConfig = new VicGeographiesConfigBuilder<
        StateIncomePopulationYearDatum,
        TestMapGeometryProperties
      >()
        .boundary(usBoundary)
        .featureIndexAccessor((d) => d.properties.name)
        .attributeDataLayer((dimension) =>
          dimension
            .data(attributeData)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .equalFrequenciesBins((bins) =>
              bins
                .valueAccessor((d) => d.income)
                .numBins(5)
                .range(range)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      // see https://d3js.org/d3-scale/quantile#quantile_domain for how d3 quantile works
      const sortedAttributeData = attributeData
        .filter((x) => {
          const coerced = Number(x.income);
          return !(isNaN(coerced) || coerced === null || coerced === undefined);
        })
        .sort((a, b) => ascending(Number(a.income), Number(b.income)));
      const binMaxValues = [
        ...geographiesConfig.attributeDataLayer.attributeDimension
          .getScale()
          ['quantiles'](),
        max(sortedAttributeData.map((x) => x.income)),
      ];
      const statesByBin = sortedAttributeData.reduce((acc, d) => {
        const binNumber = binMaxValues.reduce((acc, maxValue, i) => {
          if (
            (d.income < maxValue || i === binMaxValues.length - 1) &&
            acc === null
          ) {
            acc = i;
            return acc;
          } else {
            return acc;
          }
        }, null);
        if (!acc[binNumber]) {
          acc[binNumber] = [];
        }
        acc[binNumber].push(d.state);
        return acc;
      }, []);
      range.forEach((color, i) => {
        // check that the states in each bin have the same color
        statesByBin[i].forEach((state) => {
          cy.get(
            `.vic-geographies-group.${state.split(' ').join('-')} path`
          ).then((path) => {
            expect(path.attr('fill')).to.eq(color);
          });
        });
      });
    });
  });

  it('Colors the data with interpolated colors when a user provides a range of lesser length than num bins', () => {
    const range = ['red', 'white'];
    const numBins = 5;
    cy.fixture('usMap.json').then((response) => {
      const usMap: TestUsMapTopology = response;
      const usBoundary = topojson.feature(
        usMap,
        usMap.objects.country
      ) as FeatureCollection<MultiPolygon, TestMapGeometryProperties>;
      const states = topojson.feature(
        usMap,
        usMap.objects.states
      ) as FeatureCollection<MultiPolygon | Polygon, TestMapGeometryProperties>;
      geographiesConfig = new VicGeographiesConfigBuilder<
        StateIncomePopulationYearDatum,
        TestMapGeometryProperties
      >()
        .boundary(usBoundary)
        .featureIndexAccessor((d) => d.properties.name)
        .attributeDataLayer((dimension) =>
          dimension
            .data(attributeData)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .equalFrequenciesBins((bins) =>
              bins
                .valueAccessor((d) => d.income)
                .numBins(numBins)
                .range(range)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      // see https://d3js.org/d3-scale/quantile#quantile_domain for how d3 quantile works
      const sortedAttributeData = attributeData
        .filter((x) => {
          const coerced = Number(x.income);
          return !(isNaN(coerced) || coerced === null || coerced === undefined);
        })
        .sort((a, b) => ascending(Number(a.income), Number(b.income)));
      const binMaxValues = [
        ...geographiesConfig.attributeDataLayer.attributeDimension
          .getScale()
          ['quantiles'](),
        max(sortedAttributeData.map((x) => x.income)),
      ];
      const statesByBin = sortedAttributeData.reduce((acc, d) => {
        const binNumber = binMaxValues.reduce((acc, maxValue, i) => {
          if (
            (d.income < maxValue || i === binMaxValues.length - 1) &&
            acc === null
          ) {
            acc = i;
            return acc;
          } else {
            return acc;
          }
        }, null);
        if (!acc[binNumber]) {
          acc[binNumber] = [];
        }
        acc[binNumber].push(d.state);
        return acc;
      }, []);
      let colors = [];
      cy.get('.vic-geographies-group path').then((paths) => {
        paths.each((i, el) => {
          const path = el as unknown as SVGPathElement;
          const fill = path.getAttribute('fill');
          if (!colors.includes(fill)) {
            colors.push(fill);
          }
        });
        expect(colors).to.have.lengthOf(numBins + 1);
        colors = colors.filter((x) => x[0] === 'r'); // filter out null color 'whitesmoke'
        colors.sort((a, b) =>
          ascending(a.split(',')[1].trim(), b.split(',')[1].trim())
        );
        paths.each((i, el) => {
          const path = el as unknown as SVGPathElement;
          const state = path.parentElement.classList[1].split('-').join(' ');
          const binIndex = statesByBin.findIndex((bin) => bin.includes(state));
          if (binIndex > -1) {
            expect(path.getAttribute('fill')).to.eq(colors[binIndex]);
          } else {
            expect(path.getAttribute('fill')).to.eq('whitesmoke');
          }
        });
      });
    });
  });
});
