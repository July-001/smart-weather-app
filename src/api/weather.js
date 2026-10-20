import request from './request'

/**
 * 获取天气数据（Open-Meteo Forecast API）
 *
 * @param {{ latitude: number, longitude: number }} coord 城市经纬度
 * @returns {Promise<import('../types').WeatherData>} 天气数据
 */
export function fetchWeather({ latitude, longitude }) {
  return request
    .get('https://api.open-meteo.com/v1/forecast', {
      params: {
        latitude,
        longitude,
        current:
          'temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m',
        daily:
          'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max',
        timezone: 'auto',
        forecast_days: 7
      }
    })
    .then((res) => ({
      current: {
        temperature: res.current.temperature_2m,
        apparentTemperature: res.current.apparent_temperature,
        humidity: res.current.relative_humidity_2m,
        windSpeed: res.current.wind_speed_10m,
        weatherCode: res.current.weather_code
      },
      daily: res.daily.time.map((date, i) => ({
        date,
        weatherCode: res.daily.weather_code[i],
        tempMax: res.daily.temperature_2m_max[i],
        tempMin: res.daily.temperature_2m_min[i],
        precipitationProbability: res.daily.precipitation_probability_max[i],
        windSpeedMax: res.daily.wind_speed_10m_max[i]
      }))
    }))
}
