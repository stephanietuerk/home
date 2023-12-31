import { scaleLinear, select, selectAll } from 'd3';
import { range } from 'd3-array';
import { drag } from 'd3-drag';
import { FLIPBARLAYOUT, FLIPCOLORS, FLIPTRANSITIONS } from './flip.constants';
import { DistrictVotes, Party } from './flip.model';
import { FlipService } from './flip.service';

export class FlipBar {
  data: DistrictVotes;
  el: HTMLElement;
  visContainer: HTMLElement;
  cutD: number;
  cutOther: number;
  svg: any;
  isDragged = false;
  draggedData: DistrictVotes;
  dragStartVotes: DistrictVotes;
  dragStartParty: string;
  flipService: FlipService;

  constructor(
    data: DistrictVotes,
    el: HTMLElement,
    visContainer: HTMLElement,
    flipService: FlipService
  ) {
    this.flipService = flipService;
    this.isDragged = false;
    this.data = data;
    this.draggedData = data;
    this.el = el;
    this.visContainer = visContainer;
    this.cutD = this.data.dPercent * FLIPBARLAYOUT.rows * FLIPBARLAYOUT.cols;
    this.cutOther =
      (this.data.dPercent + this.data.oPercent) *
      FLIPBARLAYOUT.rows *
      FLIPBARLAYOUT.cols;
    this.selectSvg();
    this.makeDragRectangle();
    this.makeSquares();
  }

  selectSvg() {
    this.svg = select(this.el)
      .attr('class', 'bar')
      .attr('district', this.data.district)
      .style('fill', 'none');
  }

  makeDragRectangle() {
    const onDrag = drag()
      .on('start', this.initiateDrag.bind(this))
      .on('drag', this.dragChange.bind(this))
      .on('end', this.dragEnd.bind(this));

    this.svg
      .append('rect')
      .attr('class', 'drag-bar')
      .attr('district', this.data.district)
      .style('pointer-events', 'all')
      .attr('width', FLIPBARLAYOUT.width)
      .attr('height', FLIPBARLAYOUT.height)
      .style('fill', 'none')
      .on('mouseover', this.handleMouseOver.bind(this))
      .on('mouseout', this.handleMouseOut.bind(this))
      .call(onDrag);
  }

  makeSquares() {
    this.svg
      .selectAll('.bar-square')
      .data(range(FLIPBARLAYOUT.numSquares))
      .enter()
      .append('rect')
      .attr('class', 'bar-square')
      .attr('district', this.data.district)
      .attr('width', FLIPBARLAYOUT.squareSize - 0.4)
      .attr('height', FLIPBARLAYOUT.squareSize - 0.4)
      .attr('cellnum', (j) => FLIPBARLAYOUT.numSquares - j)
      .attr('x', (j) => FLIPBARLAYOUT.squareSize * (j % FLIPBARLAYOUT.cols))
      .attr(
        'y',
        (j) => FLIPBARLAYOUT.squareSize * Math.floor(j / FLIPBARLAYOUT.cols)
      )
      .style('fill', FLIPCOLORS.initialColor)
      .style('stroke', 'ffffff')
      .style('stroke-width', 0.4)
      .style('stroke-linecap', 'butt')
      .style('pointer-events', 'none')
      .attr('squareColor', (d, j, n) => {
        const el = n[j];
        if (el.getAttribute('cellnum') <= this.cutD) {
          return FLIPCOLORS.dColor;
        } else if (
          el.getAttribute('cellnum') > this.cutD &&
          el.getAttribute('cellnum') <= this.cutOther
        ) {
          return FLIPCOLORS.oColor;
        } else {
          return FLIPCOLORS.rColor;
        }
      })
      .transition()
      .delay((d, j, n) => {
        const el = n[j];
        if (el.getAttribute('squareColor') == FLIPCOLORS.dColor) {
          return (
            FLIPTRANSITIONS.pause +
            el.getAttribute('cellnum') * FLIPTRANSITIONS.delay
          );
        } else if (el.getAttribute('squareColor') == FLIPCOLORS.oColor) {
          return (
            FLIPTRANSITIONS.pause +
            el.getAttribute('cellnum') * FLIPTRANSITIONS.delay * 2 +
            this.cutOther * FLIPTRANSITIONS.delay
          );
        } else {
          return (
            FLIPTRANSITIONS.pause +
            (this.cutD * FLIPTRANSITIONS.delay +
              (FLIPBARLAYOUT.numSquares - el.getAttribute('cellnum') + 1) *
                FLIPTRANSITIONS.delay)
          );
        }
      })
      .style('fill', (d, j, n) => {
        const el = n[j];
        return el.getAttribute('squareColor');
      });
  }

  handleMouseOver() {
    this.flipService.showDistrictInfo(this.data, this.visContainer);
    this.flipService.styleMapOnHover(
      this.data.district,
      this.visContainer,
      'start'
    );
  }

  handleMouseOut() {
    this.flipService.hideDistrictInfo(this.data, this.visContainer);
    this.flipService.styleMapOnHover(
      this.data.district,
      this.visContainer,
      'end'
    );
  }

  initiateDrag(event) {
    this.dragStartVotes = this.isDragged ? this.draggedData : this.data;
    const [x, y] = this.getPointerCoordsOnBar(event);
    const onClickVotes = this.getVotesFromPosition(x, y, this.data);
    this.getStartParty(onClickVotes);
    this.isDragged = true;
  }

  dragChange(event) {
    const [x, y] = this.getPointerCoordsOnBar(event);
    const onDragVoteNum = this.getVotesFromPosition(x, y, this.data);
    this.updateDraggedData(onDragVoteNum);
    this.updateBar();
    this.flipService.updateVisualization(this);
  }

