import { Injectable } from '@angular/core';
import { format, select, selectAll } from 'd3';
import { DistrictVotes, Party, StateVotes } from 'src/app/projects/flip/flip.model';
import { FlipBar } from '../flip-bar.class';
import { FLIPCOLORS, FLIPGRIDLAYOUT } from '../flip.constants';
import { FlipResource } from '../resources/flip.resource';

@Injectable({
    providedIn: 'root',
})
export class FlipService {
    elId: string = '#flip-the-district';
    flipTopojson: any;
    flipData: any = [];
    districtsData: any;
    stateData: StateVotes;

    constructor(private flipResource: FlipResource) {}

    setFlipData() {
        this.flipResource.getFlipData().subscribe(
            (data) => {
                const csvToRowArray = data.split('\n');
                const header = csvToRowArray[0].split(',');
                const rows = csvToRowArray.slice(1);
                const dataArr = rows.map((row, i) => {
                    const rowObj = new DistrictVotes();
                    const rowValues = row.split(',');
                    rowValues.forEach((val, j) => {
                        const key = header[j];
                        if (typeof key !== 'undefined') {
                            if (key.includes('Cand')) {
                                rowObj[key] = val;
                            } else {
                                rowObj[key] = +val;
                            }
                        }
                    });
                    rowObj.totalVotes = rowObj.dVotes + rowObj.rVotes + rowObj.oVotes;
                    rowObj.dPercent = rowObj.dVotes / rowObj.totalVotes;
                    rowObj.rPercent = rowObj.rVotes / rowObj.totalVotes;
                    rowObj.oPercent = rowObj.oVotes / rowObj.totalVotes;
                    return rowObj;
                });
                this.flipData = dataArr;
                this.makeDistrictData();
                this.updateStateData(Object.values(this.flipData));
            },
            (error) => {
                console.log(error);
            }
        );
        this.flipResource.getFlipTopoJson().subscribe(
            (data) => {
                this.flipTopojson = data;
            },
            (error) => {
                console.log(error);
            }
        );
    }

    makeDistrictData() {
        this.districtsData = this.flipData.reduce((acc, cur) => {
            acc[cur.district] = cur;
            return acc;
        }, {});
    }

    updateStateData(districtData: DistrictVotes[]) {
        let dVotes = 0;
        let rVotes = 0;
        let oVotes = 0;
        let dDistricts = 0;
        let rDistricts = 0;
        let oDistricts = 0;

        districtData.forEach((district) => {
            dVotes += district.dVotes;
            rVotes += district.rVotes;
            oVotes += district.oVotes;

            if (district.dVotes >= district.rVotes && district.dVotes >= district.oVotes) {
                dDistricts += 1;
            } else if (district.rVotes >= district.dVotes && district.rVotes >= district.oVotes) {
                rDistricts += 1;
            } else if (district.oVotes >= district.dVotes && district.oVotes >= district.rVotes) {
                oDistricts += 1;
            }
        });

        const totalVotes = dVotes + rVotes + oVotes;

        this.stateData = {
            dVotes,
            rVotes,
            oVotes,
            totalVotes,
            dPercent: dVotes / totalVotes,
            rPercent: rVotes / totalVotes,
            oPercent: oVotes / totalVotes,
            dDistricts,
            rDistricts,
            oDistricts,
        };
    }

    updateVisualization(bar: FlipBar): void {
        this.updateDistrictsData(bar);
        this.updateStateData(Object.values(this.districtsData));
        this.updateGrid();
        this.updateMap(bar);
        this.updateDisplay(document.getElementById(this.elId.replace('#', '')));
    }

    updateDistrictsData(bar: FlipBar): void {
        this.districtsData[bar.data.district] = bar.draggedData;
    }

