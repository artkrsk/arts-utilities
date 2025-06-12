import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { ElementorSettingsHandler } from '../../../src/ts/core/elementor/ElementorSettingsHandler'
import type { IElementorSettingChangedEvent } from '../../../src/ts/core/interfaces'
import type { TSettingsChangeCallback } from '../../../src/ts/core/types'

// Mock the EditorUtils module
vi.mock('../../../src/ts/core/elementor/EditorUtils', () => ({
  getLiveSettings: vi.fn(),
  convertSettings: vi.fn()
}))

import { getLiveSettings, convertSettings } from '../../../src/ts/core/elementor/EditorUtils'

describe('ElementorSettingsHandler', () => {
  let mockCallback: TSettingsChangeCallback
  let mockOptions: Record<string, any>
  let handler: ElementorSettingsHandler
  let mockAddEventListener: any
  let mockRemoveEventListener: any

  beforeEach(() => {
    // Reset all mocks
    vi.clearAllMocks()

    // Mock callback function
    mockCallback = vi.fn().mockResolvedValue(undefined)

    // Mock options object
    mockOptions = {
      setting1: 'elementor_key1',
      setting2: {
        condition: 'enable_feature',
        value: 'feature_value'
      }
    }

    // Mock window event listeners
    mockAddEventListener = vi.fn()
    mockRemoveEventListener = vi.fn()
    global.window = {
      addEventListener: mockAddEventListener,
      removeEventListener: mockRemoveEventListener
    } as any

    // Mock EditorUtils functions
    vi.mocked(getLiveSettings).mockReturnValue([
      'elementor_key1',
      'enable_feature',
      'feature_value'
    ])
    vi.mocked(convertSettings).mockReturnValue({ converted: 'settings' })

    // Create handler instance
    handler = new ElementorSettingsHandler(mockCallback, mockOptions)
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('constructor', () => {
    it('should create handler with callback and options', () => {
      expect(handler).toBeInstanceOf(ElementorSettingsHandler)
      expect(mockCallback).not.toHaveBeenCalled()
    })
  })

  describe('attach', () => {
    it('should add event listener for Elementor setting changes', () => {
      handler.attach()

      expect(mockAddEventListener).toHaveBeenCalledTimes(1)
      expect(mockAddEventListener).toHaveBeenCalledWith(
        'arts/elementor_extension/editor/setting_changed',
        expect.any(Function)
      )
    })

    it('should use handleEvent as the event listener', () => {
      handler.attach()

      const eventHandler = mockAddEventListener.mock.calls[0][1]
      expect(typeof eventHandler).toBe('function')
    })
  })

  describe('detach', () => {
    it('should remove event listener', () => {
      handler.attach()
      handler.detach()

      expect(mockRemoveEventListener).toHaveBeenCalledTimes(1)
      expect(mockRemoveEventListener).toHaveBeenCalledWith(
        'arts/elementor_extension/editor/setting_changed',
        expect.any(Function)
      )
    })

    it('should remove the same handler that was attached', () => {
      handler.attach()
      const attachedHandler = mockAddEventListener.mock.calls[0][1]

      handler.detach()
      const removedHandler = mockRemoveEventListener.mock.calls[0][1]

      expect(attachedHandler).toBe(removedHandler)
    })
  })

  describe('handleEvent', () => {
    beforeEach(() => {
      handler.attach()
    })

    it('should process valid Elementor setting events', () => {
      const validEvent = new CustomEvent('arts/elementor_extension/editor/setting_changed', {
        detail: {
          settings: { test_setting: 'test_value' },
          setting: 'elementor_key1',
          value: 'test_value'
        }
      }) as IElementorSettingChangedEvent

      const eventHandler = mockAddEventListener.mock.calls[0][1]
      eventHandler(validEvent)

      expect(getLiveSettings).toHaveBeenCalledWith(mockOptions)
    })

    it('should ignore events without detail', () => {
      const invalidEvent = new CustomEvent('arts/elementor_extension/editor/setting_changed') as any

      const eventHandler = mockAddEventListener.mock.calls[0][1]
      eventHandler(invalidEvent)

      expect(getLiveSettings).not.toHaveBeenCalled()
      expect(convertSettings).not.toHaveBeenCalled()
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should ignore events without settings property', () => {
      const invalidEvent = new CustomEvent('arts/elementor_extension/editor/setting_changed', {
        detail: {
          setting: 'elementor_key1'
          // missing settings property
        }
      }) as any

      const eventHandler = mockAddEventListener.mock.calls[0][1]
      eventHandler(invalidEvent)

      expect(getLiveSettings).not.toHaveBeenCalled()
      expect(convertSettings).not.toHaveBeenCalled()
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should ignore events without setting property', () => {
      const invalidEvent = new CustomEvent('arts/elementor_extension/editor/setting_changed', {
        detail: {
          settings: { test_setting: 'test_value' }
          // missing setting property
        }
      }) as any

      const eventHandler = mockAddEventListener.mock.calls[0][1]
      eventHandler(invalidEvent)

      expect(getLiveSettings).not.toHaveBeenCalled()
      expect(convertSettings).not.toHaveBeenCalled()
      expect(mockCallback).not.toHaveBeenCalled()
    })

    it('should ignore events with non-object detail', () => {
      const invalidEvent = new CustomEvent('arts/elementor_extension/editor/setting_changed', {
        detail: 'invalid_detail'
      }) as any

      const eventHandler = mockAddEventListener.mock.calls[0][1]
      eventHandler(invalidEvent)

      expect(getLiveSettings).not.toHaveBeenCalled()
      expect(convertSettings).not.toHaveBeenCalled()
      expect(mockCallback).not.toHaveBeenCalled()
    })
  })

  describe('isRelevantSetting', () => {
    beforeEach(() => {
      handler.attach()
    })

    it('should process settings that are in live settings list', () => {
      const relevantEvent = new CustomEvent('arts/elementor_extension/editor/setting_changed', {
        detail: {
          settings: { relevant_setting: 'test_value' },
          setting: 'elementor_key1', // This is in the mocked live settings
          value: 'test_value'
        }
      }) as IElementorSettingChangedEvent

      const eventHandler = mockAddEventListener.mock.calls[0][1]
      eventHandler(relevantEvent)

      expect(getLiveSettings).toHaveBeenCalledWith(mockOptions)
    })

    it('should ignore settings that are not in live settings list', () => {
      const irrelevantEvent = new CustomEvent('arts/elementor_extension/editor/setting_changed', {
        detail: {
          settings: { irrelevant_setting: 'test_value' },
          setting: 'irrelevant_key', // This is NOT in the mocked live settings
          value: 'test_value'
        }
      }) as IElementorSettingChangedEvent

      const eventHandler = mockAddEventListener.mock.calls[0][1]
      eventHandler(irrelevantEvent)

      expect(getLiveSettings).toHaveBeenCalledWith(mockOptions)
      expect(convertSettings).not.toHaveBeenCalled()
      expect(mockCallback).not.toHaveBeenCalled()
    })
  })

  describe('applySettingsChange', () => {
    beforeEach(() => {
      handler.attach()
    })

    it('should convert settings and call callback', () => {
      const settings = { test_setting: 'test_value' }
      const convertedSettings = { converted: 'test_settings' }

      vi.mocked(convertSettings).mockReturnValue(convertedSettings)

      const event = new CustomEvent('arts/elementor_extension/editor/setting_changed', {
        detail: {
          settings,
          setting: 'elementor_key1',
          value: 'test_value'
        }
      }) as IElementorSettingChangedEvent

      const eventHandler = mockAddEventListener.mock.calls[0][1]
      eventHandler(event)

      expect(convertSettings).toHaveBeenCalledWith(settings, mockOptions)
    })
  })

  describe('onChange race condition handling', () => {
    beforeEach(() => {
      handler.attach()
    })

    it('should ignore events when already processing', async () => {
      // Create a slow callback to simulate processing time
      let resolveCallback: () => void
      const slowPromise = new Promise<void>((resolve) => {
        resolveCallback = resolve
      })
      vi.mocked(mockCallback).mockImplementation(() => slowPromise)

      const event1 = new CustomEvent('arts/elementor_extension/editor/setting_changed', {
        detail: {
          settings: { test_setting: 'value1' },
          setting: 'elementor_key1',
          value: 'value1'
        }
      }) as IElementorSettingChangedEvent

      const event2 = new CustomEvent('arts/elementor_extension/editor/setting_changed', {
        detail: {
          settings: { test_setting: 'value2' },
          setting: 'elementor_key1',
          value: 'value2'
        }
      }) as IElementorSettingChangedEvent

      const eventHandler = mockAddEventListener.mock.calls[0][1]

      // Fire first event - this will start processing
      eventHandler(event1)

      // Fire second event immediately - this should be ignored due to isChanging flag
      eventHandler(event2)

      // Complete the first callback
      resolveCallback!()

      // Wait a bit for async processing
      await new Promise((resolve) => setTimeout(resolve, 10))

      // Should only have been called once (second event ignored)
      expect(mockCallback).toHaveBeenCalledTimes(1)
      expect(convertSettings).toHaveBeenCalledTimes(1)
    })
  })
})
