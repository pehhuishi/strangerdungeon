// Init Vue!
const API_URL = 'https://www.dnd5eapi.co/api/classes/'
const ASSETS_URL = './imgs/classes'
const BEYOND_URL = 'https://www.dndbeyond.com/characters/classes/'

// Home component
const Home = {
  props: ['classes'],
  template: `
    <div class="row wrapper">
      <div v-for="cls in classes"
           :class="['one-half', 'column', 'character-column', cls.name]"
           @click="goToClass(cls.url)">
        <span>{{ cls.name }}</span>
      </div>
    </div>
  `,
  methods: {
    goToClass: function (url) {
      const classId = /classes\/((\d){1,2})/g.exec(url)[1] // derive class id by the class api endpoint
      this.$router.push({ path: `/class/${classId}` })
    }
  }
}

// Details component
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
        <div class="equipments attribute">
          <h3>Starting Equipment</h3>
          <p v-if="equipments.length === 0">None</p>
          <ul>
            <li v-for="equipment in equipments">
              {{ equipment.quantity }} {{ equipment.item.name }}
            </li>
          </ul>
        </div>
        <a class="button button-primary" :href="character.readMoreUrl" target="_blank">Read more</a>
      </div>
      <div class="side-navi u-full-width">
        <a @click="prevClass">
          <i class="fa fa-4x fa-angle-left"></i>
        </a>
        <a @click="nextClass">
          <i class="fa fa-4x fa-angle-right"></i>
        </a>
      </div>
    </div>
  `,
  created () {
    this.retrieveClass(this.$route.params.id)
  },
  watch: {
    character: function (data) {
      this.retrieveEquipments(data)
    }
  },
  beforeRouteUpdate (to, from, next) {
    this.retrieveClass(to.params.id)
    next()
  },
  methods: {
    goBack: function () {
      this.$router.push('/')
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
      axios.get(data.starting_equipment.url)
           .then(response => {
             data = response.data
             this.equipments = data.starting_equipment
           })
           .catch(err => {
             console.log(err)
           })
    },
    prevClass: function () {
      let prevParam = this.$route.params.id === '1' ? 12 : parseInt(this.$route.params.id) - 1
      this.$router.push({ path: `/class/${prevParam}` })
    },
    nextClass: function () {
      let nextParam = this.$route.params.id === '12' ? 1 : parseInt(this.$route.params.id) + 1
      this.$router.push({ path: `/class/${nextParam}` })
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

const app = new Vue({
  router: new VueRouter({
    routes
  }),
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
