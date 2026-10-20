import axios from 'axios'

/**
 * 统一封装的 Axios 实例：集中处理超时与响应错误，
 * 所有 API 请求异常都会抛出携带友好提示信息的 Error
 */
const service = axios.create({
  timeout: 10000
})

// 响应拦截器：直接返回 data，统一转换错误信息
service.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = '请求失败，请稍后重试'

    if (error.code === 'ECONNABORTED') {
      message = '请求超时，请检查网络后重试'
    } else if (error.response) {
      const status = error.response.status
      message =
        status >= 500
          ? '服务暂时不可用，请稍后重试'
          : `请求出错（${status}），请稍后重试`
    } else if (error.request) {
      message = '网络连接失败，请检查网络后重试'
    }

    return Promise.reject(new Error(message))
  }
)

/**
 * 带自动重试的 GET 请求：请求失败（超时 / 网络错误 / 5xx）时重试 1 次
 *
 * @param {string} url 请求地址
 * @param {import('axios').AxiosRequestConfig} [config] 请求配置（可按请求覆盖 timeout）
 * @param {{ retries?: number }} [options] 重试次数，默认 1
 * @returns {Promise<any>} 响应数据
 */
export async function getWithRetry(url, config = {}, { retries = 1 } = {}) {
  let lastError
  for (let attempt = 0; attempt <= retries; attempt += 1) {
    try {
      return await service.get(url, config)
    } catch (err) {
      lastError = err
    }
  }
  throw lastError
}

export default service
