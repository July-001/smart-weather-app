<template>
  <div ref="searchBarRef" class="search-bar">
    <el-input
      v-model="keyword"
      placeholder="搜索省 / 市 / 区县，如：南昌、南昌县、西湖区"
      size="large"
      clearable
      :prefix-icon="Search"
      @input="onInput"
      @clear="onClear"
    />
    <div v-if="showDropdown" class="search-dropdown">
      <!-- 区划索引加载中 -->
      <div v-if="divisionStore.loading" class="dropdown-item hint">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>区划数据加载中...</span>
      </div>
      <!-- 区划索引加载失败 -->
      <div v-else-if="divisionStore.error" class="dropdown-item hint error">
        <span>{{ divisionStore.error }}</span>
        <el-button size="small" type="primary" text @click="retryLoad">重试</el-button>
      </div>
      <!-- 搜索中 -->
      <div v-else-if="searching" class="dropdown-item hint">
        <el-icon class="is-loading"><Loading /></el-icon>
        <span>搜索中...</span>
      </div>
      <!-- 搜索结果：只含真实行政区划，带完整路径消歧 -->
      <template v-else-if="results.length">
        <div
          v-for="item in results"
          :key="item.adcode"
          class="dropdown-item"
          @click="onSelect(item)"
        >
          <span class="city-name">{{ item.name }}</span>
          <span class="city-desc">{{ divisionStore.getDivisionPath(item) }}</span>
        </div>
      </template>
      <!-- 空结果 -->
      <div v-else class="dropdown-item hint">未找到相关区划，试试完整名称（如：南昌县）</div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'
import { Loading, Search } from '@element-plus/icons-vue'
import { searchCities } from '../api/geo'
import { useDivisionStore } from '../stores/division'

const emit = defineEmits(['select'])

const searchBarRef = ref(null)
const keyword = ref('')
const results = ref([])
const searching = ref(false)
const showDropdown = ref(false)

const divisionStore = useDivisionStore()

let timer = null
let requestId = 0

/** 输入防抖 300ms 后触发本地检索 */
function onInput() {
  clearTimeout(timer)
  if (!keyword.value.trim()) {
    results.value = []
    showDropdown.value = false
    searching.value = false
    return
  }
  timer = setTimeout(() => doSearch(), 300)
}

async function doSearch() {
  const id = ++requestId
  searching.value = true
  showDropdown.value = true
  try {
    // 首次搜索前确保区划索引就绪（失败时下拉内给出重试入口）
    await divisionStore.ensureLoaded()
    if (divisionStore.error) {
      if (id === requestId) {
        results.value = []
        searching.value = false
      }
      return
    }
    const list = await searchCities(keyword.value.trim())
    if (id !== requestId) return // 丢弃过期请求结果
    results.value = list
  } catch {
    if (id !== requestId) return
    results.value = []
  } finally {
    if (id === requestId) searching.value = false
  }
}

/**
 * 选中区划
 *
 * @param {import('../types').Division} division 区划
 */
function onSelect(division) {
  emit('select', { ...division, path: divisionStore.getDivisionPath(division) })
  keyword.value = '' // 切换新区划后清空搜索框，不保留旧选择
  showDropdown.value = false
}

/** 索引加载失败后重试 */
async function retryLoad() {
  await divisionStore.load()
  if (!divisionStore.error && keyword.value.trim()) {
    doSearch()
  }
}

function onClear() {
  clearTimeout(timer)
  results.value = []
  showDropdown.value = false
  searching.value = false
}

/** 点击输入框外部时收起下拉列表 */
function onClickOutside(e) {
  if (searchBarRef.value && !searchBarRef.value.contains(e.target)) {
    showDropdown.value = false
  }
}

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.search-bar {
  position: relative;
  min-width: 0;
  flex: 1;
}

.search-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  right: 0;
  background: var(--c-paper-raised);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 16px rgba(28, 28, 28, 0.06);
  overflow: hidden;
  z-index: 99;
}

.dropdown-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 11px 14px;
  cursor: pointer;
  font-size: 14px;
}

.dropdown-item:hover {
  background: var(--c-tint);
}

.dropdown-item + .dropdown-item {
  border-top: 1px solid var(--c-line);
}

.dropdown-item.hint {
  justify-content: center;
  gap: 8px;
  color: var(--c-ink-muted);
  cursor: default;
}

.dropdown-item.hint:hover {
  background: transparent;
}

.dropdown-item.hint.error {
  color: var(--c-accent);
  flex-wrap: wrap;
}

.city-name {
  font-weight: 600;
  color: var(--c-ink);
  white-space: nowrap;
}

.city-desc {
  color: var(--c-ink-muted);
  font-size: 12.5px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
