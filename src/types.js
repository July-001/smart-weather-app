/**
 * 全局数据结构定义（配合 JSDoc 提供类型提示）
 *
 * 使用方式：
 *   /** @type {import('../types').City} *\/
 */

/**
 * 行政区划（DataV.GeoAtlas all.json，基于民政部区划标准，真实数据）
 *
 * @typedef {Object} Division
 * @property {number} adcode 6 位行政区划代码（legacy 旧数据为 0）
 * @property {string} name 区划名称（如：江西省 / 南昌市 / 西湖区）
 * @property {'province'|'city'|'district'|'legacy'} level 层级
 * @property {number} [parent] 上级区划 adcode
 * @property {number} lng 中心点经度
 * @property {number} lat 中心点纬度
 * @property {string} [path] 完整路径，如"江西省 / 南昌市 / 西湖区"
 */

/**
 * 城市（Open-Meteo Geocoding API 返回结果映射，仅旧格式收藏兼容使用）
 *
 * @typedef {Object} City
 * @property {number} id 城市 ID
 * @property {string} name 城市名称
 * @property {string} country 国家
 * @property {string} admin1 省份 / 州（可能为空字符串）
 * @property {number} latitude 纬度
 * @property {number} longitude 经度
 */

/**
 * 当前天气
 *
 * @typedef {Object} CurrentWeather
 * @property {number} temperature 当前温度（°C）
 * @property {number} apparentTemperature 体感温度（°C）
 * @property {number} humidity 相对湿度（%）
 * @property {number} windSpeed 风速（km/h）
 * @property {number} weatherCode WMO 天气代码
 */

/**
 * 单日预报
 *
 * @typedef {Object} DailyForecast
 * @property {string} date 日期（YYYY-MM-DD）
 * @property {number} weatherCode WMO 天气代码
 * @property {number} tempMax 最高气温（°C）
 * @property {number} tempMin 最低气温（°C）
 * @property {number} precipitationProbability 降水概率（%，可能为 null）
 * @property {number} windSpeedMax 最大风速（km/h）
 */

/**
 * 天气数据（Open-Meteo Forecast API 返回结果映射）
 *
 * @typedef {Object} WeatherData
 * @property {CurrentWeather} current 当前天气
 * @property {DailyForecast[]} daily 未来 7 天预报
 */

export {}
