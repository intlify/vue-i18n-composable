<template>
  <div id="app">
    <button @click="locale = locale === 'ja' ? 'en' : 'ja'">Toggle Language</button>
    <h2>localize with slot contents:</h2>
    <i18n tag="p" class="name" path="message.named">
      <template #name>
        <span>kazupon</span>
      </template>
    </i18n>

    <h2>localize with DOM contents:</h2>
    <i18n path="message.list" locale="en">
      <span class="lang"
        >{{ t('message.language', {}, { locale: 'en' }) }}</span
      >
    </i18n>

    <h2>localize with using linked:</h2>
    <i18n path="message.linked">
      <template #name>
        <span>かずぽん</span>
      </template>
    </i18n>

    <h2>localize with using plural:</h2>
    <form>
      <label>{{ t('message.quantity', {}, { locale: 'en' }) }}</label>
      <select v-model="count">
        <option value="0">0</option>
        <option value="1">1</option>
        <option value="2">2</option>
      </select>
    </form>
    <i18n path="message.plural" locale="en" :plural="count">
      <template #n>
        <b>{{ count }}</b>
      </template>
    </i18n>
  </div>
</template>a

<script>
import { defineComponent } from '@vue/composition-api'
import { useI18n } from 'vue-i18n-composable'

export default defineComponent({
  setup() {
    return {
      count: 0,
      ...useI18n(),
    }
  }
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
