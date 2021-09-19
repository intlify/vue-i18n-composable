import VueI18n from 'vue-i18n'
import { computed, getCurrentInstance } from '@vue/composition-api'
import { isBoolean, isObject, isEmptyObject, assign } from '@intlify/shared'
import type { ComponentInternalInstance } from '@vue/composition-api'
import type {
  I18nOptions,
  ComposerOptions,
  Locale,
  I18n,
  I18nMode,
  I18nScope,
  UseI18nOptions,
  Composer,
  VueI18n as LegacyVueI18n,
  LocaleParams,
  SchemaParams,
  DefaultLocaleMessageSchema,
  VueMessageType
} from '@intlify/vue-i18n-core'
import { getLocaleMessages } from './composer'

declare module 'vue/types/vue' {
  interface Vue {
    readonly $i18n: VueI18n & I18n
  }
}

export interface I18nInternal<
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {},
  OptionLocale = Locale
> {
  __instances: Map<
    ComponentInternalInstance,
    | LegacyVueI18n<Messages, DateTimeFormats, NumberFormats, OptionLocale>
    | Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>
  >
  __getInstance<
    Instance extends
      | LegacyVueI18n<Messages, DateTimeFormats, NumberFormats, OptionLocale>
      | Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>
  >(
    component: ComponentInternalInstance
  ): Instance | null
  __setInstance<
    Instance extends
      | LegacyVueI18n<Messages, DateTimeFormats, NumberFormats, OptionLocale>
      | Composer<Messages, DateTimeFormats, NumberFormats, OptionLocale>
  >(
    component: ComponentInternalInstance,
    instance: Instance
  ): void
  __deleteInstance(component: ComponentInternalInstance): void
}

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

export function useI18n<Options extends UseI18nOptions = UseI18nOptions>(
  options?: Options
): Composer<
  NonNullable<Options['messages']>,
  NonNullable<Options['datetimeFormats']>,
  NonNullable<Options['numberFormats']>,
  NonNullable<Options['locale']>
>

export function useI18n<
  Schema = DefaultLocaleMessageSchema,
  Locales = 'en-US',
  Options extends UseI18nOptions<
    SchemaParams<Schema, VueMessageType>,
    LocaleParams<Locales>
  > = UseI18nOptions<
    SchemaParams<Schema, VueMessageType>,
    LocaleParams<Locales>
  >
>(
  options?: Options
): Composer<
  NonNullable<Options['messages']>,
  NonNullable<Options['datetimeFormats']>,
  NonNullable<Options['numberFormats']>,
  NonNullable<Options['locale']>
>

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function useI18n<
  Options extends UseI18nOptions = UseI18nOptions,
  Messages = NonNullable<Options['messages']>,
  DateTimeFormats = NonNullable<Options['datetimeFormats']>,
  NumberFormats = NonNullable<Options['numberFormats']>,
  OptionLocale = NonNullable<Options['locale']>
>(options: Options = {} as Options) {
  const instance = getCurrentInstance()
  // TODO:
  if (instance == null) throw new Error('error')

  const vm = instance.proxy
  const i18n = vm.$root.$i18n
  // TODO:
  if (!i18n) throw new Error('vue-i18n not initialized')
  // TODO:
  if (i18n.mode === 'legacy') throw new Error('vue-i18n is in legacy mode')

  const global = vm.$root.$i18n.global

  // prettier-ignore
  const scope: I18nScope = isEmptyObject(options)
    ? ('__i18n' in vm.$options)
      ? 'local'
      : 'global'
    : !options.useScope
      ? 'local'
      : options.useScope

  if (scope === 'global') {
    let messages = isObject(options.messages) ? options.messages : {}
    if ('__i18nGlobal' in vm.$options) {
      messages = getLocaleMessages(global.locale.value as Locale, {
        messages,
        __i18n: (vm.$options as any).__i18nGlobal
      })
    }
    // merge locale messages
    const locales = Object.keys(messages)
    if (locales.length) {
      locales.forEach(locale => {
        global.mergeLocaleMessage(locale, messages[locale])
      })
    }

    // merge datetime formats
    if (isObject(options.datetimeFormats)) {
      const locales = Object.keys(options.datetimeFormats)
      if (locales.length) {
        locales.forEach(locale => {
          global.mergeDateTimeFormat(locale, options.datetimeFormats![locale])
        })
      }
    }
    // merge number formats
    if (isObject(options.numberFormats)) {
      const locales = Object.keys(options.numberFormats)
      if (locales.length) {
        locales.forEach(locale => {
          global.mergeNumberFormat(locale, options.numberFormats![locale])
        })
      }
    }

    return global as Composer<
      Messages,
      DateTimeFormats,
      NumberFormats,
      OptionLocale
    >
  }

  const locale = computed({
    get() {
      return global.locale
    },
    set(v: string) {
      global.locale = v
    }
  })

  return {
    locale
    // t: vm.$t.bind(vm),
    // tc: vm.$tc.bind(vm),
    // d: vm.$d.bind(vm),
    // te: vm.$te.bind(vm),
    // n: vm.$n.bind(vm)
  } as unknown as Composer<
    Messages,
    DateTimeFormats,
    NumberFormats,
    OptionLocale
  >
}
