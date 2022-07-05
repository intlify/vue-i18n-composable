# vue-i18n-composable

Composition API for `vue-i18n` in Vue 2.x

<a href="https://www.npmjs.com/package/vue-i18n-composable">
<img alt="npm" src="https://img.shields.io/npm/v/vue-i18n-composable">
</a>

## Support Vue version
- `vue-i18n-composable@v1`: `>=2.5 <=2.6`

## Install

<pre>
npm i vue-i18n <b>vue-i18n-composable</b> @vue/composition-api
</pre>

## Usage

```js
// main.js
import Vue from 'vue'
import VueCompositionAPI, { createApp } from '@vue/composition-api'
import { createI18n } from 'vue-i18n-composable'
import App from './App.vue'

Vue.use(VueCompositionAPI)

const i18n = createI18n({
  locale: 'ja',
  messages: {
    en: {
      language: 'English',
    },
    ja: {
      language: '日本語',
    },
  },
})

const app = createApp({
  render: h => h(App),
  i18n,
})

app.mount('#app')
```

In components

```vue
<template>
  <div>{{ t('language') }}</div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-composable'

export default defineComponent({
  setup() {
    return {
      ...useI18n()
    }
  }
})
</script>
```


## 📄 License

[MIT License](https://github.com/intlify/vue-i18n-composable/blob/master/LICENSE) © 2020 [Anthony Fu](https://github.com/antfu)
