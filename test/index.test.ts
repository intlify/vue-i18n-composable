/**
 * @jest-environment jsdom
 */
import { createLocalVue, mount } from '@vue/test-utils'
import VueI18n from 'vue-i18n'
import { nextTick } from 'vue'
import { createI18n, useI18n } from '../src/index'

const container = document.createElement('div')
document.body.appendChild(container)

beforeEach(() => {
  container.innerHTML = ''
})

test('createI18n', () => {
  const localVue = createLocalVue()
  localVue.use(VueI18n)
  const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: { hello: 'Hello' },
      ja: { hello: 'こんにちは' }
    }
  })
  expect(i18n.locale).toBe('en')
  expect(i18n.fallbackLocale).toBe('en')
  expect(i18n.t('hello')).toBe('Hello')
})

test('useI18n', async () => {
  const localVue = createLocalVue()
  localVue.use(VueI18n)
  const i18n = createI18n({
    locale: 'en',
    fallbackLocale: 'en',
    messages: {
      en: { hello: 'Hello' },
      ja: { hello: 'こんにちは' }
    }
  })

  const wrapper = mount(
    {
      template: `<p>{{ t('hello') }}</p>`,
      setup() {
        const { t } = useI18n()
        return { t }
      }
    },
    { localVue, i18n }
  )

  await nextTick()
  expect(wrapper.text()).toEqual('Hello')
})
