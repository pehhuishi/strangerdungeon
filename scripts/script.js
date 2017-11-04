// Init Vue!
const BASE_URL = 'http://www.dnd5eapi.co/api/classes/'

var app = new Vue({
  el: '#app',
  data: {
    title: 'Stranger Dungeon',
    character: {
      name: 'Loading...',
      hit_die: '0'
    }
  },
  mounted: function() {
    this.randomClass()
  },
  methods: {
    randomClass: _.debounce(
      function () {
        const randomClassId = Math.floor(Math.random() * 13) + 1

        axios.get(BASE_URL + randomClassId)
        .then(response => {
          console.log(response.data);
          this.character = response.data
        })
        .catch(err => {
          console.log(err)
        })
      }
    )
  }
})
