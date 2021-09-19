import { computed, watch } from '@vue/composition-api'
import VueI18n from 'vue-i18n'
import {
  isBoolean,
  isPlainObject,
  isFunction,
  isArray,
  isObject,
  isString,
  isRegExp,
  hasOwn
} from '@intlify/shared'
import type {
  Locale,
  FallbackLocale,
  VueMessageType,
  LocaleMessages,
  LocaleMessage,
  IntlDateTimeFormats as DateTimeFormatsType,
  IntlNumberFormats as NumberFormatsType,
  Composer,
  CustomBlocks
} from '@intlify/vue-i18n-core'
import type { I18nOptions } from 'vue-i18n'

const DEFAULT_LOCALE = 'en-US'
let composerID = 0

export interface ComposerInternalOptions<
  Messages = {},
  DateTimeFormats = {},
  NumberFormats = {}
> {
  __i18n?: CustomBlocks<VueMessageType>
  __i18nGlobal?: CustomBlocks<VueMessageType>
  __root?: Composer<Messages, DateTimeFormats, NumberFormats>
  __rootVM?: any
}

type GetLocaleMessagesOptions<Messages = {}> = {
  messages?: { [K in keyof Messages]: Messages[K] }
  __i18n?: CustomBlocks<VueMessageType>
  // messageResolver?: MessageResolver
  // flatJson?: boolean
}

export function getLocaleMessages<Messages = {}>(
  locale: Locale,
  options: GetLocaleMessagesOptions<Messages>
): { [K in keyof Messages]: Messages[K] } {
  const { messages, __i18n } = options

  // prettier-ignore
  const ret = isPlainObject(messages)
    ? messages
    : isArray(__i18n)
      ? {}
      : { [locale]: {} }

  // merge locale messages of i18n custom block
  if (isArray(__i18n)) {
    __i18n.forEach(({ locale, resource }) => {
      if (locale) {
        ret[locale] = ret[locale] || {}
        deepCopy(resource, ret[locale])
      } else {
        deepCopy(resource, ret)
      }
    })
  }

  return ret as { [K in keyof Messages]: Messages[K] }
}

const isNotObjectOrIsArray = (val: unknown) => !isObject(val) || isArray(val)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function deepCopy(src: any, des: any): void {
  // src and des should both be objects, and non of then can be a array
  if (isNotObjectOrIsArray(src) || isNotObjectOrIsArray(des)) {
    // TODO
    throw new Error('ss')
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const key in src) {
    if (hasOwn(src, key)) {
      if (isNotObjectOrIsArray(src[key]) || isNotObjectOrIsArray(des[key])) {
        // replace with src[key] when:
        // src[key] or des[key] is not a object, or
        // src[key] or des[key] is a array
        des[key] = src[key]
      } else {
        // src[key] and des[key] are both object, merge them
        deepCopy(src[key], des[key])
      }
    }
  }
}

