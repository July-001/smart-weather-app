import { defineStore } from 'pinia'

/**
 * 当前区划状态管理
 */
export const useCityStore = defineStore('city', {
  state: () => ({
    /** @type {import('../types').Division|null} 当前选中的省 / 市 / 区县 */
    currentDivision: null
  }),
  actions: {
    /**
     * 设置当前区划
     *
     * @param {import('../types').Division} division 区划
     */
    setCurrentDivision(division) {
      this.currentDivision = division
    }
  }
})
