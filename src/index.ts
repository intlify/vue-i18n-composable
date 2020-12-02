import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { computed, getCurrentInstance, WritableComputedRef } from '@vue/composition-api'
import { VueConstructor } from 'vue/types/umd'

let i18nInstance: VueI18n | undefined

export function createI18n(options?: VueI18n.I18nOptions, vue: VueConstructor = Vue): VueI18n {
  vue.use(VueI18n)
  i18nInstance = new VueI18n(options)

  return i18nInstance
}

export interface Composer {
  locale: WritableComputedRef<string>
  t: typeof VueI18n.prototype.t
  tc: typeof VueI18n.prototype.tc
  te: typeof VueI18n.prototype.te
  d: typeof VueI18n.prototype.d
  n: typeof VueI18n.prototype.n
}

export function useI18n(): Composer {
  if (!i18nInstance)
    throw new Error('vue-i18n not initialized')

  const i18n = i18nInstance

  const vm = getCurrentInstance() || new Vue({})

  const locale = computed({
    get() {
      return i18n.locale
    },
    set(v: string) {
      i18n.locale = v
    },
  })

  return {
    locale,
    t: vm.$t.bind(vm),
    tc: vm.$tc.bind(vm),
    d: vm.$d.bind(vm),
    te: vm.$te.bind(vm),
    n: vm.$n.bind(vm),
  }
}
