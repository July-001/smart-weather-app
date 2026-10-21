<template>
  <el-cascader
    v-model="selected"
    class="city-picker"
    size="large"
    :options="divisionStore.tree"
    :props="{ checkStrictly: true }"
    :placeholder="divisionStore.loading ? '区划数据加载中...' : '按省 / 市 / 区县选择'"
    filterable
    clearable
    @change="onChange"
    @visible-change="onVisibleChange"
  />
</template>

<script setup>
import { ref } from 'vue'
import { useDivisionStore } from '../stores/division'

const emit = defineEmits(['select'])

const divisionStore = useDivisionStore()
const selected = ref([])

/**
 * 级联选择变化：取最后一级 adcode 定位区划（支持选到任意层级）
 *
 * @param {number[]|null} value adcode 路径
 */
function onChange(value) {
  if (!Array.isArray(value) || !value.length) return
  const adcode = value[value.length - 1]
  const division = divisionStore.byId.get(adcode)
  if (division) {
    emit('select', { ...division, path: divisionStore.getDivisionPath(division) })
  }
}

/** 首次展开下拉时确保区划数据已加载 */
function onVisibleChange(visible) {
  if (visible) {
    divisionStore.ensureLoaded()
  }
}
</script>

<style scoped>
.city-picker {
  width: 220px;
  flex-shrink: 0;
}
</style>
