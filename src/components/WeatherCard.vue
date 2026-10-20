<template>
  <section class="weather-hero panel">
    <header class="hero-header">
      <div class="hero-title">
        <h2 class="city-name">{{ division.name }}</h2>
        <p class="city-path">{{ division.path || division.name }}</p>
      </div>
      <el-button
        :type="isFav ? 'warning' : 'primary'"
        :plain="!isFav"
        size="small"
        class="fav-btn"
        @click="onToggleFav"
      >
        {{ isFav ? '已收藏' : '+ 收藏' }}
      </el-button>
    </header>

    <div class="hero-body">
      <div class="hero-glyph">
        <WeatherGlyph :code="current.weatherCode" :size="72" />
      </div>
      <div class="hero-temp">
        <span class="temp-num num">{{ Math.round(current.temperature) }}<i class="temp-unit">°C</i></span>
        <span class="temp-desc">{{ currentInfo.text }}</span>
      </div>
    </div>

    <dl class="hero-meta">
      <div class="meta-row">
        <dt>体感温度</dt>
        <dd class="num">{{ Math.round(current.apparentTemperature) }}°C</dd>
      </div>
      <div class="meta-row">
        <dt>相对湿度</dt>
        <dd class="num">{{ current.humidity }}%</dd>
      </div>
      <div class="meta-row">
        <dt>风速</dt>
        <dd class="num">{{ current.windSpeed }} km/h</dd>
      </div>
    </dl>

    <div v-if="advice.length" class="advice-box">
      <h3 class="advice-title">穿衣建议</h3>
      <ul class="advice-list">
        <li v-for="(item, i) in advice" :key="i">{{ item }}</li>
      </ul>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import { ElMessage } from 'element-plus'
import WeatherGlyph from './WeatherGlyph.vue'
import { getWeatherInfo } from '../utils/weatherCode'
import { getClothingAdvice } from '../utils/clothingAdvice'
import { useFavoritesStore } from '../stores/favorites'

const props = defineProps({
  /** @type {import('vue').PropType<import('../types').Division>} */
  division: { type: Object, required: true },
  /** @type {import('vue').PropType<import('../types').WeatherData>} */
  weather: { type: Object, required: true }
})

const favoritesStore = useFavoritesStore()

const isFav = computed(() => favoritesStore.isFavorite(props.division))
const current = computed(() => props.weather.current)
const currentInfo = computed(() => getWeatherInfo(current.value.weatherCode))

/** 基于今日最高/最低温、降水概率、最大风速生成穿衣建议 */
const advice = computed(() => {
  const today = props.weather.daily[0]
  if (!today) return []
  return getClothingAdvice({
    tempMax: today.tempMax,
    tempMin: today.tempMin,
    precipitationProbability: today.precipitationProbability ?? 0,
    windSpeedMax: today.windSpeedMax ?? 0
  })
})

function onToggleFav() {
  favoritesStore.toggle(props.division)
  if (isFav.value) {
    ElMessage.success(`已收藏 ${props.division.name}`)
  } else {
    ElMessage.info(`已取消收藏 ${props.division.name}`)
  }
}
</script>

<style scoped>
.hero-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--c-line-dark);
}

.city-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--c-ink);
  letter-spacing: 0.5px;
}

.city-path {
  margin-top: 5px;
  color: var(--c-ink-muted);
  font-size: 12.5px;
}

.fav-btn {
  flex-shrink: 0;
}

/* 主区：衬线大温度 */
.hero-body {
  display: flex;
  align-items: center;
  gap: 26px;
  padding: 30px 0 26px;
}

.hero-glyph {
  color: var(--c-ink);
  line-height: 1;
}

.hero-temp {
  display: flex;
  flex-direction: column;
}

.temp-num {
  /* Palatino 数字为齐线体（lining figures），避免 Georgia 老式数字上下起伏 */
  font-family: 'Palatino Linotype', Palatino, 'Book Antiqua', 'Songti SC', 'SimSun', serif;
  font-size: 72px;
  font-weight: 400;
  color: var(--c-ink);
  line-height: 0.95;
  letter-spacing: -1px;
}

.temp-unit {
  font-style: normal;
  font-size: 26px;
  color: var(--c-ink-secondary);
  margin-left: 3px;
}

.temp-desc {
  margin-top: 10px;
  color: var(--c-ink-secondary);
  font-size: 15px;
  font-weight: 600;
}

/* 指标：三列定义列表，细线分隔 */
.hero-meta {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  border-top: 1px solid var(--c-line);
}

.meta-row {
  padding: 14px 8px 2px;
  text-align: center;
}

.meta-row + .meta-row {
  border-left: 1px solid var(--c-line);
}

.meta-row dt {
  font-size: 12px;
  color: var(--c-ink-muted);
  margin-bottom: 6px;
}

.meta-row dd {
  font-size: 17px;
  font-weight: 700;
  color: var(--c-ink);
}

/* 穿衣建议：左竖线强调，无底色 */
.advice-box {
  margin-top: 20px;
  border-top: 1px solid var(--c-line);
  padding-top: 18px;
}

.advice-title {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2px;
  color: var(--c-ink-secondary);
  margin-bottom: 10px;
}

.advice-list {
  list-style: none;
  border-left: 2px solid var(--c-accent);
  padding-left: 14px;
}

.advice-list li {
  font-size: 14px;
  color: var(--c-ink-secondary);
  line-height: 1.9;
}

@media (max-width: 480px) {
  .temp-num {
    font-size: 56px;
  }

  .city-name {
    font-size: 19px;
  }

  .hero-body {
    gap: 18px;
    padding: 24px 0 20px;
  }
}
</style>
