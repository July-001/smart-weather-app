import { getWithRetry } from './request'
import { cacheGet, cacheSet } from '../utils/cache'

/**
 * 中国行政区划数据源
 *
 * 使用 DataV.GeoAtlas（阿里云）公开数据（基于民政部行政区划标准），
 * 无需 API Key，单文件包含全国省 / 市 / 区县真实区划及中心经纬度。
 * 数据为 2021 版：真实可靠，但极个别 2021 年后新设区划可能缺失。
 */
const DIVISIONS_URL = 'https://geo.datav.aliyun.com/areas_v3/bound/all.json'

/** 行政区划数据缓存：TTL 24 小时 */
const DIVISIONS_CACHE_KEY = 'divisions'
const DIVISIONS_CACHE_TTL = 24 * 60 * 60 * 1000

/** 数据完整性校验阈值：全国区划约 3200+ 条 */
const MIN_DIVISIONS_COUNT = 3000

/** 模块级运行时缓存：同一页面生命周期内只加载一次 */
let runtimePromise = null

/**
 * 将 DataV 原始数据标准化为 Division 列表
 *
 * @param {Array<{adcode:number,name:string,level:string,parent:number|null,lng:number,lat:number}>} raw
 * @returns {import('../types').Division[]}
 */
function normalize(raw) {
  return raw
    .filter((d) => d && d.adcode && d.level !== 'country')
    .map((d) => ({
      adcode: Number(d.adcode),
      name: String(d.name || '').trim(),
      level: d.level, // 'province' | 'city' | 'district'
      parent: d.parent ? Number(d.parent) : 0,
      lng: Number(d.lng),
      lat: Number(d.lat)
    }))
    .filter((d) => d.name && Number.isFinite(d.lng) && Number.isFinite(d.lat))
}

/**
 * 加载行政区划数据（带 localStorage 24h 缓存、15s 超时、1 次自动重试）
 *
 * - 缓存命中：直接返回，零网络请求
 * - 请求失败：不缓存，下次调用可重新加载
 *
 * @returns {Promise<import('../types').Division[]>}
 * @throws {Error} 数据加载或校验失败时抛出友好错误
 */
export async function loadDivisions() {
  if (!runtimePromise) {
    runtimePromise = fetchDivisions().catch((err) => {
      runtimePromise = null // 失败后允许下次重试
      throw err
    })
  }
  return runtimePromise
}

async function fetchDivisions() {
  // 1. 尝试缓存（24h TTL）
  const cached = cacheGet(DIVISIONS_CACHE_KEY, { ttl: DIVISIONS_CACHE_TTL })
  if (Array.isArray(cached) && cached.length >= MIN_DIVISIONS_COUNT) {
    return cached
  }

  // 2. 网络加载（15s 超时 + 1 次自动重试）
  const raw = await getWithRetry(DIVISIONS_URL, { timeout: 15000 })

  // 3. 校验数据完整性，异常数据不缓存
  if (!Array.isArray(raw) || raw.length < MIN_DIVISIONS_COUNT) {
    throw new Error('行政区划数据异常，请稍后重试')
  }
  const list = normalize(raw)
  if (list.length < MIN_DIVISIONS_COUNT) {
    throw new Error('行政区划数据异常，请稍后重试')
  }

  // 4. 成功结果写入缓存
  cacheSet(DIVISIONS_CACHE_KEY, list)
  return list
}
