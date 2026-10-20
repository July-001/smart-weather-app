<template>
  <div class="home">
    <!-- 搜索（防抖 300ms）+ 省/市/区县三级选择 -->
    <div class="search-area">
      <SearchBar @select="onSelectCity" />
      <CityPicker @select="onSelectCity" />
    </div>

    <!-- 收藏区划快速切换 -->
    <FavoritesBar @select="onSelectCity" />

    <!-- loading 骨架屏 -->
    <section v-if="weatherStore.loading" class="panel skeleton-card" aria-label="天气加载中">
      <el-skeleton animated>
        <template #template>
          <div class="skeleton-top">
            <el-skeleton-item variant="text" style="width: 40%; height: 22px" />
            <el-skeleton-item variant="text" style="width: 64px; height: 64px" />
          </div>
          <el-skeleton-item variant="text" style="width: 160px; height: 56px; margin-bottom: 28px" />
          <div class="skeleton-chips">
            <el-skeleton-item variant="text" style="flex: 1; height: 40px" />
            <el-skeleton-item variant="text" style="flex: 1; height: 40px" />
            <el-skeleton-item variant="text" style="flex: 1; height: 40px" />
          </div>
        </template>
      </el-skeleton>
    </section>

    <!-- 错误状态 + 重试 -->
    <section v-else-if="weatherStore.error" class="panel state-card">
      <h3 class="state-title">无法加载天气</h3>
      <p class="state-desc">{{ weatherStore.error }}</p>
      <el-button type="primary" size="small" @click="weatherStore.retry">重新加载</el-button>
    </section>

    <!-- 空状态 -->
    <section v-else-if="!weatherStore.weather" class="panel state-card empty-card">
      <h3 class="state-title">查询任意省市区县的天气</h3>
      <p class="state-desc">
        搜索区划名称，或用右侧级联选择器逐级选择。<br />
        支持实时天气、未来 7 天预报与穿衣建议。
      </p>
      <div class="empty-tags">
        <span class="empty-label">试试：</span>
        <button
          v-for="city in HOT_CITIES"
          :key="city"
          type="button"
          class="empty-tag num"
          @click="onQuickPick(city)"
        >
          {{ city }}
        </button>
      </div>
    </section>

    <!-- 天气数据 -->
    <template v-else>
      <WeatherCard :division="weatherStore.division" :weather="weatherStore.weather" />
      <DailyForecast :weather="weatherStore.weather" />
    </template>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import SearchBar from '../components/SearchBar.vue'
import CityPicker from '../components/CityPicker.vue'
import FavoritesBar from '../components/FavoritesBar.vue'
import WeatherCard from '../components/WeatherCard.vue'
import DailyForecast from '../components/DailyForecast.vue'
import { useCityStore } from '../stores/city'
import { useWeatherStore } from '../stores/weather'
import { useDivisionStore } from '../stores/division'

const cityStore = useCityStore()
const weatherStore = useWeatherStore()
const divisionStore = useDivisionStore()

/** 空状态快捷区划（均为真实存在的主要城市） */
const HOT_CITIES = ['北京市', '上海市', '广州市', '深圳市', '杭州市', '南昌市']

// 进入首页即预加载区划索引（24h 缓存），保证搜索/级联即时可用
onMounted(() => {
  divisionStore.ensureLoaded()
})

/**
 * 选中区划（搜索 / 级联 / 收藏点击）：更新当前区划并拉取天气
 *
 * @param {import('../types').Division} division 区划
 */
function onSelectCity(division) {
  cityStore.setCurrentDivision(division)
  weatherStore.fetchWeather(division)
}

/**
 * 空状态快捷标签：按名称在区划索引中查找并选中
 *
 * @param {string} name 区划名称
 */
function onQuickPick(name) {
  const division = divisionStore.list.find((d) => d.name === name)
  if (division) {
    onSelectCity({ ...division, path: divisionStore.getDivisionPath(division) })
  }
}
</script>

<style scoped>
.search-area {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 16px;
}

.skeleton-card {
  padding: 26px 22px;
}

.skeleton-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 28px;
}

.skeleton-chips {
  display: flex;
  gap: 12px;
}

/* 三态卡片 */
.state-card {
  padding: 44px 22px;
  text-align: center;
}

.empty-card {
  text-align: left;
  padding: 36px 26px;
}

.state-title {
  font-size: 20px;
  font-weight: 700;
  color: var(--c-ink);
  margin-bottom: 10px;
}

.empty-card .state-title {
  font-family: Georgia, 'Times New Roman', 'Songti SC', serif;
}

.state-desc {
  font-size: 14px;
  color: var(--c-ink-secondary);
  line-height: 1.8;
  margin-bottom: 20px;
}

.empty-tags {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 10px;
}

.empty-label {
  font-size: 13px;
  color: var(--c-ink-muted);
}

/* 快捷城市：文字 + 砖红下划线，点击态克制 */
.empty-tag {
  background: none;
  border: none;
  padding: 2px 0;
  font-size: 14px;
  color: var(--c-ink);
  cursor: pointer;
  border-bottom: 1px solid var(--c-accent);
  transition: color 0.15s;
}

.empty-tag:hover {
  color: var(--c-accent);
}

@media (max-width: 640px) {
  .search-area {
    flex-direction: column;
    align-items: stretch;
  }

  .search-area :deep(.city-picker) {
    width: 100%;
  }
}
</style>