  dragEnd() {
    selectAll('.district-boundary')
      .filter(
        (d, i, nodes: HTMLElement[]) =>
          +nodes[i].getAttribute('district') === this.data.district
      )
      .classed('active-drag', false)
      .classed('active-mouseover', false);

    selectAll('.district-boundary')
      .filter(
        (d, i, nodes: HTMLElement[]) =>
          +nodes[i].getAttribute('district') !== this.data.district
      )
      .classed('active-drag-others', false);
  }

  getPointerCoordsOnBar(event) {
    const x = Math.max(0, Math.min(FLIPBARLAYOUT.width, event.x));
    const y = Math.max(0, Math.min(FLIPBARLAYOUT.height, event.y));
    return [x, y];
  }

  getVotesFromPosition(x: number, y: number, data: DistrictVotes): number {
    const barToVotes = scaleLinear()
      .domain([
        0,
        Math.sqrt(
          Math.pow(FLIPBARLAYOUT.height, 2) + Math.pow(FLIPBARLAYOUT.width, 2)
        ),
      ])
      .range([0, data.totalVotes])
      .clamp(true);

    const hyp = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));

    return barToVotes(hyp);
  }

  getStartParty(onClickVotes: number): void {
    if (this.dragStartVotes.rVotes === this.data.totalVotes) {
      this.dragStartParty = Party.D;
    } else if (this.dragStartVotes.dVotes === this.data.totalVotes) {
      this.dragStartParty = Party.R;
    } else if (onClickVotes <= this.dragStartVotes.rVotes) {
      this.dragStartParty = Party.R;
    } else if (
      onClickVotes > this.dragStartVotes.rVotes &&
      onClickVotes <= this.dragStartVotes.rVotes + this.dragStartVotes.oVotes
    ) {
      this.dragStartParty = Party.O;
    } else if (
      onClickVotes >
      this.dragStartVotes.rVotes + this.dragStartVotes.oVotes
    ) {
      this.dragStartParty = Party.D;
    }
  }

  updateDraggedData(dragVotes: number) {
    let dVotes;
    let rVotes;
    let oVotes;
    const startRVotes =
      this.data.totalVotes -
      (this.dragStartVotes.dVotes + this.dragStartVotes.oVotes);
    const startNonDVotes = this.data.totalVotes - this.dragStartVotes.dVotes;

    if (this.dragStartParty == Party.D) {
      dVotes = this.data.totalVotes - dragVotes;
      if (dragVotes >= startRVotes && dragVotes >= startNonDVotes) {
        rVotes = this.dragStartVotes.rVotes;
        oVotes = this.data.totalVotes - dVotes - rVotes;
      } else if (dragVotes >= startRVotes && dragVotes < startNonDVotes) {
        rVotes = this.dragStartVotes.rVotes;
        oVotes = this.data.totalVotes - dVotes - rVotes;
      } else if (dragVotes < startRVotes) {
        rVotes = dragVotes;
        oVotes = 0;
      }
    } else if (this.dragStartParty == Party.R) {
      rVotes = dragVotes;
      if (dragVotes < startRVotes) {
        dVotes = this.dragStartVotes.dVotes;
        oVotes = this.data.totalVotes - dVotes - rVotes;
      } else if (dragVotes >= startRVotes && dragVotes < startNonDVotes) {
        dVotes = this.dragStartVotes.dVotes;
        oVotes = this.data.totalVotes - dVotes - rVotes;
      } else if (dragVotes >= startRVotes && dragVotes >= startNonDVotes) {
        dVotes = this.data.totalVotes - dragVotes;
        oVotes = 0;
      }
    } else if (this.dragStartParty == Party.O) {
      if (dragVotes < this.dragStartVotes.rVotes) {
        dVotes = this.dragStartVotes.dVotes;
        rVotes = dragVotes;
        oVotes = this.data.totalVotes - dVotes - rVotes;
      } else if (
        dragVotes >= this.dragStartVotes.rVotes &&
        dragVotes < this.dragStartVotes.dVotes
      ) {
        dVotes = this.dragStartVotes.dVotes;
        rVotes = this.dragStartVotes.rVotes;
        oVotes = dragVotes - this.dragStartVotes.rVotes;
      } else if (dragVotes >= this.dragStartVotes.dVotes) {
        dVotes = this.data.totalVotes - dragVotes;
        rVotes = this.dragStartVotes.rVotes;
        oVotes = dragVotes - this.dragStartVotes.rVotes;
      }
    }

    this.draggedData.dVotes = dVotes;
    this.draggedData.rVotes = rVotes;
    this.draggedData.oVotes = oVotes;
    this.draggedData.dPercent = dVotes / this.data.totalVotes;
    this.draggedData.rPercent = rVotes / this.data.totalVotes;
    this.draggedData.oPercent = oVotes / this.data.totalVotes;
  }

  updateBar(): void {
    const cutDBar =
      this.draggedData.dPercent * FLIPBARLAYOUT.rows * FLIPBARLAYOUT.cols;
    const cutRBar =
      (this.draggedData.dPercent + this.draggedData.oPercent) *
      FLIPBARLAYOUT.rows *
      FLIPBARLAYOUT.cols;

    this.svg
      .selectAll('.bar-square')
      .attr('squareColor', (d, i, nodes) => {
        if (nodes[i].getAttribute('cellnum') <= cutDBar) {
          return FLIPCOLORS.dColor;
        } else if (
          nodes[i].getAttribute('cellnum') > cutDBar &&
          nodes[i].getAttribute('cellnum') <= cutRBar
        ) {
          return FLIPCOLORS.oColor;
        } else {
          return FLIPCOLORS.rColor;
        }
      })
      .transition()
      .duration(60)
      .style('fill', (d, i, nodes) => nodes[i].getAttribute('squareColor'));
  }
}
