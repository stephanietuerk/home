import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { transition } from 'd3';
import { easeQuadOut } from 'd3-ease';
import { geoAlbers, geoPath } from 'd3-geo';
import { select } from 'd3-selection';
import { zoom, zoomIdentity, zoomTransform } from 'd3-zoom';
import { Subject } from 'rxjs';
import * as topojson from 'topojson-client';
import { BEYOND_COLORS, BEYOND_SCALES } from '../beyond.constants';
import { BeyondService } from '../services/beyond.service';

@Component({
  selector: 'app-beyond-map',
  templateUrl: './beyond-map.component.html',
  styleUrls: ['./beyond-map.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BeyondMapComponent implements OnInit, OnChanges, OnDestroy {
  @Input() electionYear: string;
  @Input() electionType: string;
  mapCreated = false;
  divId = '#beyond-map';
  svg: any;
  map: any;
  projection: any;
  width = 900;
  height = 540;
  viewPlaceNames = true;
  mapZoom = zoom().scaleExtent([1, 10]);
  mapPath: any;
  private destroy$ = new Subject();

  constructor(private beyondService: BeyondService) {}

  ngOnInit(): void {
    this.makeMap();
  }

  ngOnChanges(): void {
    if (this.mapCreated) {
      this.updateMap();
    }
  }

  makeMap() {
    this.makeSvg();
    this.makeMapGroup();
    this.makeZoomRect();
    this.makeBaseMap();
    this.makeCities();
    this.updateMap();
    this.makeMapInterface();
    this.mapCreated = true;
  }

  makeSvg() {
    this.svg = select(this.divId)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
  }

  makeMapGroup() {
    this.map = this.svg
      .append('g')
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('id', 'beyond-map-g');
  }

  makeZoomRect() {
    this.map
      .append('rect')
      .attr('id', 'beyond-zoom-box')
      .attr('class', 'click-overlay')
      .attr('width', '100%')
      .attr('height', '100%')
      .attr('fill', 'none')
      .on('mouseover', (event) => {
        select(event.currentTarget)
          .style('stroke', BEYOND_COLORS.initialColor)
          .style('stroke-width', '3px')
          .style('stroke-linecap', 'butt')
          .style('stroke-dasharray', '2, 3');
      })
      .on('mouseout', (event) => {
        select(event.currentTarget).style('stroke', 'none');
      });
  }

  makeBaseMap() {
    this.projection = geoAlbers().rotate([77.1945, 0]).center([0, 41.2033]);

    this.mapPath = geoPath()
      .projection(this.projection)
      .pointRadius((d) => this.getMarkerRadiusFromPopulation(d));

    const allTracts = topojson.feature(
      this.beyondService.tractsTopojson,
      this.beyondService.tractsTopojson.objects.PA_CensusTracts_2010
    );

    this.projection.scale(1).translate([0, 0]);

    const b = this.mapPath.bounds(allTracts);
    const s =
      0.95 /
      Math.max(
        (b[1][0] - b[0][0]) / this.width,
        (b[1][1] - b[0][1]) / this.height
      );
    const t = [
      (this.width - s * (b[1][0] + b[0][0])) / 2,
      (this.height - s * (b[1][1] + b[0][1])) / 2,
    ];

    this.projection.scale(s).translate(t);

    this.mapZoom.on('zoom', () => this.onMapZoom());

    this.svg.call(this.mapZoom);

    this.map
      .append('g')
      .selectAll('path')
      .data(allTracts.features)
      .enter()
      .append('path')
      .attr('class', 'tracts vote-tracts')
      .attr('tractno', (d) => d.properties.GEO_ID)
      .attr('d', this.mapPath)
      .style('stroke-width', '0.8px');
  }

  updateMap() {
    const duration = this.mapCreated ? 300 : 0;
    const t = transition().duration(duration).ease(easeQuadOut);

    this.map
      .selectAll('.tracts')
      .transition(t)
      .style('fill', (d) => {
        const tract = d.properties.GEO_ID;
        const tractData =
          this.beyondService.tractData[tract][this.electionType][
            this.electionYear
          ];
        if (!tractData || isNaN(tractData)) {
          return BEYOND_COLORS.initialColor;
        } else {
          const color =
            tractData >= 0 ? BEYOND_SCALES.vote.r : BEYOND_SCALES.vote.d;
          return color(tractData);
        }
      })
      .style('stroke', (d) => {
        const tract = d.properties.GEO_ID;
        const tractData =
          this.beyondService.tractData[tract][this.electionType][
            this.electionYear
          ];
        if (!tractData || isNaN(tractData)) {
          return BEYOND_COLORS.initialColor;
        } else {
          const color =
            tractData >= 0 ? BEYOND_SCALES.vote.r : BEYOND_SCALES.vote.d;
          return color(tractData);
        }
      });
  }

  makeCities() {
    const cities = topojson.feature(
      this.beyondService.citiesTopojson,
      this.beyondService.citiesTopojson.objects.PA_Cities
    );

    this.map
      .selectAll('.city')
      .data(cities.features)
      .enter()
      .append('path')
      .attr('d', this.mapPath)
      .attr('class', 'city')
      .attr('visibility', (d) => this.getVisibilityFromPopulation(d));

    this.map
      .selectAll('.city-label')
      .data(cities.features)
      .enter()
      .append('text')
      .attr('class', 'city-label')
      .attr('transform', (d) => {
        return 'translate(' + this.projection(d.geometry.coordinates) + ')';
      })
      .attr('visibility', (d) => this.getVisibilityFromPopulation(d))
      .attr('dy', (d) => {
        if (
          d.properties.City == 'Bethlehem' ||
          d.properties.City == 'Philadelphia' ||
          d.properties.City == 'Pittsburgh'
        ) {
          return '-.35em';
        }
        // if (d.properties.City == "Wilkinsburg" || d.properties.City == "Monroesville" || d.properties.City == "Upper St. Clair") {return "1.3em";}
        else {
          return '.7em';
        }
      })
      .attr('x', (d) => {
        return d.geometry.coordinates[0] > -77.1945 ? -5 : 5;
      })
      .style('text-anchor', (d) => {
        return d.geometry.coordinates[0] > -77.1945 ? 'end' : 'start';
      })
      .text((d) => {
        return d.properties.City;
      });
  }

  makeMapInterface() {
    const exploreText = this.svg
      .append('text')
      .attr('id', 'beyond-explore-text')
      .attr('class', 'map-text')
      .attr('x', this.width - 15)
      .attr('y', 45)
      .text('zoom and move map to explore');

    const howText = this.svg
      .append('text')
      .attr('id', 'beyond-how-text')
      .attr('class', 'map-text-sm')
      .attr('x', this.width - 15)
      .attr('y', 535)
      .text('double click or pinch to zoom');

    const placeNamesText = this.svg
      .append('text')
      .attr('id', 'beyond-placenames-text')
      .attr('class', 'map-sel-text')
      .attr('x', this.width - 15)
      .attr('y', 25)
      .text(() => {
        if (this.viewPlaceNames) {
          return 'placenames: on';
        } else {
          return 'placenames: off';
        }
      });

    const placeNamesBox = this.svg
      .append('rect')
      .attr('class', 'click-overlay')
      .attr('id', 'beyond-placenames-box')
      .attr('width', 120)
      .attr('height', 20)
      .attr('x', this.width - 125)
      .attr('y', 10)
      .attr('fill', 'none')
      .on('click', () => this.togglePlaceNames(placeNamesText))
      .on('mouseover', (event) => {
        select(event.currentTarget).style('cursor', 'pointer');
      })
      .on('mouseout', (event) => {
        select(event.currentTarget).style('cursor', 'default');
      });

    const resetTextBox = this.svg
      .append('rect')
      .attr('class', 'click-overlay-variable')
      .attr('id', 'beyond-reset-box')
      .attr('width', 120)
      .attr('height', 30)
      .attr('x', this.width - 125)
      .attr('y', 30)
      .attr('fill', 'none')
      .attr('pointer-events', 'none')
      .on('click', () => this.resetZoom())
      .on('mouseover', (event) => {
        select(event.currentTarget).style('cursor', 'pointer');
      })
      .on('mouseout', (event) => {
        select(event.currentTarget).style('cursor', 'default');
      });
  }

  getMapSvg() {
    return select(this.divId).selectAll('svg');
  }

  getMapG() {
    return select('#beyond-map-g');
  }

  onMapZoom() {
    //Controls zoom behavior of map
    //Turns on labels of smaller city when zoom level reaches 3
    //Turns on bounding box for map when zoomed
    //Scales placename labels on zoom
    const zoomBox = select('#beyond-zoom-box');
    const placeNamesText = select('#beyond-placenames-text');
    const exploreText = select('#beyond-explore-text');
    const howText = select('#beyond-how-text');
    const resetBox = select('#beyond-reset-box');

    const transform = zoomTransform(this.svg.node());
    this.map.attr('transform', transform);
    const zoomScale = transform.k;

    const getVisibilityFromZoomScaleOrPopulation = (d) => {
      if (this.viewPlaceNames) {
        return zoomScale >= 1.7 || +d.properties.Population >= 28500
          ? 'visible'
          : 'hidden';
      } else {
        return 'hidden';
      }
    };

    this.map
      .selectAll('.city')
      .attr(
        'd',
        this.mapPath.pointRadius((d) => this.getMarkerRadiusFromPopulation(d))
      )
      .attr('visibility', (d) => getVisibilityFromZoomScaleOrPopulation(d));

    //controls scale and visibility of city labels
    this.map
      .selectAll('.city-label')
      .style('font-size', () => {
        return `${0.7 / zoomScale}rem`;
      })
      .attr('visibility', (d) => getVisibilityFromZoomScaleOrPopulation(d))
      .attr('dy', (d) => {
        if (
          d.properties.City == 'Bethlehem' ||
          d.properties.City == 'Philadelphia' ||
          d.properties.City == 'Pittsburgh'
        ) {
          return -0.35 / zoomScale + 'em';
        }
        if (
          d.properties.City == 'Wilkinsburg' ||
          d.properties.City == 'Monroeville' ||
          d.properties.City == 'Upper St. Clair'
        ) {
          return 3 / zoomScale + 'em';
        } else {
          return 0.7 / zoomScale + 'em';
        }
      })
      .attr('x', (d) => {
        return d.geometry.coordinates[0] > -77.1945
          ? -7 / zoomScale
          : 7 / zoomScale;
      })
      .style('text-anchor', (d) => {
        return d.geometry.coordinates[0] > -77.1945 ? 'end' : 'start';
      });

    const zoomedInForText = zoomScale >= 1.2;
    exploreText
      .text(() => {
        if (zoomedInForText) {
          return 'reset map';
        } else {
          return 'zoom and move map to explore';
        }
      })
      .style('fill', function () {
        if (zoomedInForText) return 'black';
      });

    howText.text(() => {
      if (zoomedInForText) {
        return '';
      } else {
        return 'double click or pinch to zoom';
      }
    });

    placeNamesText.style('fill', function () {
      if (zoomedInForText) return 'black';
    });

    resetBox.attr('pointer-events', function () {
      if (zoomedInForText) {
        return 'all';
      } else {
        return 'none';
      }
    });

    if (zoomScale > 1) {
      zoomBox
        .style('stroke', BEYOND_COLORS.initialColor)
        .style('stroke-width', '3px')
        .style('stroke-linecap', 'butt')
        .style('stroke-dasharray', '2, 3');
    } else {
      zoomBox.style('stroke', 'none');
    }
  }

  resetZoom() {
    this.svg
      .transition()
      .duration(750)
      .call(this.mapZoom.transform, zoomIdentity);
  }

  togglePlaceNames(placeNamesText) {
    this.viewPlaceNames = !this.viewPlaceNames;

    if (this.viewPlaceNames) {
      placeNamesText.text('placenames: on');
      this.map
        .selectAll('.city')
        .attr('visibility', (d) => this.getVisibilityFromPopulation(d));
      this.map
        .selectAll('.city-label')
        .attr('visibility', (d) => this.getVisibilityFromPopulation(d));
    } else {
      placeNamesText.text('placenames: off');
      this.map.selectAll('.city').attr('visibility', 'hidden');
      this.map.selectAll('.city-label').attr('visibility', 'hidden');
    }
  }

  getVisibilityFromPopulation(d): string {
    if (+d.properties.Population >= 28500) {
      return 'visible';
    } else {
      return 'hidden';
    }
  }

  getMarkerRadiusFromPopulation(d): number {
    if (+d.properties.Population > 1000000) {
      return 5;
    }
    if (+d.properties.Population > 100000) {
      return 3;
    } else {
      return 2;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
