// Init Vue!
const API_URL = 'http://www.dnd5eapi.co/api/classes/'
const ASSETS_URL = './imgs/classes'
const BEYOND_URL = 'https://www.dndbeyond.com/characters/classes/'

const Home = {
  props: ['classes'],
  template: `
    <div class="row wrapper">
      <ul>
        <li v-for="cls in classes">
          <a href="#" @click="goToClass(cls.url)">{{ cls.name }}</a>
        </li>
      </ul>
    </div>
  `,
  methods: {
    goToClass: function (url) {
      const classId = /classes\/(\d)/g.exec(url)[1]
      this.$router.push({ path: `/class/${classId}` })
    }
  }
}

const Detail = {
  template: `
    <div class="row wrapper">
      <a href="#" @click="goBack">Back</a>
      Class #{{ $route.params.id }}
    </div>
  `,
  methods: {
    goBack: function () {
      window.history.length > 1
        ? this.$router.go(-2) // hmmmmm
        : this.$router.push('/')
    }
  }
}

const routes = [
  {
    path: '/',
    component: Home
  },
  {
    path: '/class/:id',
    component: Detail
  }
]

const router = new VueRouter({
  routes
})

const app = new Vue({
  router,
  data: {
    title: 'Stranger Dungeon',
    classes: []
  },
  mounted: function () {
    this.retrieveClasses()
  },
  methods: {
    retrieveClasses: function () {
      axios.get(API_URL)
      .then(response => {
        this.classes = response.data.results
      })
      .catch(err => {
        console.error(err)
      })
    }
  }
}).$mount('#app')

// var app = new Vue({
//   el: '#app',
//   data: {
//     title: 'Stranger Dungeon',
//     character: {
//       name: 'Loading...'
//     },
//     equipments: [],
//     readMoreUrl: ''
//   },
//   mounted: function () {
//     this.retriveClass()
//   },
//   watch: {
//     character: function (data) {
//       this.retrieveEquipments(data)
//     }
//   },
//   methods: {
//     retriveClass: _.debounce(
//       function () {
//         // randomize up to 12 because there're only 12 classes in the API
//         const randomClassId = Math.floor(Math.random() * 12) + 1
//
//         axios.get(API_URL + randomClassId)
//         .then(response => {
//           data = response.data
//
//           this.character = data
//           this.character.image = `${ASSETS_URL}/${data.name}.png`
//           this.character.proficiences = data.proficiencies
//
//           this.readMoreUrl = `${BEYOND_URL}${_.lowerCase(data.name)}`
//
//           // change body class per character name
//           document.querySelector('body').classList.add(data.name)
//         })
//         .catch(err => {
//           console.log(err)
//         })
//       }
//     ),
//     retrieveEquipments: _.debounce(
//       function (data) {
//         axios.get(data.starting_equipment.url)
//         .then(response => {
//           data = response.data
//           this.equipments = data.starting_equipment
//         })
//       }
//     )
//   }
// })
