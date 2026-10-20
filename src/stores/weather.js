import { defineStore } from 'pinia'
import { fetchWeather } from '../api/weather'
import { cacheGet, cacheSet } from '../utils/cache'

/** 天气缓存：TTL 10 分钟 */
const WEATHER_CACHE_TTL = 10 * 60 * 1000

/**
 * 天气缓存 key：优先用 adcode（区县级唯一标识），无 adcode 的旧数据按坐标
 *
 * @param {import('../types').Division} division 区划
 * @returns {string}
 */
function weatherCacheKey(division) {
  if (division?.adcode) {
    return `weather:${division.adcode}`
  }
  return `weather:coord:${Number(division?.lng || 0).toFixed(2)},${Number(division?.lat || 0).toFixed(2)}`
}

/**
 * 校验天气数据结构完整性（异常结构不作为缓存命中）
 *
 * @param {any} data
 * @returns {boolean}
 */
function isValidWeather(data) {
  return Boolean(
    data &&
      data.current &&
      typeof data.current.temperature === 'number' &&
      Array.isArray(data.daily) &&
      data.daily.length
  )
}

/**
 * 天气数据状态管理：统一管理 loading、error 状态与 10 分钟缓存
 */
export const useWeatherStore = defineStore('weather', {
  state: () => ({
    /** @type {boolean} 是否加载中 */
    loading: false,
    /** @type {string} 错误提示信息，为空表示无错误 */
    error: '',
    /** @type {import('../types').Division|null} 天气数据对应的省 / 市 / 区县 */
    division: null,
    /** @type {import('../types').WeatherData|null} 天气数据 */
    weather: null
  }),
  actions: {
    /**
     * 获取指定区划的天气数据（按区县中心经纬度查询，缓存命中时零请求）
     *
     * @param {import('../types').Division} division 区划
     */
    async fetchWeather(division) {
      this.division = division
      this.error = ''

      // 1. 缓存命中：直接渲染
      const key = weatherCacheKey(division)
      const cached = cacheGet(key, { ttl: WEATHER_CACHE_TTL })
      if (isValidWeather(cached)) {
        this.weather = cached
        return
      }

      // 2. 缓存未命中：按经纬度请求天气
      this.loading = true
      try {
        const data = await fetchWeather({ latitude: division.lat, longitude: division.lng })
        this.weather = data
        cacheSet(key, data) // 成功结果才写入缓存
      } catch (err) {
        this.weather = null
        this.error = err?.message || '天气数据获取失败，请重试'
      } finally {
        this.loading = false
      }
    },

    /** 错误重试：重新请求当前区划的天气 */
    retry() {
      if (this.division) {
        this.fetchWeather(this.division)
      }
    }
  }
})
