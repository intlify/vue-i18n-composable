import Vue from 'vue'
import VueCompositionAPI, { createApp } from '@vue/composition-api'
import VueI18n from "vue-i18n"
import { createI18n } from 'vue-i18n-composable'
import App from './App.vue'

Vue.use(VueCompositionAPI)
Vue.use(VueI18n)

const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: {
      message: {
        language: 'English',
        quantity: 'Quantity',
        list: 'hello, {0}!',
        named: 'hello, {name}!',
        linked: '@:message.named How are you?',
        plural: 'no bananas | {n} banana | {n} bananas'
      }
    },
    ja: {
      message: {
        language: '日本語',
        list: 'こんにちは、{0}！',
        named: 'こんにちは、{name}！',
        linked: '@:message.named ごきげんいかが？'
      }
    }
  }
})

const app = createApp({
  i18n,
  render: h => h(App)
})

app.mount('#app')
