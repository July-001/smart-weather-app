/**
 * WMO 天气代码映射工具
 * 将 Open-Meteo 返回的 WMO 天气代码转换为中文描述与图标
 */

/**
 * WMO 天气代码映射表
 *
 * @type {Record<number, { text: string, icon: string }>}
 */
export const WMO_WEATHER_MAP = {
  0: { text: '晴', icon: '☀️' },
  1: { text: '大致晴朗', icon: '🌤️' },
  2: { text: '多云', icon: '⛅' },
  3: { text: '阴', icon: '☁️' },
  45: { text: '有雾', icon: '🌫️' },
  48: { text: '雾凇', icon: '🌫️' },
  51: { text: '小毛毛雨', icon: '🌦️' },
  53: { text: '毛毛雨', icon: '🌦️' },
  55: { text: '大毛毛雨', icon: '🌧️' },
  56: { text: '冻毛毛雨', icon: '🌧️' },
  57: { text: '强冻毛毛雨', icon: '🌧️' },
  61: { text: '小雨', icon: '🌧️' },
  63: { text: '中雨', icon: '🌧️' },
  65: { text: '大雨', icon: '🌧️' },
  66: { text: '冻雨', icon: '🌧️' },
  67: { text: '强冻雨', icon: '🌧️' },
  71: { text: '小雪', icon: '🌨️' },
  73: { text: '中雪', icon: '🌨️' },
  75: { text: '大雪', icon: '❄️' },
  77: { text: '雪粒', icon: '❄️' },
  80: { text: '小阵雨', icon: '🌦️' },
  81: { text: '阵雨', icon: '🌧️' },
  82: { text: '强阵雨', icon: '⛈️' },
  85: { text: '小阵雪', icon: '🌨️' },
  86: { text: '大阵雪', icon: '❄️' },
  95: { text: '雷阵雨', icon: '⛈️' },
  96: { text: '雷阵雨伴冰雹', icon: '⛈️' },
  99: { text: '强雷阵雨伴冰雹', icon: '⛈️' }
}

/**
 * 根据 WMO 天气代码获取天气描述与图标
 *
 * @param {number} code WMO 天气代码
 * @returns {{ text: string, icon: string }} 中文描述与图标
 */
export function getWeatherInfo(code) {
  return WMO_WEATHER_MAP[code] || { text: '未知天气', icon: '❓' }
}

/** 雨类代码 */
const RAIN_CODES = [51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82]
/** 雪类代码 */
const SNOW_CODES = [71, 73, 75, 77, 85, 86]
/** 雷雨代码 */
const THUNDER_CODES = [95, 96, 99]

/**
 * 将 WMO 天气代码归为 7 类符号（供单色线框图标渲染）
 *
 * @param {number} code WMO 天气代码
 * @returns {'clear'|'partly'|'cloudy'|'fog'|'rain'|'snow'|'thunder'} 符号类别
 */
export function getWeatherCategory(code) {
  if (code === 0 || code === 1) return 'clear'
  if (code === 2) return 'partly'
  if (code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'fog'
  if (RAIN_CODES.includes(code)) return 'rain'
  if (SNOW_CODES.includes(code)) return 'snow'
  if (THUNDER_CODES.includes(code)) return 'thunder'
  return 'cloudy'
}
