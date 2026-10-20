<template>
  <div v-if="favorites.list.length" class="favorites-bar">
    <div
      v-for="item in favorites.list"
      :key="favoriteKeyOf(item)"
      class="fav-chip"
      :class="{ active: isActive(item) }"
      :title="item.path || item.name"
      @click="emit('select', item)"
    >
      <span class="fav-name">{{ item.name }}</span>
      <span class="fav-close" title="删除" @click.stop="onRemove(item)">×</span>
    </div>
  </div>
</template>

<script setup>
import { ElMessage, ElMessageBox } from 'element-plus'
import { useFavoritesStore, favoriteKeyOf } from '../stores/favorites'
import { useCityStore } from '../stores/city'

const emit = defineEmits(['select'])

const favorites = useFavoritesStore()
const cityStore = useCityStore()

/**
 * 判断收藏项是否为当前选中区划
 *
 * @param {import('../types').Division} item 收藏项
 * @returns {boolean}
 */
function isActive(item) {
  return Boolean(cityStore.currentDivision) && favoriteKeyOf(item) === favoriteKeyOf(cityStore.currentDivision)
}

/**
 * 删除收藏区划（带二次确认）
 *
 * @param {import('../types').Division} item 收藏项
 */
async function onRemove(item) {
  try {
    await ElMessageBox.confirm(`确定删除收藏「${item.name}」吗？`, '删除收藏', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return // 用户取消
  }
  favorites.remove(item)
  ElMessage.info(`已删除收藏 ${item.name}`)
}
</script>

<style scoped>
.favorites-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}

/* 细线方角 chip，激活态墨色反白 */
.fav-chip {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  background: var(--c-paper-raised);
  border: 1px solid var(--c-line);
  border-radius: var(--radius-sm);
  padding: 5px 10px;
  font-size: 13.5px;
  color: var(--c-ink-secondary);
  cursor: pointer;
  transition: all 0.15s;
  user-select: none;
}

.fav-chip:hover {
  border-color: var(--c-ink-secondary);
  color: var(--c-ink);
}

.fav-chip.active {
  background: var(--c-ink);
  border-color: var(--c-ink);
  color: var(--c-paper);
}

.fav-chip.active .fav-close {
  color: rgba(247, 245, 239, 0.75);
}

.fav-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 15px;
  height: 15px;
  border-radius: 2px;
  font-size: 14px;
  line-height: 1;
  color: var(--c-ink-muted);
}

.fav-close:hover {
  background: rgba(0, 0, 0, 0.08);
  color: var(--c-accent);
}
</style>
