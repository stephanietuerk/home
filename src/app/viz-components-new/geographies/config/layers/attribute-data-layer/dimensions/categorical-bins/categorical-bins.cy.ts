/* eslint-disable @angular-eslint/prefer-standalone */
import { Component, Input } from '@angular/core';
import { geoMercator } from 'd3';
import {
  FeatureCollection,
  GeoJsonProperties,
  MultiPolygon,
  Polygon,
} from 'geojson';
import { beforeEach, cy, describe, expect, it } from 'local-cypress';
import { range } from 'rxjs';
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
        [vicGeographiesHoverActions]="hoverActions"
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
describe.only('the Categorical Bins Attribute Data dimension', () => {
  let geographiesConfig: GeographiesConfig<
    StateIncomePopulationYearDatum,
    TestMapGeometryProperties
  >;
  beforeEach(() => {
    geographiesConfig = undefined;
  });
  it('User provides domain and range - colors states by domain and range in 1:1 relationship', () => {
    const binValues = [50000, 75000];
    const rangeValues = ['red', 'violet', 'blue'];
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
        .attributeDataLayer((layer) =>
          layer
            .data(attributeData)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .categoricalBins((dimension) =>
              dimension
                .valueAccessor((d) => {
                  if (d.income < binValues[0]) {
                    return 'Low';
                  } else if (d.income < binValues[1]) {
                    return 'Medium';
                  } else {
                    return 'High';
                  }
                })
                .domain(['Low', 'Medium', 'High'])
                .range(rangeValues)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      rangeValues.forEach((color, i) => {
        const statesInAttributeData = attributeData
          .filter((x) => {
            if (i === 0) {
              return x.income < binValues[i];
            } else if (i === rangeValues.length - 1) {
              return x.income >= binValues[i - 1];
            } else {
              return x.income < binValues[i + 1] && x.income >= binValues[i];
            }
          })
          .map((x) => x.state);
        statesInAttributeData.forEach((state) => {
          cy.get(
            `.vic-geographies-group.${state.split(' ').join('-')} path`
          ).then((path) => {
            expect(path.attr('fill')).to.eq(color);
          });
        });
      });
    });
  });

  it('User provides range but not domain - colors in order they appear in data', () => {
    const binValues = [50000, 75000];
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
        .attributeDataLayer((layer) =>
          layer
            .data(attributeData)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .categoricalBins((dimension) =>
              dimension
                .valueAccessor((d) => {
                  if (d.income < binValues[0]) {
                    return 'Low';
                  } else if (d.income < binValues[1]) {
                    return 'Medium';
                  } else {
                    return 'High';
                  }
                })
                .range(['red', 'violet', 'blue'])
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      const lowStates = attributeData // first state in this group: Arkansas - uses third color
        .filter((d) => d.income < binValues[0])
        .map((d) => d.state.replace(/\s/g, '-'));
      const mediumStates = attributeData // first state in this group: Alabama - uses first color
        .filter((d) => d.income < binValues[1] && d.income >= binValues[0])
        .map((d) => d.state.replace(/\s/g, '-'));
      const highStates = attributeData // first state in this group: Alaska  - uses second color
        .filter((d) => d.income >= binValues[1])
        .map((d) => d.state.replace(/\s/g, '-'));
      [
        { data: mediumStates, color: 'red' },
        { data: highStates, color: 'violet' },
        { data: lowStates, color: 'blue' },
      ].forEach((group) => {
        group.data.forEach((state) => {
          cy.get(
            `.vic-geographies-group.${state.split(' ').join('-')} path`
          ).then((path) => {
            expect(path.attr('fill')).to.eq(group.color);
          });
        });
      });
    });
  });

  it('User provides range that has fewer categories than in data -- additional categories get assigned to given range values -- EXPECTED VISUAL DEFECT', () => {
    const binValues = [50000, 65000, 80000];
    const rangeValues = ['red', 'violet'];
    // Note: use colors where only one rbg color channel varies so that it's possible to test data values.
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
        .attributeDataLayer((layer) =>
          layer
            .data(attributeData)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .categoricalBins((dimension) =>
              dimension
                .valueAccessor((d) => {
                  if (d.income < binValues[0]) {
                    return 'Low';
                  } else if (d.income < binValues[1]) {
                    return 'Medium';
                  } else if (d.income < binValues[2]) {
                    return 'High';
                  } else {
                    return 'Very High';
                  }
                })
                .domain(['Low', 'Medium', 'High', 'Very High'])
                .range(rangeValues)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      range(binValues.length + 1).forEach((i) => {
        const statesInAttributeData = attributeData
          .filter((x) => {
            if (i === 0) {
              return x.income < binValues[i];
            } else if (i === binValues.length) {
              return x.income >= binValues[i - 1];
            } else {
              return x.income < binValues[i] && x.income >= binValues[i - 1];
            }
          })
          .map((d) => d.state.replace(/\s/g, '-'));
        const color = rangeValues[i % rangeValues.length];
        statesInAttributeData.forEach((state) => {
          cy.get(
            `.vic-geographies-group.${state.split(' ').join('-')} path`
          ).then((path) => {
            expect(path.attr('fill')).to.eq(color);
          });
        });
      });
    });
  });

  it('it colors undefined, null, and non-quant values with null color', () => {
    const binValues = [50000, 75000];
    const rangeValues = ['red', 'violet', 'blue'];
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
      const dataWithFalsyValues = attributeData.map((d) => {
        if (d.state === 'Texas') {
          return { ...d, income: null };
        } else if (d.state === 'California') {
          return { ...d, income: undefined };
        } else if (d.state === 'Florida') {
          return { ...d, income: 'Not a number' as unknown as number };
        } else {
          return d;
        }
      });
      const nullColor = 'chartreuse';
      geographiesConfig = new VicGeographiesConfigBuilder<
        StateIncomePopulationYearDatum,
        TestMapGeometryProperties
      >()
        .boundary(usBoundary)
        .featureIndexAccessor((d) => d.properties.name)
        .attributeDataLayer((layer) =>
          layer
            .data(dataWithFalsyValues)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .categoricalBins((dimension) =>
              dimension
                .valueAccessor((d) => {
                  if (
                    d.income === undefined ||
                    d.income === null ||
                    isNaN(d.income)
                  ) {
                    return d.income as unknown as string;
                  } else if (d.income < binValues[0]) {
                    return 'Low';
                  } else if (d.income < binValues[1]) {
                    return 'Medium';
                  } else {
                    return 'High';
                  }
                })
                .domain(['Low', 'Medium', 'High'])
                .range(rangeValues)
                .nullColor(nullColor)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      cy.get(`.vic-geographies-group.Florida path`).then((path) => {
        expect(path.attr('fill')).to.eq(nullColor);
      });
      cy.get(`.vic-geographies-group.Texas path`).then((path) => {
        expect(path.attr('fill')).to.eq(nullColor);
      });
      cy.get(`.vic-geographies-group.California path`).then((path) => {
        expect(path.attr('fill')).to.eq(nullColor);
      });
    });
  });

  it('it colors geographies not in attribute data with the null color', () => {
    // island territories like American Samoa, Guam, etc. are not in the attribute data but are in the geojson
    // they wil be drawn with any projection but let's use geoMercator to make them a bit more visible-ish
    const binValues = [50000, 75000];
    const rangeValues = ['red', 'violet', 'blue'];
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
      const nullColor = 'chartreuse';
      geographiesConfig = new VicGeographiesConfigBuilder<
        StateIncomePopulationYearDatum,
        TestMapGeometryProperties
      >()
        .boundary(usBoundary)
        .projection(geoMercator())
        .featureIndexAccessor((d) => d.properties.name)
        .attributeDataLayer((layer) =>
          layer
            .data(attributeData)
            .class((d) => d.name.split(' ').join('-'))
            .geographies(states.features)
            .geographyIndexAccessor((d) => d.state)
            .categoricalBins((dimension) =>
              dimension
                .valueAccessor((d) => {
                  if (d.income < binValues[0]) {
                    return 'Low';
                  } else if (d.income < binValues[1]) {
                    return 'Medium';
                  } else {
                    return 'High';
                  }
                })
                .domain(['Low', 'Medium', 'High'])
                .range(rangeValues)
                .nullColor(nullColor)
            )
        )
        .getConfig();
      mountGeographiesComponent(geographiesConfig);
      const geographiesNotInAttributeData = states.features
        .filter(
          (x) =>
            attributeData.findIndex((d) => d.state === x.properties.name) === -1
        )
        .map((x) => x.properties.name.replace(/\s/g, '-'));
      geographiesNotInAttributeData.forEach((state) => {
        cy.get(
          `.vic-geographies-group.${state.split(' ').join('-')} path`
        ).then((path) => {
          expect(path.attr('fill')).to.eq(nullColor);
        });
      });
    });
  });
});
