<template>
  <div class="favorites">
    <!-- 空状态 -->
    <el-empty
      v-if="!favorites.list.length"
      description="还没有收藏区划，去首页搜索并收藏吧"
      :image-size="120"
    >
      <el-button type="primary" @click="router.push('/')">去搜索区划</el-button>
    </el-empty>

    <!-- 收藏列表 -->
    <div v-else class="fav-list">
      <div v-for="item in favorites.list" :key="favoriteKeyOf(item)" class="card fav-item">
        <div class="fav-info">
          <h3 class="fav-name">
            {{ item.name }}
            <el-tag v-if="item.level === 'legacy'" size="small" type="info" class="legacy-tag">
              旧格式
            </el-tag>
          </h3>
          <p class="fav-desc">{{ item.path || item.name }}</p>
        </div>
        <div class="fav-actions">
          <el-button type="primary" plain size="small" @click="goWeather(item)">
            查看天气
          </el-button>
          <el-button type="danger" plain size="small" @click="onRemove(item)">
            删除
          </el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useFavoritesStore, favoriteKeyOf } from '../stores/favorites'
import { useCityStore } from '../stores/city'
import { useWeatherStore } from '../stores/weather'

const router = useRouter()
const favorites = useFavoritesStore()
const cityStore = useCityStore()
const weatherStore = useWeatherStore()

/**
 * 切换到该区划并返回首页查看天气
 *
 * @param {import('../types').Division} division 区划
 */
function goWeather(division) {
  cityStore.setCurrentDivision(division)
  weatherStore.fetchWeather(division)
  router.push('/')
}

/**
 * 删除收藏区划（带二次确认）
 *
 * @param {import('../types').Division} division 区划
 */
async function onRemove(division) {
  try {
    await ElMessageBox.confirm(`确定删除收藏「${division.name}」吗？`, '删除收藏', {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return // 用户取消
  }
  favorites.remove(division)
  ElMessage.info(`已删除收藏 ${division.name}`)
}
</script>

<style scoped>
.fav-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 12px;
}

.fav-name {
  font-size: 17px;
  font-weight: 700;
  color: var(--c-ink);
}

.legacy-tag {
  margin-left: 6px;
}

.fav-desc {
  margin-top: 4px;
  font-size: 12.5px;
  color: var(--c-ink-muted);
}

.fav-actions {
  display: flex;
  gap: 8px;
  flex-shrink: 0;
}

@media (max-width: 480px) {
  .fav-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .fav-actions {
    width: 100%;
  }

  .fav-actions .el-button {
    flex: 1;
  }
}
</style>
