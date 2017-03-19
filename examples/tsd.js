/* global d3 */
const { update, random, defaultMP, T, tdsRules } = require('../')

const initial = [T(defaultMP)]
const model = [ initial ]

const generate = () => {
  const last = model[model.length - 1]
  const next = update(tdsRules, random, last)
  model.push(next)
}

const paint = () => {
  d3.select('#sequences')
    .selectAll('div')
    .data(model)
    .enter().append('div')
      .classed('Sequence', true)
      .selectAll('span')
      .data((d) => d)
      .enter().append('span')
        .attr('class', d => 'term term-' + d.symbol)
        .style('width', d => '' + 100 * d.param.dur + '%')
        .text(' ')
}

window.onclick = () => {
  generate()
  paint()
}

paint()
