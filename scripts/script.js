// Init Vue!
const API_URL = 'http://www.dnd5eapi.co/api/classes/'
const ASSETS_URL = './imgs/classes'
const BEYOND_URL = 'https://www.dndbeyond.com/characters/classes/'

var app = new Vue({
  el: '#app',
  data: {
    title: 'Stranger Dungeon',
    character: {
      name: 'Loading...'
    },
    equipments: [],
    readMoreUrl: ''
  },
  mounted: function () {
    this.retriveClass()
  },
  watch: {
    character: function (data) {
      this.retrieveEquipments(data)
    }
  },
  methods: {
    retriveClass: _.debounce(
      function () {
        // randomize up to 12 because there're only 12 classes in the API
        const randomClassId = Math.floor(Math.random() * 12) + 1

        axios.get(API_URL + randomClassId)
        .then(response => {
          data = response.data

          this.character = data
          this.character.image = `${ASSETS_URL}/${data.name}.png`
          this.character.proficiences = data.proficiencies

          this.readMoreUrl = `${BEYOND_URL}${_.lowerCase(data.name)}`

          // change body class per character name
          document.querySelector('body').classList.add(data.name)
        })
        .catch(err => {
          console.log(err)
        })
      }
    ),
    retrieveEquipments: _.debounce(
      function (data) {
        axios.get(data.starting_equipment.url)
        .then(response => {
          data = response.data
          this.equipments = data.starting_equipment
        })
      }
    )
  }
})
