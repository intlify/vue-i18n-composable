import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { computed, getCurrentInstance } from '@vue/composition-api'
import { VueConstructor } from 'vue/types/umd'
import { isBoolean, assign } from '@intlify/shared'
import type { WritableComputedRef } from '@vue/composition-api'
import type {
  I18nOptions,
  ComposerOptions,
  I18n,
  I18nMode
} from '@intlify/vue-i18n-core'

export function createI18n(options: I18nOptions = {}): VueI18n & I18n {
  const legacyMode = isBoolean(options.legacy) ? options.legacy : true
  const i18nMode: I18nMode = legacyMode ? 'legacy' : 'composition'

  const i18n = new VueI18n(
    convertToLegacyI18nOptions(options, i18nMode)
  ) as VueI18n & I18n

  const _i18n = i18n as any
  _i18n.mode = i18nMode
  _i18n.global = _i18n

  return i18n
}

function convertToLegacyI18nOptions(
  options: I18nOptions,
  mode: I18nMode
): VueI18n.I18nOptions {
  let legacyOptions: VueI18n.I18nOptions = {}
  legacyOptions.locale = options.locale
  legacyOptions.fallbackLocale = options.fallbackLocale
  legacyOptions.messages = options.messages
  legacyOptions.dateTimeFormats = options.datetimeFormats // from vue-i18n@v9.x
  legacyOptions.numberFormats = options.numberFormats
  legacyOptions.missing = options.missing
  legacyOptions.modifiers = options.modifiers as VueI18n.Modifiers
  legacyOptions.fallbackRoot = options.fallbackRoot

  if (mode === 'legacy') {
    legacyOptions = assign(legacyOptions, options)
  } else {
    // convert from composer options
    const composerOptions = options as ComposerOptions
    legacyOptions.sync = composerOptions.inheritLocale

    legacyOptions.silentFallbackWarn = isBoolean(composerOptions.fallbackWarn)
      ? !composerOptions.fallbackWarn
      : composerOptions.fallbackWarn
    legacyOptions.silentTranslationWarn = isBoolean(composerOptions.missingWarn)
      ? !composerOptions.missingWarn
      : composerOptions.missingWarn
    // prettier-ignore
    legacyOptions.formatFallbackMessages = isBoolean(composerOptions.fallbackFormat)
      ? !composerOptions.fallbackFormat
      : composerOptions.fallbackFormat
    legacyOptions.pluralizationRules = composerOptions.pluralRules
    legacyOptions.warnHtmlInMessage = isBoolean(composerOptions.warnHtmlMessage)
      ? composerOptions.warnHtmlMessage
        ? 'warn'
        : 'off'
      : 'off'
    legacyOptions.postTranslation =
      composerOptions.postTranslation as VueI18n.PostTranslationHandler
    legacyOptions.escapeParameterHtml = composerOptions.escapeParameter
  }

  return legacyOptions
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
  const instance = getCurrentInstance()
  const vm =
    instance?.proxy ||
    (instance as unknown as InstanceType<VueConstructor>) ||
    new Vue({})

  const i18n = vm.$i18n as VueI18n & I18n
  if (!i18n) throw new Error('vue-i18n not initialized')

  const locale = computed({
    get() {
      return i18n.locale
    },
    set(v: string) {
      i18n.locale = v
    }
  })

  return {
    locale,
    t: vm.$t.bind(vm),
    tc: vm.$tc.bind(vm),
    d: vm.$d.bind(vm),
    te: vm.$te.bind(vm),
    n: vm.$n.bind(vm)
  }
}