export function createComposer(options: any = {}): any {
  type Message = VueMessageType
  const { __root, __rootVM } = options as ComposerInternalOptions<
    LocaleMessages<LocaleMessage<Message>>,
    DateTimeFormatsType,
    NumberFormatsType
  >
  const _isGlobal = __root === undefined

  const _inheritLocale = isBoolean(options.inheritLocale)
    ? options.inheritLocale
    : true

  // prettier-ignore
  const _locale = __root && _inheritLocale
    ? __root.locale.value
    : isString(options.locale)
      ? options.locale
      : DEFAULT_LOCALE

  // prettier-ignore
  const _fallbackLocale =
    __root && _inheritLocale
      ? __root.fallbackLocale.value
      : isString(options.fallbackLocale) ||
        isArray(options.fallbackLocale) ||
        isPlainObject(options.fallbackLocale) ||
        options.fallbackLocale === false
        ? options.fallbackLocale
        : _locale

  const _messages = getLocaleMessages<LocaleMessages<LocaleMessage<Message>>>(
    _locale,
    options
  )

  // prettier-ignore
  const _datetimeFormats = isPlainObject(options.datetimeFormats)
    ? options.datetimeFormats
    : { [_locale]: {} }

  // prettier-ignore
  const _numberFormats = isPlainObject(options.numberFormats)
    ? options.numberFormats
    : { [_locale]: {} }

  // prettier-ignore
  const _missingWarn = __root
    ? __root.missingWarn
    : isBoolean(options.missingWarn) || isRegExp(options.missingWarn)
      ? options.missingWarn
      : true

  // prettier-ignore
  const _fallbackWarn = __root
    ? __root.fallbackWarn
    : isBoolean(options.fallbackWarn) || isRegExp(options.fallbackWarn)
      ? options.fallbackWarn
      : true

  // prettier-ignore
  const _fallbackRoot = __root
    ? __root.fallbackRoot
    : isBoolean(options.fallbackRoot)
      ? options.fallbackRoot
      : true

  const _fallbackFormat = !!options.fallbackFormat

  const _missing = isFunction(options.missing) ? options.missing : null

  const _postTranslation = isFunction(options.postTranslation)
    ? options.postTranslation
    : null

  const _warnHtmlMessage = isBoolean(options.warnHtmlMessage)
    ? options.warnHtmlMessage
    : true

  const _escapeParameter = !!options.escapeParameter

  // prettier-ignore
  const _modifiers = __root
    ? __root.modifiers
    : isPlainObject(options.modifiers)
      ? options.modifiers
      : {}

  const _pluralRules = options.pluralRules || (__root && __root.pluralRules)

  const legacyOptions: I18nOptions = {
    locale: _locale,
    fallbackLocale: _fallbackLocale,
    messages: _messages,
    dateTimeFormats: _datetimeFormats,
    numberFormats: _numberFormats,
    modifiers: _modifiers,
    missing: _missing,
    fallbackRoot: _fallbackRoot,
    postTranslation: _postTranslation,
    pluralizationRules: _pluralRules,
    escapeParameterHtml: _escapeParameter,
    sync: _inheritLocale,
    silentFallbackWarn: isBoolean(_fallbackWarn)
      ? !_fallbackWarn
      : _fallbackWarn,
    silentTranslationWarn: isBoolean(_missingWarn)
      ? !_missingWarn
      : _missingWarn,
    formatFallbackMessages: isBoolean(_fallbackFormat)
      ? !_fallbackFormat
      : _fallbackFormat,
    warnHtmlInMessage: isBoolean(_warnHtmlMessage)
      ? _warnHtmlMessage
        ? 'warn'
        : 'off'
      : 'off'
  }
  if (__rootVM) {
    ;(legacyOptions as any).root = __rootVM
  }

  const _legacy = new VueI18n(legacyOptions)

  // track reactivity
  function trackReactivityValues() {
    // TODO:
    return [
      _legacy.locale,
      _legacy.fallbackLocale,
      _legacy.messages,
      _legacy.dateTimeFormats,
      _legacy.numberFormats
    ]
  }

  // locale
  const locale = computed({
    get: () => _legacy.locale,
    set: val => {
      _legacy.locale = val
    }
  })

  // fallbackLocale
  const fallbackLocale = computed({
    get: () => _legacy.fallbackLocale,
    set: val => {
      _legacy.fallbackLocale = val
    }
  })

  // messages
  const messages = computed<LocaleMessages<LocaleMessage<Message>, Message>>(
    () => _legacy.messages
  )

  // datetimeFormats
  const datetimeFormats = computed<DateTimeFormatsType>(
    () => _legacy.dateTimeFormats
  )

  // numberFormats
  const numberFormats = computed<NumberFormatsType>(() => _legacy.numberFormats)

  function t(...args: unknown[]): string {
    return Reflect.apply(_legacy.t, _legacy, [...args]) as string
  }

  // for debug
  composerID++

  // watch root locale & fallbackLocale
  if (__root) {
    watch(__root.locale, (val: Locale) => {
      if (_inheritLocale) {
        _legacy.locale = val
      }
    })
    watch(__root.fallbackLocale, (val: FallbackLocale) => {
      if (_inheritLocale) {
        _legacy.fallbackLocale = val
      }
    })
  }

  const composer = {
    id: composerID,
    locale,
    fallbackLocale,
    get inheritLocale(): boolean {
      return _inheritLocale
    },
    set inheritLocale(val: boolean) {
      ;(_legacy as any)._sync = val
      if (val && __root) {
        _legacy.locale = __root.locale.value as Locale
        _legacy.fallbackLocale = __root.fallbackLocale.value
      }
    },
    get availableLocales(): Locale[] {
      return Object.keys(_legacy.messages).sort()
    },
    messages,
    datetimeFormats,
    numberFormats,
    t
  }

  return composer
}