    updateGrid() {
        const cutDGrid = this.stateData.dPercent * FLIPGRIDLAYOUT.rows * FLIPGRIDLAYOUT.cols;
        const cutOtherGrid =
            ((this.stateData.dVotes + this.stateData.oVotes) / this.stateData.totalVotes) *
            FLIPGRIDLAYOUT.rows *
            FLIPGRIDLAYOUT.cols;

        select(this.elId)
            .selectAll('.grid-square')
            .attr('squareColor', (d, i, nodes: HTMLElement[]) => {
                if (+nodes[i].getAttribute('cellnum') <= cutDGrid) {
                    return FLIPCOLORS.dColor;
                } else if (
                    +nodes[i].getAttribute('cellnum') > cutDGrid &&
                    +nodes[i].getAttribute('cellnum') <= cutOtherGrid
                ) {
                    return FLIPCOLORS.oColor;
                } else {
                    return FLIPCOLORS.rColor;
                }
            })
            .transition()
            .duration(100)
            .style('fill', (d, i, nodes: HTMLElement[]) => nodes[i].getAttribute('squareColor'));
    }

    updateMap(bar: FlipBar) {
        select(this.elId)
            .selectAll('.district-boundary')
            .filter((d, i, nodes: HTMLElement[]) => +nodes[i].getAttribute('district') == bar.data.district)
            .raise()
            .classed('active-drag', true)
            .classed('active-mouseover', false)
            .attr('winner', () => this.getDistrictWinner(bar.draggedData))
            .transition()
            .duration(120)
            .style('fill', (d, i, nodes: HTMLElement[]) => {
                if (nodes[i].getAttribute('winner') === Party.D) {
                    return FLIPCOLORS.dMapColor;
                } else if (nodes[i].getAttribute('winner') === Party.R) {
                    return FLIPCOLORS.rColor;
                } else {
                    return FLIPCOLORS.oColor;
                }
            });

        selectAll('.district-boundary')
            .filter((d, i, nodes: HTMLElement[]) => +nodes[i].getAttribute('district') !== bar.data.district)
            .classed('active-drag-others', true);
    }

    updateDisplay(visContainer: HTMLElement) {
        const formatter = format(',.0f');

        select(visContainer)
            .selectAll('.display-data-dem')
            .filter('.display-votes')
            .text(formatter(this.stateData.dVotes));

        select(visContainer)
            .selectAll('.display-data-rep')
            .filter('.display-votes')
            .text(formatter(this.stateData.rVotes));

        select(visContainer)
            .selectAll('.display-data-dem')
            .filter('.display-districts')
            .text(formatter(this.stateData.dDistricts));

        select(visContainer)
            .selectAll('.display-data-rep')
            .filter('.display-districts')
            .text(formatter(this.stateData.rDistricts));

        select(visContainer)
            .selectAll('.congress-square')
            .transition()
            .duration(100)
            .style('fill', (d, i, nodes: HTMLElement[]) => this.getCongressSquareColor(nodes[i]));
    }

    getDistrictWinner(data: DistrictVotes): string {
        if (data.dVotes > data.rVotes && data.dVotes > data.oVotes) {
            return Party.D;
        } else if (data.rVotes > data.dVotes && data.rVotes > data.oVotes) {
            return Party.R;
        } else {
            return Party.O;
        }
    }

    getCongressSquareColor(el: HTMLElement) {
        if (+el.getAttribute('cellnum') <= this.stateData.dDistricts) {
            return FLIPCOLORS.dColor;
        } else if (
            +el.getAttribute('cellnum') > this.stateData.dDistricts &&
            +el.getAttribute('cellnum') <= this.stateData.dDistricts + this.stateData.oDistricts
        ) {
            return FLIPCOLORS.oColor;
        } else if (+el.getAttribute('cellnum') >= this.stateData.dDistricts + this.stateData.oDistricts) {
            return FLIPCOLORS.rColor;
        }
    }

