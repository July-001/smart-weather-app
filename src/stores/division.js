import { defineStore } from 'pinia'
import { loadDivisions } from '../api/adminDivision'
import { useFavoritesStore } from './favorites'

/**
 * 行政区划状态管理：真实省 / 市 / 区县数据（DataV.GeoAtlas，民政部标准）
 */
export const useDivisionStore = defineStore('division', {
  state: () => ({
    /** @type {boolean} 索引加载中 */
    loading: false,
    /** @type {string} 索引加载错误信息 */
    error: '',
    /** @type {import('../types').Division[]} 区划扁平索引 */
    list: []
  }),
  getters: {
    /**
     * adcode → Division 映射
     *
     * @param {import('../types').Division[]} state
     * @returns {Map<number, import('../types').Division>}
     */
    byId(state) {
      const map = new Map()
      state.list.forEach((d) => map.set(d.adcode, d))
      return map
    },

    /**
     * 省市区县三级树（供 el-cascader 使用）
     *
     * @param {import('../types').Division[]} state
     * @returns {Array<{ value: number, label: string, children?: any[] }>}
     */
    tree(state) {
      const nodeMap = new Map()
      const roots = []
      for (const d of state.list) {
        nodeMap.set(d.adcode, { value: d.adcode, label: d.name, level: d.level, children: [] })
      }
      for (const d of state.list) {
        const node = nodeMap.get(d.adcode)
        const parent = d.parent ? nodeMap.get(d.parent) : null
        if (parent) parent.children.push(node)
        else roots.push(node)
      }
      // 叶子节点移除空 children
      const clean = (nodes) => {
        for (const n of nodes) {
          if (n.children && n.children.length) clean(n.children)
          else delete n.children
        }
      }
      clean(roots)
      return roots
    }
  },
  actions: {
    /** 加载区划索引（幂等），成功后顺带迁移旧格式收藏 */
    async load() {
      if (this.list.length || this.loading) return
      this.loading = true
      this.error = ''
      try {
        this.list = await loadDivisions()
        useFavoritesStore().upgradeLegacy(this.list, (d) => this.getDivisionPath(d))
      } catch (err) {
        this.error = err?.message || '行政区划数据加载失败，请重试'
      } finally {
        this.loading = false
      }
    },

    /** 确保索引可用（已加载则直接返回） */
    ensureLoaded() {
      if (!this.list.length) return this.load()
      return Promise.resolve()
    },

    /**
     * 获取区划完整路径，如"江西省 / 南昌市 / 西湖区"
     *
     * @param {import('../types').Division} division 区划
     * @returns {string}
     */
    getDivisionPath(division) {
      if (division?.path) return division.path
      const parts = [division.name]
      let node = division.parent ? this.byId.get(division.parent) : null
      while (node) {
        parts.unshift(node.name)
        node = node.parent ? this.byId.get(node.parent) : null
      }
      return parts.join(' / ')
    }
  }
})
