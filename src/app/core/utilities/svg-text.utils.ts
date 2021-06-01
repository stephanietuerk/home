import { select } from 'd3';

export function wrap(text, config) {
    const { width, lineHeight = 1.1, wrapUp = false } = config;
    text.each(function () {
        const text = select(this);
        const words = text.text().split(' ').reverse();
        let word;
        let line = [];
        let lineNumber = 0;
        const y = this.getAttribute('y');
        const x = this.getAttribute('x');
        const dy = text.attr('dy');
        let tspan = text
            .text(null)
            .append('tspan')
            .attr('x', x)
            .attr('y', y)
            .attr('dy', dy + 'em');
        while ((word = words.pop())) {
            line.push(word);
            tspan.text(line.join(' '));
            if (tspan.node().getComputedTextLength() > width) {
                line.pop();
                tspan.text(line.join(' '));
                line = [word];
                tspan = text
                    .append('tspan')
                    .attr('x', x)
                    .attr('y', y)
                    .attr('dy', ++lineNumber * lineHeight + dy + 'em')
                    .text(word);
            } else {
                tspan.attr('y', y);
            }
        }
        if (wrapUp) {
            text.style('transform', `translate(0, -${lineNumber * lineHeight - lineHeight}em`);
        }
    });
}
