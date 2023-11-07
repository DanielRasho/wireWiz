import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import vueClickOutsideElement from 'vue-click-outside-element'
import Matter from 'matter-js'
import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(vueClickOutsideElement)
app.use(Matter)

app.mount('#app')
