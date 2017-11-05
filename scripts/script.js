// Init Vue!
const API_URL = 'http://www.dnd5eapi.co/api/classes/'
const ASSETS_URL = './imgs/classes'

var app = new Vue({
  el: '#app',
  data: {
    title: 'Stranger Dungeon',
    character: {
      name: 'Loading...',
    }
  },
  mounted: function() {
    this.randomClass()
  },
  methods: {
    randomClass: _.debounce(
      function () {
        // randomize up to 12 because there're only 12 classes in the API
        const randomClassId = Math.floor(Math.random() * 12) + 1

        axios.get(API_URL + randomClassId)
        .then(response => {
          data = response.data
          this.character = data

          this.character.image = `${ASSETS_URL}/${data.name}.png`
        })
        .catch(err => {
          console.log(err)
        })
      }
    )
  }
})
