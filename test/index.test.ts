/**
 * @jest-environment jsdom
 */
import CompositionAPI, { nextTick } from '@vue/composition-api'
import { createLocalVue, mount } from '@vue/test-utils'
import Vue from 'vue'
import VueI18n from 'vue-i18n'
import { createI18n, useI18n } from '../src/index'

let localVue

beforeEach(() => {
  localVue = createLocalVue()
  // @ts-ignore
  localVue.use(VueI18n, { composition: true })
})

afterEach(() => {
  localVue = null
})

describe('createI18n', () => {
  describe('legacy mode', () => {
    test('basic', () => {
      const i18n = createI18n({
        legacy: true,
        locale: 'en-US',
        fallbackLocale: 'en-US',
        messages: {
          'en-US': { hello: 'Hello' },
          'ja-JP': { hello: 'こんにちは' }
        },
        datetimeFormats: {
          'en-US': {
            short: {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'America/New_York'
            }
          },
          'ja-JP': {
            long: {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              timeZone: 'Asia/Tokyo'
            },
            short: {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Asia/Tokyo'
            }
          }
        },
        numberFormats: {
          'en-US': {
            currency: {
              style: 'currency',
              currency: 'USD',
              currencyDisplay: 'symbol'
            },
            decimal: {
              style: 'decimal',
              useGrouping: false
            }
          },
          'ja-JP': {
            currency: {
              style: 'currency',
              currency: 'JPY'
            },
            numeric: {
              style: 'decimal',
              useGrouping: false
            },
            percent: {
              style: 'percent',
              useGrouping: false
            }
          }
        }
      })
      expect(i18n.global).toEqual(i18n) // back-port from vue-i18n-next
      expect(i18n.mode).toEqual('legacy') // back-port from vue-i18n-next
      expect(i18n.locale).toEqual('en-US')
      expect(i18n.fallbackLocale).toEqual('en-US')
      expect(i18n.t('hello')).toEqual('Hello')
      expect(
        i18n.d(new Date(Date.UTC(2012, 11, 20, 3, 0, 0)), 'short', 'ja-JP')
      ).toEqual('2012/12/20 12:00')
      expect(i18n.n(0.99, 'percent', 'ja-JP')).toEqual('99%')
    })

    test('legacy default value', () => {
      const i18n = createI18n({ legacy: true })
      expect(i18n.locale).toEqual('en-US')
      expect(i18n.fallbackLocale).toEqual('en-US')
      expect(i18n.messages).toEqual({})
      expect(i18n.dateTimeFormats).toEqual({})
      expect(i18n.numberFormats).toEqual({})
      expect(i18n.missing).toEqual(null)
      expect(i18n.pluralizationRules).toEqual({})
      expect(i18n.postTranslation).toEqual(null)
      expect(i18n.preserveDirectiveContent).toEqual(false)
      expect(i18n.silentFallbackWarn).toEqual(false)
      expect(i18n.silentTranslationWarn).toEqual(false)
      expect(i18n.formatFallbackMessages).toEqual(false)
      expect(i18n.warnHtmlInMessage).toEqual('off')
      expect((i18n as any)._escapeParameterHtml).toEqual(false)
      expect((i18n as any)._modifiers).toEqual({})
      expect((i18n as any)._componentInstanceCreatedListener).toEqual(null)
    })
  })

  describe('composition mode', () => {
    test.todo('basic')

    test('composition default value', () => {
      const i18n = createI18n({ legacy: false })
      expect(i18n.locale).toEqual('en-US')
      expect(i18n.fallbackLocale).toEqual('en-US')
      expect(i18n.messages).toEqual({})
      expect(i18n.dateTimeFormats).toEqual({})
      expect(i18n.numberFormats).toEqual({})
      expect(i18n.missing).toEqual(null)
      expect(i18n.pluralizationRules).toEqual({})
      expect(i18n.postTranslation).toEqual(null)
      expect(i18n.preserveDirectiveContent).toEqual(false)
      expect(i18n.silentFallbackWarn).toEqual(false)
      expect(i18n.silentTranslationWarn).toEqual(false)
      expect(i18n.formatFallbackMessages).toEqual(false)
      expect(i18n.warnHtmlInMessage).toEqual('off')
      expect((i18n as any)._escapeParameterHtml).toEqual(false)
      expect((i18n as any)._modifiers).toEqual({})
      expect((i18n as any)._componentInstanceCreatedListener).toEqual(null)
    })

    test('composition specify value', () => {
      const pluralRules = { en: () => 0 }
      const i18n = createI18n({
        legacy: false,
        inheritLocale: false,
        fallbackWarn: true,
        missingWarn: true,
        fallbackFormat: true,
        warnHtmlMessage: true,
        pluralRules
      })
      expect(i18n.pluralizationRules).toEqual(pluralRules)
      expect(i18n.silentFallbackWarn).toEqual(false)
      expect(i18n.silentTranslationWarn).toEqual(false)
      expect(i18n.formatFallbackMessages).toEqual(false)
      expect(i18n.warnHtmlInMessage).toEqual('warn')
      expect((i18n as any)._sync).toEqual(false)
    })
  })
})

/*
test('useI18n', async () => {
  const localVue = createLocalVue()
  localVue.use(CompositionAPI)
  const i18n = createI18n(
    {
      locale: 'en',
      fallbackLocale: 'en',
      messages: {
        en: { hello: 'Hello' },
        ja: { hello: 'こんにちは' }
      }
    },
    localVue
  )

  const wrapper = mount(
    {
      template: `<p>{{ t('hello') }}</p>`,
      setup() {
        const { t } = useI18n()
        return { t }
      }
    },
    { i18n }
  )

  await nextTick()
  expect(wrapper.text()).toEqual('Hello')
})
*/

/*
test('mount', async () => {
  const localVue = createLocalVue()
  localVue.use(VueI18n)

  const i18n = new VueI18n({
    locale: 'en',
    messages: {
      en: { hello: 'hello' },
      ja: { hello: 'こんにちは' }
    }
  })

  const wrapper = mount(
    {
      template: `<p>{{ $t('hello') }}</p>`
    },
    { localVue, i18n }
  )

  await Vue.nextTick()
  expect(wrapper.text()).toEqual('hello')
})
*/