    showDistrictInfo(data: DistrictVotes, visDiv: HTMLElement) {
        const visContainer = select(visDiv);
        const formatter = format('.0%');

        visContainer
            .selectAll('.district-boundary')
            .filter((d, i, nodes: HTMLElement[]) => +nodes[i].getAttribute('district') === data.district)
            .classed('active-mouseover', true)
            .raise();

        visContainer.selectAll('.district-info-container').style('opacity', 1);

        const infoNameX = 100;
        const infoNumX = 350;
        const startY = 20;
        const infoLineSpacing = 12;

        visContainer
            .select('.district-info.district-name')
            .attr('x', infoNameX)
            .attr('y', startY + infoLineSpacing)
            .text(`PA District ${data.district}`);

        visContainer
            .select('.district-info.year')
            .attr('x', infoNameX + 155)
            .attr('y', startY + infoLineSpacing);

        visContainer
            .select('.district-info.total-votes')
            .attr('x', infoNumX)
            .attr('y', startY + infoLineSpacing)
            .style('text-anchor', 'end')
            .text(data.totalVotes);

        let dLine = 0;
        let rLine = 0;
        let oLine = 0;

        if (typeof data.dVotes === 'number' && data.dVotes > 0) {
            dLine = 2;
            if (typeof data.rVotes === 'number' && data.rVotes > 0) {
                rLine = 3;
                if (typeof data.oVotes === 'number' && data.oVotes > 0) {
                    oLine = 4;
                }
            } else {
                if (typeof data.oVotes === 'number' && data.oVotes > 0) {
                    oLine = 3;
                }
            }
        } else {
            if (typeof data.rVotes === 'number' && data.rVotes > 0) {
                rLine = 2;
                if (typeof data.oVotes === 'number' && data.oVotes > 0) {
                    oLine = 3;
                }
            } else {
                if (typeof data.oVotes === 'number' && data.oVotes > 0) {
                    oLine = 2;
                }
            }
        }
        if (dLine !== 0) {
            visContainer
                .select('.district-info.cand-name.dem')
                .attr('x', infoNameX)
                .attr('y', startY + infoLineSpacing * dLine)
                .text(data.dCand);

            visContainer
                .select('.district-info.cand-votes.dem')
                .attr('x', infoNumX)
                .attr('y', startY + infoLineSpacing * dLine)
                .text(formatter(data.dPercent));
        } else {
            visContainer.select('.district-info.cand-name.dem').attr('x', null).attr('y', null).text(null);

            visContainer.select('.district-info.cand-votes.dem').attr('x', null).attr('y', null).text(null);
        }

        if (rLine !== 0) {
            visContainer
                .select('.district-info.cand-name.rep')
                .attr('x', infoNameX)
                .attr('y', startY + infoLineSpacing * rLine)
                .text(data.rCand);

            visContainer
                .select('.district-info.cand-votes.rep')
                .attr('x', infoNumX)
                .attr('y', startY + infoLineSpacing * rLine)
                .text(formatter(data.rPercent));
        } else {
            visContainer.select('.district-info.cand-name.rep').attr('x', null).attr('y', null).text(null);

            visContainer.select('.district-info.cand-votes.rep').attr('x', null).attr('y', null).text(null);
        }

        if (oLine !== 0) {
            visContainer
                .select('.district-info.cand-name.oth')
                .attr('x', infoNameX)
                .attr('y', startY + infoLineSpacing * oLine)
                .text(data.oCand);

            visContainer
                .select('.district-info.cand-votes.oth')
                .attr('x', infoNumX)
                .attr('y', startY + infoLineSpacing * oLine)
                .text(formatter(data.oPercent));
        } else {
            visContainer.select('.district-info.cand-name.oth').attr('x', null).attr('y', null).text(null);

            visContainer.select('.district-info.cand-votes.oth').attr('x', null).attr('y', null).text(null);
        }
    }

    hideDistrictInfo(data: DistrictVotes, visDiv) {
        const visContainer = select(visDiv);
        visContainer
            .selectAll('.district-boundary')
            .filter((d, i, nodes: HTMLElement[]) => +nodes[i].getAttribute('district') === data.district)
            .classed('active-mouseover', false);

        visContainer.selectAll('.district-info-container').style('opacity', 0);
    }
}
