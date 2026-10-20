/**
 * 通用 localStorage 缓存（带 TTL）
 *
 * - key 由调用方拼装（约定包含关键词、层级、adcode 等维度，避免不同查询互相污染）
 * - 空结果、异常结果由调用方保证不写入缓存
 * - 写入失败（如空间不足、隐私模式）时静默降级，不影响主流程
 */

const PREFIX = 'sw:v1:'

/**
 * 读取缓存
 *
 * @param {string} key 缓存 key
 * @param {{ ttl?: number }} [options] ttl 毫秒，不传表示永不过期
 * @returns {any|null} 缓存值，未命中或已过期返回 null
 */
export function cacheGet(key, { ttl } = {}) {
  if (!key) return null
  try {
    const raw = localStorage.getItem(PREFIX + key)
    if (!raw) return null
    const { ts, value } = JSON.parse(raw)
    if (typeof ts !== 'number') return null
    if (ttl && Date.now() - ts > ttl) return null
    return value
  } catch {
    return null
  }
}

/**
 * 写入缓存
 *
 * @param {string} key 缓存 key
 * @param {any} value 缓存值
 */
export function cacheSet(key, value) {
  if (!key) return
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify({ ts: Date.now(), value }))
  } catch {
    // 静默降级
  }
}

/**
 * 删除缓存
 *
 * @param {string} key 缓存 key
 */
export function cacheRemove(key) {
  if (!key) return
  try {
    localStorage.removeItem(PREFIX + key)
  } catch {
    // 静默降级
  }
}
