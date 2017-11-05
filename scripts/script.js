// Init Vue!
const API_URL = 'http://www.dnd5eapi.co/api/classes/'
const ASSETS_URL = './imgs/classes'

var app = new Vue({
  el: '#app',
  data: {
    title: 'Stranger Dungeon',
    character: {
      name: 'Loading...'
    }
  },
  mounted: function () {
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
          // console.log(data, data.starting_equipment)

          this.character = data

          this.character.image = `${ASSETS_URL}/${data.name}.png`
          this.character.proficiences = data.proficiencies
          this.character.saving_throws = data.saving_throws

          // change body class per character name
          document.querySelector('body').classList.add(data.name)

          // TODO: refactor this
          // this.retrieveEquipments(data.starting_equipment)
        })
        .catch(err => {
          console.log(err)
        })
      }
    ),
    retrieveEquipments: _.debounce(
      function (eqObj) {
        axios.get(eqObj.url)
        .then(response => {
          data = response.data
          this.character.equipments = data.starting_equipment
          console.log(data)
        })
      }
    )
  }
})
