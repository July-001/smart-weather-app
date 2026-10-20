import { defineStore } from 'pinia'

const STORAGE_KEY = 'smart-weather-favorites' // 沿用原 key，兼容旧数据

/**
 * 计算收藏条目的唯一 key：优先 adcode，无 adcode 的旧数据按坐标
 *
 * @param {import('../types').Division|null} item 区划
 * @returns {string}
 */
export function favoriteKeyOf(item) {
  if (!item) return ''
  if (item.adcode) return `a:${item.adcode}`
  return `c:${Number(item.lng || 0).toFixed(2)},${Number(item.lat || 0).toFixed(2)}`
}

/**
 * 从 localStorage 读取收藏列表
 *
 * @returns {import('../types').Division[]}
 */
function loadFavorites() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const list = raw ? JSON.parse(raw) : []
    return Array.isArray(list) ? list : []
  } catch {
    return []
  }
}

/**
 * 收藏列表状态管理：持久化到 localStorage，刷新后数据保留
 */
export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    /** @type {import('../types').Division[]} 收藏的区划列表 */
    list: loadFavorites()
  }),
  getters: {
    /**
     * 判断区划是否已收藏
     *
     * @param {import('../types').Division[]} state
     * @returns {(division: import('../types').Division) => boolean}
     */
    isFavorite(state) {
      return (division) => {
        const key = favoriteKeyOf(division)
        return state.list.some((item) => favoriteKeyOf(item) === key)
      }
    }
  },
  actions: {
    /** 将收藏列表同步写入 localStorage */
    persist() {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.list))
      } catch {
        // localStorage 不可用时静默失败，不影响主流程
      }
    },

    /**
     * 添加收藏区划
     *
     * @param {import('../types').Division} division 区划
     */
    add(division) {
      if (!division || this.isFavorite(division)) return
      this.list.push({ ...division })
      this.persist()
    },

    /**
     * 删除收藏区划
     *
     * @param {import('../types').Division} division 区划
     */
    remove(division) {
      const key = favoriteKeyOf(division)
      this.list = this.list.filter((item) => favoriteKeyOf(item) !== key)
      this.persist()
    },

    /**
     * 切换收藏状态
     *
     * @param {import('../types').Division} division 区划
     */
    toggle(division) {
      if (this.isFavorite(division)) {
        this.remove(division)
      } else {
        this.add(division)
      }
    },

    /**
     * 旧格式收藏（Open-Meteo GeoNames 模糊结果）一次性迁移：
     * 按名称 + 省份匹配到真实行政区划则升级，匹配不上则保留原数据并标记 legacy
     * （不删除用户已有收藏，不伪造区划）
     *
     * @param {import('../types').Division[]} divisions 真实区划索引
     * @param {(d: import('../types').Division) => string} pathOf 计算完整路径的函数
     */
    upgradeLegacy(divisions, pathOf) {
      if (!Array.isArray(divisions) || !divisions.length || !this.list.length) return

      this.list = this.list.map((item) => {
        if (item.adcode) return item // 已是新格式

        const prov = item.admin1 || item.provinceName || ''
        const stripSuffix = (s) => String(s || '').replace(/(省|市|自治区|特别行政区)$/, '')

        // 名称匹配（完全 > 前缀），再按省份过滤
        const nameMatches = divisions
          .filter(
            (d) =>
              d.name === item.name ||
              d.name.startsWith(item.name) ||
              item.name.startsWith(d.name)
          )
          .sort((a, b) => a.name.length - b.name.length || a.adcode - b.adcode)
        const matched = nameMatches.find((d) => {
          if (!prov) return true
          const pn = stripSuffix(pathOf(d).split(' / ')[0])
          const pv = stripSuffix(prov)
          return pn === pv || pn.startsWith(pv) || pv.startsWith(pn)
        })

        if (matched) {
          return { ...matched, path: pathOf(matched) }
        }

        // 匹配不上：保留原始真实点位，标记 legacy
        return {
          adcode: 0,
          name: item.name,
          level: 'legacy',
          lng: item.lng ?? item.longitude ?? 0,
          lat: item.lat ?? item.latitude ?? 0,
          path: item.path || [item.provinceName || item.admin1, item.country].filter(Boolean).join(' · ')
        }
      })
      this.persist()
    }
  }
})
