import { select } from 'd3';
import { SvgWrapOptions } from './svg-utilities.model';

export class SvgUtilities {
  static textWrap(textSelection, options: SvgWrapOptions) {
    const { width, maintainXPosition, maintainYPosition, lineHeight } = options;

    textSelection.each((d, i, nodes) => {
      const text = select(nodes[i]);
      const words = text.text().split(/\s+/).reverse();
      let word;
      let line = [];
      let lineNumber = 0;
      const y = parseFloat(text.attr('y')) || 0;
      const x = maintainXPosition ? parseFloat(text.attr('x')) : 0;
      const maxWidth = width + x;
      const dy = parseFloat(text.attr('dy'));
      let tspan = text
        .text(null)
        .append('tspan')
        .attr('x', x)
        .attr('y', y)
        .attr('dy', dy + 'em');
      while ((word = words.pop())) {
        line.push(word);
        tspan.text(line.join(' '));
        if (tspan.node().getComputedTextLength() > maxWidth) {
          line.pop();
          tspan.text(line.join(' '));
          line = [word];
          tspan = text
            .append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', ++lineNumber * lineHeight + dy + 'em')
            .text(word);
        }
      }
      if (maintainYPosition && lineNumber > 0) {
        text.attr('dominant-baseline', 'text-after-edge');
        const lastDy = text
          .selectAll('tspan')
          .filter((d, i, nodes) => i === nodes.length - 1)
          .attr('dy')
          .slice(0, -2);
        const firstDy = text.attr('dy').slice(0, -2);
        const offsetY =
          ((parseFloat(lastDy) - parseFloat(firstDy) - 0.5) / 2) * 16;
        text.selectAll('tspan').attr('y', y - offsetY);
      }
    });
  }
}
