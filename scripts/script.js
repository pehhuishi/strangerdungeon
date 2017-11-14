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
          <a @click="goToClass(cls.url)">{{ cls.name }}</a>
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
  data: function () {
    return {
      character: {},
      equipments: []
    }
  },
  template: `
    <div class="row wrapper">
      <div class="character-hero one-half column">
        <a :href="character.readMoreUrl" target="_blank">
          <h2>{{ character.name }}</h2>
        </a>
        <img :src="character.image" :alt="character.name" width="100%">
        <a class="button button-primary" href="#" @click="goBack">Back</a>
      </div>
      <div class="character-status one-half column">
        <div class="hp attribute">
          <h3>Hit Points</h3>
          <ul>
            <li>Hit Dice: 1d{{ character.hit_die }} per {{ character.name }} level</li>
            <li>HP at 1st Level: {{ character.hit_die }} + your Constitution modifier
            <li>HP at Higher Levels: 1d{{ character.hit_die}} + your Constitution modifier per {{ character.name }} level after 1st</li>
          </ul>
        </div>
        <div class="proficiencies attribute">
          <h3>Proficiencies</h3>
          <ul>
            <li v-for="proficiency in character.proficiences">
              {{ proficiency.name }}
            </li>
          </ul>
        </div>
        <div class="saving-throws attribute">
          <h3>Saves</h3>
          <ul>
            <li v-for="saving_throw in character.saving_throws">
              {{ saving_throw.name }}
            </li>
          </ul>
        </div>
        <a class="button button-primary" :href="character.readMoreUrl" target="_blank">Read more</a>
      </div>
    </div>
  `,
  created () {
    // fetch the data when the view is created and the data is
    // already being observed
    this.retrieveClass(this.$route.params.id)
  },
  watch: {
    character: function (data) {
      this.retrieveEquipments(data)
    }
  },
  methods: {
    goBack: function () {
      window.history.length > 1
        ? this.$router.go(-1)
        : this.$router.push('/')
    },
    retrieveClass: function (classId) {
      axios.get(API_URL + classId)
      .then(response => {
        data = response.data

        this.character = data
        this.character.image = `${ASSETS_URL}/${data.name}.png`
        this.character.proficiences = data.proficiencies
        this.character.readMoreUrl = `${BEYOND_URL}${data.name.toLowerCase()}`

        // change body class per character name
        document.querySelector('body').className = ''
        document.querySelector('body').classList.add(data.name)
      })
      .catch(err => {
        console.log(err)
      })
    },
    retrieveEquipments: function (data) {
      console.log('retrieve equipments')
      // axios.get(data.starting_equipment.url)
      //      .then(response => {
      //     data = response.data
      //     this.equipments = data.starting_equipment
      //   })
      // }
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
