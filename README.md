# vue-i18n-composable

Composition API for `vue-i18n` in Vue 2.x

<a href="https://www.npmjs.com/package/vue-i18n-composable">
<img alt="npm" src="https://img.shields.io/npm/v/vue-i18n-composable">
</a>

## Support Vue version
- `vue-i18n-composable@v1`: `>=2.5 <=2.6`
- `vue-i18n-composable@v2`: `>=2.7 <3`


## Install

```sh
npm i vue-i18n vue-i18n-composable
```

if you use Vue 2.5 - Vue 2.6, you need to install `@vue/composition-api`

```sh
npm i @vue/composition-api
```

## Usage

### For Vue 2.7

```js
// main.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { createI18n } from 'vue-i18n-composable'
import App from './App.vue'

Vue.use(VueI18n)

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

const app = new Vue({
  render: h => h(App),
  i18n,
})

app.mount('#app')
```

In components:

```vue
<template>
  <div>{{ t('language') }}</div>
</template>

<script>
import { defineComponent } from 'vue'
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

### For Vue 2.5 - Vue 2.6

```js
// main.js
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import VueCompositionAPI, { createApp } from '@vue/composition-api'
import { createI18n } from 'vue-i18n-composable'
import App from './App.vue'

Vue.use(VueCompositionAPI)
Vue.use(VueI18n)

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

In components:

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
