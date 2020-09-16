import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { computed } from '@vue/composition-api'

export function createI18n(options?: VueI18n.I18nOptions) {
  const i18n = new VueI18n(options)

  const vm = new Vue({
    i18n,
  })

  const locale = computed({
    get() {
      return i18n.locale
    },
    set(v: string) {
      i18n.locale = v
    },
  })

  return () => ({
    locale,
    t: vm.$t.bind(vm),
    tc: vm.$tc.bind(vm),
    d: vm.$d.bind(vm),
    te: vm.$te.bind(vm),
  })
}
