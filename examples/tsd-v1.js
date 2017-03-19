const { h, app } = require('hyperapp')
const hyperx = require('hyperx')
const html = hyperx(h)
const { update, random, defaultMP, T, tdsRules } = require('../')

console.log(tdsRules)
const initial = [T(defaultMP)]

const log = (t, v) => { console.log(t, v); return v }

const Sequence = (seq) => log('joder', html`
  <div class='Sequence'>
    ${seq.map(term => html`
      <div
        style="color: red;"
        className="term term-${term.symbol}">
        ${term.symbol}
      </div>
    `)}
  </diV>
`)

app({
  model: [ initial ],
  actions: {
    generate: (model) => {
      console.log('before', model)
      const last = model[model.length - 1]
      const next = update(tdsRules, random, last)
      model.push(next)
      console.log('after', model)
      return model
    }
  },
  view: (model, actions) => html`
    <div id="app">
      <h1>KulittaJS - tds grammar</h1>
      <button onclick=${(e) => actions.generate()}>Generate!</button>
      <div class="Sequences">
        ${model.map(Sequence)}
      </div>
    </div>
  `
})
