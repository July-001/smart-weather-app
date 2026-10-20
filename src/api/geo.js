import { loadDivisions } from './adminDivision'
import { searchDivisions } from '../utils/divisionSearch'
import { cacheGet, cacheSet } from '../utils/cache'

/**
 * 城市搜索缓存：TTL 5 分钟
 * key 包含关键词与层级，避免不同查询互相污染
 */
const SEARCH_CACHE_TTL = 5 * 60 * 1000

/**
 * 城市 / 区划搜索
 *
 * 数据源为真实中国行政区划索引（DataV.GeoAtlas，民政部标准）：
 * - 首次调用需加载索引（24h 缓存），之后为纯本地检索，零网络请求
 * - 只返回真实存在的省 / 市 / 区县，按 adcode 去重
 * - 完全匹配优先，其次市级、区县
 * - 搜索结果缓存 5 分钟；空结果不缓存
 *
 * @param {string} keyword 搜索关键词（区划名称，如：南昌、南昌县、西湖区）
 * @param {{ level?: 'province'|'city'|'district'|'all' }} [options] 层级过滤
 * @returns {Promise<import('../types').Division[]>} 区划列表（含 adcode、经纬度）
 * @throws {Error} 区划索引加载失败时抛出
 */
export async function searchCities(keyword, { level = 'all' } = {}) {
  const kw = String(keyword || '').trim()
  if (!kw) return []

  // 1. 搜索结果缓存（key = 关键词 + 层级）
  const cacheKey = `search:${kw}:${level}`
  const cached = cacheGet(cacheKey, { ttl: SEARCH_CACHE_TTL })
  if (cached) return cached

  // 2. 本地区划索引检索
  const divisions = await loadDivisions()
  const pool = level === 'all' ? divisions : divisions.filter((d) => d.level === level)
  const results = searchDivisions(pool, kw)

  // 3. 空结果不缓存
  if (results.length) {
    cacheSet(cacheKey, results)
  }
  return results
}
