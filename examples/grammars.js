/* global d3 */
const { update, random, defaultMP, I, rRules } = require('../')

const initial = [ I(defaultMP) ]
const model = [ initial ]

console.log(initial, rRules)
const generate = () => {
  const last = model[model.length - 1]
  const next = update(rRules, random, last)
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
        .text(d => d.symbol)
}

window.onclick = () => {
  generate()
  paint()
}

paint()
