/**
 * TODO: Split the layout into components
 */

// register the grid component
Vue.component('page-head', {
  template: '#page-head'
})

Vue.component('grid', {
  template: '#grid',
  props: ['colors']
})
