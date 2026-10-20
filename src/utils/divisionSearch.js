/**
 * 行政区划搜索工具（纯函数，可脱离浏览器环境单测）
 *
 * 数据来源：DataV.GeoAtlas（民政部区划标准）all.json，
 * 只包含真实存在的省 / 市 / 区县，不存在伪造区划。
 */

/**
 * 在区划扁平索引中按名称搜索
 *
 * 排序规则：
 *   1. 完全匹配 > 前缀匹配 > 包含匹配
 *   2. 同一匹配类型内：市级 > 区县级 > 省级
 *   3. 名称更短者优先，再按 adcode 升序保证稳定
 *
 * @param {import('../types').Division[]} list 区划扁平索引
 * @param {string} keyword 搜索关键词
 * @param {{ limit?: number }} [options]
 * @returns {import('../types').Division[]} 排序后的区划列表（按 adcode 去重）
 */
export function searchDivisions(list, keyword, { limit = 10 } = {}) {
  const kw = String(keyword || '').trim()
  if (!kw || !Array.isArray(list)) return []

  const seen = new Set()
  const results = []

  for (const item of list) {
    const name = item.name
    if (!name || !name.includes(kw) || seen.has(item.adcode)) continue
    seen.add(item.adcode)

    let score
    if (name === kw) {
      score = 1000 // 完全匹配优先
    } else if (name.startsWith(kw)) {
      score = 500
    } else {
      score = 200
    }
    // 同一匹配类型内：市级 > 区县级 > 省级
    if (item.level === 'city') score += 40
    else if (item.level === 'district') score += 20

    results.push({ item, score })
  }

  results.sort(
    (a, b) =>
      b.score - a.score ||
      a.item.name.length - b.item.name.length ||
      a.item.adcode - b.item.adcode
  )

  return results.slice(0, limit).map((r) => r.item)
}
